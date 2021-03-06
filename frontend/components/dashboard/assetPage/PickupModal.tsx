import {
  Modal,
  Image,
  Input,
  Text,
  Flex,
  ImageGallery,
  Icon,
} from "@findnlink/neuro-ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { updateTable } from "lib/api";
import { useDispatch, useSelector } from "react-redux";
import {
  AssetTableObject,
  selectedAssetSelector,
  updateSelectedAssetTable,
} from "lib/slices/assetSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, STATE_CHANGED } from "../../../lib/firebase";
import toast, { Toaster } from "react-hot-toast";
import { v4 } from "uuid";
import useAsyncEffect from "lib/hooks/useAsyncEffect";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";

export default function PickupModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: (arg: boolean) => any;
  data: any;
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    destination: "",
    date: "",
    report: "",
    officeNotes:
      "Please don't forget to pick up the attachments with the machine.",
    officeNotesAccept: false,
    diesel: 0,
    hours: 0,
  });
  const [images, setImages] = useState([]);
  const [assetPictures, setAssetPictures] = useState({
    front: null,
    rightSide: null,
    leftSide: null,
    back: null,
    fuelGuage: null,
    hoursReading: null,
  }) as any;
  const [tableSaveToggle, setTableSaveToggle] = useState<boolean>(false);
  const selectedAsset = useSelector(selectedAssetSelector);

  const onDropAdditional = useCallback(
    (additionalPictureAcceptedFiles: any[]) => {
      additionalPictureAcceptedFiles.map((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
          setImages((prevState): any => [
            ...prevState,
            { id: index, src: e.target!.result },
          ]);
        };
        reader.readAsDataURL(file);
        return file;
      });
    },
    []
  );

  const {
    acceptedFiles: additionalPictureAcceptedFiles,
    getRootProps: additionalPictureGetRootProps,
    getInputProps: additionalPictureGetInputProps,
  } = useDropzone({
    onDrop: onDropAdditional,
  });

  useEffect(() => {
    const findedPickup = selectedAsset?.table.find(
      (value: AssetTableObject) => {
        if (value.status === ASSET_PICK_DROP.PICKUP) {
          return { ...value };
        }
      }
    );

    setFormData((prev) => ({
      ...prev,
      date: findedPickup?.date,
      address: findedPickup?.destination,
    }));
  }, [selectedAsset]);

  useAsyncEffect(
    async (stopped) => {
      if (tableSaveToggle) {
        await updateTable(selectedAsset?.id, selectedAsset?.table);
        setTableSaveToggle(false);

        setImages([]);
        setFormData({
          destination: "",
          date: "",
          report: "",
          officeNotes:
            "Please don't forget to pick up the attachments with the machine.",
          officeNotesAccept: false,
          diesel: 0,
          hours: 0,
        });
        setAssetPictures({
          front: null,
          rightSide: null,
          leftSide: null,
          back: null,
          fuelGuage: null,
          hoursReading: null,
        });
        additionalPictureAcceptedFiles.splice(
          0,
          additionalPictureAcceptedFiles.length
        );
      }

      if (stopped()) return;
    },
    [tableSaveToggle]
  );

  function uploadFiles(files: any) {
    if (!files) return;
    const metadata = {
      contentType: "image/jpeg",
    };

    let urls = files.map(async (image: any, index: number) => {
      const storageRef = ref(
        storage,
        `assets/${selectedAsset?.name}/images/pickups/pick-up-${
          formData.date
        }-${v4()}`
      );
      const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      uploadTask.on(
        STATE_CHANGED,
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              toast.error("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              // User canceled the upload
              toast.error("User canceled the upload");
              break;
          }
        }
      );
      await uploadTask;
      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadUrl;
    });

    let _downloadUrls = Promise.all(urls).then(function (results) {
      return results;
    });

    return _downloadUrls;
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;

    switch (name) {
      case "diesel":
      case "hours": {
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
        break;
      }
      case "officeNotesAccept": {
        setFormData((prev) => ({ ...prev, [name]: checked }));
        break;
      }
      default: {
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.officeNotesAccept) {
      toast.error("Accept the office note!");
      return true;
    }

    const downloadUrls = await uploadFiles(additionalPictureAcceptedFiles);

    if (downloadUrls == undefined) {
      toast.error("Could not upload Images!");
      return true;
    }

    //TODO: Die status auf PICKED_UP setzen und die confirm auf true
    dispatch(
      updateSelectedAssetTable({
        tableContent: {
          date: formData.date,
          destination: formData.destination,
          status: ASSET_PICK_DROP.PICKUP,
          images: downloadUrls,
          diesel: formData.diesel,
          hours: formData.hours,
          officeNotes: formData.officeNotes,
          officeNotesAccept: formData.officeNotesAccept,
          report: formData.report,
        },
      })
    );
    setTableSaveToggle(true);
    return false;
  };

  const ShowPictureInput = ({
    name,
    index,
  }: {
    name: string;
    index: number;
  }) => {
    const ref = useRef(null) as any;

    const remove = () => {
      setAssetPictures((prev: any) => ({ ...prev, [name]: null }));
      if (ref.current) {
        ref.current.value = "";
      }
    };

    const setPicture = (e: any) => {
      setAssetPictures((prev: any) => ({
        ...prev,
        [name]: ref.current.files[0],
      }));
    };

    return (
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Icon
          style={assetPictures[name] ? {} : { visibility: "hidden" }}
          padding="m"
          pointer
          icon="cross"
          onClick={() => remove()}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text margin="0 l 0 0">{name}:</Text>
          <img
            src={
              assetPictures[name]
                ? URL.createObjectURL(assetPictures[name])
                : ""
            }
            width={40}
            height={40}
            style={
              assetPictures[name]
                ? { borderRadius: "5px", margin: "5px", objectFit: "cover" }
                : { display: "none" }
            }
          ></img>
        </div>
        <input
          style={{ width: "200px", backgroundColor: "var(--bg300)" }}
          ref={ref}
          type="file"
          onChange={setPicture}
        ></input>
      </Flex>
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      type="confirm"
      onConfirm={async () => {
        const modalOpen = await handleSubmit();
        setOpen(modalOpen);
      }}
    >
      <Text weight="bold" scale="xl">
        Pickup
      </Text>
      <Flex>
        <Text margin="xl 0 m 0" scale="s">
          Address
        </Text>
        <Text weight="bold">{formData.destination}</Text>
        <Text margin="xl 0 m 0" scale="s">
          Date
        </Text>
        <Text weight="bold">{formData.date}</Text>
        <Text margin="xl 0 m 0" scale="s">
          Pictures
        </Text>
        {Object.keys(assetPictures).map((key, index) => {
          return <ShowPictureInput key={key} name={key} index={index} />;
        })}
        <Text scale="s">Additional Pictures</Text>
        <div
          {...additionalPictureGetRootProps({ className: "dropzone" })}
          style={{
            border: "2px dashed var(--text300)",
            padding: "10px",
            borderRadius: "var(--borderRadius)",
          }}
        >
          <input {...additionalPictureGetInputProps()} />
          <Text padding="xl" align="center">
            Drag 'n' drop, or click to select files
          </Text>
        </div>
        {images.length > 0 && (
          <ImageGallery margin="xl 0" showPaginate>
            {images.map((image: any, index: number) => (
              <Image key={index} src={image.src} />
            ))}
          </ImageGallery>
        )}

        <Text margin="xl 0 m 0" scale="s">
          Pick up report
        </Text>
        <textarea
          name="report"
          value={formData.report}
          onChange={handleChange}
        />

        <Text margin="xl 0 m 0" scale="s">
          Diesel Reading
        </Text>

        <Flex
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <input
            style={{ width: "100%" }}
            name="diesel"
            value={formData.diesel}
            onChange={handleChange}
            type="range"
            min="0"
            max="25"
          />

          <Text style={{ width: "30px" }} weight="bold" scale="m" align="right">
            {formData.diesel}L
          </Text>
        </Flex>
        <Text margin="xl 0 m 0" scale="s">
          Hours Reading
        </Text>
        <Input
          name="hours"
          type={"number"}
          value={formData.hours.toString()}
          onChange={handleChange}
        />
        <Flex flexDirection="row" margin="xl 0 0 0">
          <input
            type="checkbox"
            name="officeNotesAccept"
            onClick={handleChange}
            defaultChecked={formData.officeNotesAccept}
            id="officeNotesAccept"
          />
          <label style={{ marginLeft: "10px" }} htmlFor="officeNotesAccept">
            {formData.officeNotes}
          </label>
        </Flex>
      </Flex>
    </Modal>
  );
}
