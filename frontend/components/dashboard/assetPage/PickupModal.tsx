import {
  Modal,
  Image,
  Input,
  Text,
  Flex,
  ImageGallery,
  Icon,
  TextArea,
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
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  const [assetPictures, setAssetPictures] = useState({
    front: null,
    rightSide: null,
    leftSide: null,
    back: null,
    fuelGuage: null,
    hoursReading: null,
  });
  // const [assetPictureStepMap, setAssetPictureStepMap] = useState(
  //   new Map([
  //     ["1", "front"],
  //     ["2", "rightSide"],
  //     ["3", "leftSide"],
  //     ["4", "back"],
  //     ["5", "fuelGuage"],
  //     ["6", "hoursReading"],
  //   ])
  // );
  // const [assetPictureStep, setAssetPictureStep] = useState(1);

  // const onDropAssetPictures = useCallback((acceptedFiles: any[]) => {
  //   const assetSide = assetPictureStepMap.get(assetPictureStep.toString());
  //   if (assetSide == undefined) return;

  //   acceptedFiles.map((file, index) => {
  //     const reader = new FileReader();
  //     reader.onload = function (e) {
  //       setImages((prevState): any => [
  //         ...prevState,
  //         { id: index, src: e.target!.result },
  //       ]);
  //     };
  //     reader.readAsDataURL(file);
  //     setAssetPictures((prev): any => ({
  //       ...prev,
  //       [assetSide]: file,
  //     }));
  //     if (assetPictureStep < 6) {
  //       setAssetPictureStep((prev): number => prev + 1);
  //     } else {
  //       setAssetPictureStep((prev): number => 1);
  //     }
  //     console.log(assetPictures);
  //     return file;
  //   });
  // }, []);

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

  const ShowInput = ({ name, index }: { name: string; index: number }) => {
    const ref = useRef(null);

    const remove = () => {
      setAssetPictures((prev) => ({ ...prev, [name]: null }));
      if (ref.current) {
        ref.current.value = "";
      }
    };

    const setPicture = (e: any) => {
      setAssetPictures((prev) => ({ ...prev, [name]: ref.current.files[0] }));
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

  // const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
  //   onDrop: onDropAssetPictures,
  // });
  const {
    acceptedFiles: additionalPictureAcceptedFiles,
    getRootProps: additionalPictureGetRootProps,
    getInputProps: additionalPictureGetInputProps,
  } = useDropzone({
    onDrop: onDropAdditional,
  });

  const [formData, setFormData] = useState({
    address: "",
    date: "",
    report: "",
    officeNotes: "",
    officeNotesAccept: false,
    diesel: "0",
    hours: "0",
  });
  const [tableSaveToggle, setTableSaveToggle] = useState<boolean>(false);
  const selectedAsset = useSelector(selectedAssetSelector);
  const [nextPickUp, setNextPickUp] = useState<{
    date: string;
    destination: string;
  } | null>();

  useEffect(() => {
    const findedPickup = selectedAsset?.table.find(
      (value: AssetTableObject) => {
        if (value.status === ASSET_PICK_DROP.PICKUP) {
          return { ...value };
        }
      }
    );
    setNextPickUp({
      date: findedPickup?.date,
      destination: findedPickup?.destination,
    });
  }, [selectedAsset]);

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async () => {
    if (formData.address.length === 0 || formData.date.length === 0) {
      toast.error("You have to give an address and a date");
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
          destination: formData.address,
          status: ASSET_PICK_DROP.PICKUP,
          images: downloadUrls,
        },
      })
    );
    setTableSaveToggle(true);
    return false;
  };

  useAsyncEffect(
    async (stopped) => {
      if (tableSaveToggle) {
        await updateTable(selectedAsset?.id, selectedAsset?.table);
        setTableSaveToggle(false);
      }

      setImages([]);
      setFormData({
        address: "",
        date: "",
        report: "",
        officeNotes: "",
        officeNotesAccept: false,
        diesel: "0",
        hours: "0",
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

  return (
    nextPickUp?.destination && (
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        type="confirm"
        onConfirm={async () => {
          const modalOpen = await submit();
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
          <Text weight="bold">{nextPickUp?.destination}</Text>
          <Text margin="xl 0 m 0" scale="s">
            Date
          </Text>
          <Text weight="bold">{nextPickUp?.date}</Text>
          <Text margin="xl 0 m 0" scale="s">
            Pictures
          </Text>
          {Object.keys(assetPictures).map((key, index) => {
            return <ShowInput key={key} name={key} index={index} />;
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

            <Text
              style={{ width: "30px" }}
              weight="bold"
              scale="m"
              align="right"
            >
              {formData.diesel}L
            </Text>
          </Flex>
          <Text margin="xl 0 m 0" scale="s">
            Hours Reading
          </Text>
          <Input name="hours" value={formData.hours} onChange={handleChange} />
        </Flex>
      </Modal>
    )
  );
}
