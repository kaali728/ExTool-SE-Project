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
  selectedAssetSelector,
  updateSelectedAssetTable,
} from "lib/slices/assetSlice";

import toast from "react-hot-toast";
import { v4 } from "uuid";
import useAsyncEffect from "lib/hooks/useAsyncEffect";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import { uploadAdditionalFiles, uploadImagesFiles } from "./uploadImages";
import { AssetFormData, AssetTableObject, OfficeNote } from "types/global";
import { GrMapLocation } from "react-icons/gr";
import scss from "./PickupDropoff.module.scss";

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
  const [formData, setFormData] = useState<AssetFormData>({
    destination: "",
    date: "",
    report: "",
    officeNotes: [],
    diesel: 0,
    hours: 0,
    confirmed: false,
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
    if (open && selectedAsset !== null) {
      const foundPickup = selectedAsset.table.find(
        (value: AssetTableObject, index: number) => {
          if (value.status === ASSET_PICK_DROP.PICKUP) {
            return {
              date: value.date,
              destination: value.destination,
              officeNotes: value.officeNotes,
              index: index,
            };
          }
        }
      );

      if (foundPickup === undefined) {
        return;
      }

      setFormData((prev: any) => ({
        ...prev,
        date: foundPickup.date,
        destination: foundPickup.destination,
        officeNotes: foundPickup.officeNotes,
      }));
    }
  }, [selectedAsset, open]);

  useAsyncEffect(
    async (stopped) => {
      if (tableSaveToggle && selectedAsset !== null) {
        await updateTable(selectedAsset.id, selectedAsset.table);
        setTableSaveToggle(false);

        setImages([]);
        setFormData({
          destination: "",
          date: "",
          report: "",
          officeNotes: [],
          diesel: 0,
          hours: 0,
          confirmed: false,
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

  const handleChange = (e: any) => {
    const { name, value, checked } = e.target;

    if (name.includes("officeNotes")) {
      const noteIndex = Number(name.replace("officeNotes", ""));
      setFormData((prev) => ({
        ...prev,
        officeNotes: prev.officeNotes.map((officeNote, index) => {
          if (index === noteIndex) {
            return { ...officeNote, checked };
          }
          return officeNote;
        }),
      }));

      return;
    }

    switch (name) {
      case "diesel":
      case "hours": {
        setFormData((prev) => ({ ...prev, [name]: parseInt(value) }));
        break;
      }
      default: {
        setFormData((prev) => ({ ...prev, [name]: value }));
        break;
      }
    }
  };

  function checkIfAllOfficeNotesChecked() {
    let allChecked: boolean[] = formData.officeNotes.map(
      (officeNote: OfficeNote) => {
        return officeNote.checked;
      }
    );
    return allChecked.includes(false);
  }

  const handleSubmit = async () => {
    if (checkIfAllOfficeNotesChecked()) {
      toast.error("Accept the office note!");
      return true;
    }

    const imagesDownloadUrl = await uploadImagesFiles(
      assetPictures,
      `assets/${selectedAsset?.name}/images/pickups-${formData.date}/pictures/pick-up-${formData.date}`
    );

    const additionalDownloadUrls = await uploadAdditionalFiles(
      additionalPictureAcceptedFiles,
      `assets/${selectedAsset?.name}/images/pickups-${
        formData.date
      }/additionalImages/pick-up-${formData.date}-${v4()}`
    );

    if (imagesDownloadUrl == undefined || additionalDownloadUrls == undefined) {
      toast.error("Could not upload Images!");
      return true;
    }

    dispatch(
      updateSelectedAssetTable({
        tableContent: {
          date: formData.date,
          destination: formData.destination,
          status: ASSET_PICK_DROP.PICKEDUP,
          images: imagesDownloadUrl,
          additionalImages: additionalDownloadUrls,
          diesel: formData.diesel,
          hours: formData.hours,
          officeNotes: formData.officeNotes,
          report: formData.report,
          confirmed: true,
          confirmedDate: new Date().toISOString(),
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
        <Text href={`https://maps.google.com/?q=${formData.destination}`}>
          <Flex flexDirection="row" alignItems="center">
            <GrMapLocation className={scss.icon} />
            <Text margin="0 0 0 m" padding="0">
              Open map
            </Text>
          </Flex>
        </Text>

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
            Drag &apos;n&apos; drop, or click to select files
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
            max={selectedAsset?.diesel}
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
        <Text margin="xl 0 m 0" scale="s">
          Office Notes
        </Text>
        {formData.officeNotes.map((officeNote: OfficeNote, index) => (
          <Flex key={index} flexDirection="row" margin="xl 0 0 0">
            <input
              type="checkbox"
              name={"officeNotes" + index}
              onChange={handleChange}
              defaultChecked={officeNote.checked}
              id={"officeNotes" + index}
            />
            <label
              style={{ marginLeft: "10px" }}
              htmlFor={"officeNotes" + index}
            >
              {officeNote.text}
            </label>
          </Flex>
        ))}
      </Flex>
    </Modal>
  );
}
