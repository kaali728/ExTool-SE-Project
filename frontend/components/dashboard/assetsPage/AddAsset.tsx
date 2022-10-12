import {
  ImageGallery,
  Image,
  Input,
  Modal,
  Spacer,
  Text,
} from "@findnlink/neuro-ui";
import { ref } from "firebase/storage";
import React, { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { storage } from "../../../lib/firebase";
import styles from "../Dashboard.module.scss";
import { v4 } from "uuid";
import { createNewAsset } from "../../../lib/api";
import { useDispatch } from "react-redux";
import { setAssetsChanged } from "../../../lib/slices/assetSlice";
import { ASSET_PICK_DROP, ENGINE, STATUS } from "../../../lib/models/assetEnum";
import { useDropzone } from "react-dropzone";
import { uploadFile } from "../assetPage/uploadImages";

type Props = {
  openModal: boolean;
  setOpen: any;
};
function AddAsset({ openModal, setOpen }: Props) {
  const dispatch = useDispatch();
  const [newAsset, setNewAsset] = useState({
    name: "",
    serialNumber: "",
    diesel: "",
  });
  const [imageUpload, setImageUpload] = useState<any>([{ id: 0, src: "" }]);

  function newAssetChange(e: any) {
    setNewAsset((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    e.preventDefault();
  }

  async function confirmNewAsset(e: any) {
    e.preventDefault();
    if (
      imageUpload == null ||
      newAsset.serialNumber.length == 0 ||
      newAsset.name.length == 0
    ) {
      toast.error(
        "You need to add a picture, give the asset a name and add a serial number"
      );
      return;
    }

    const storageRef = ref(
      storage,
      `assets/${newAsset.name}/images/${newAsset.name + "_" + v4()}`
    );

    const url = await uploadFile(storageRef, assetImageAcceptedFiles[0]);

    await createNewAsset({
      id: "",
      name: newAsset.name,
      serialNumber: newAsset.serialNumber,
      imageUrl: url,
      status: STATUS.CONFIRMED,
      time: 0,
      table: [
        {
          date: new Date().toJSON(),
          status: ASSET_PICK_DROP.ASSET_CREATED,
          destination: "",
          confirmed: false,
        },
      ],
      engine: ENGINE.STOPED,
      location: { long: 0, lat: 0 },
      machineHours: 0,
      diesel: newAsset.diesel,
    });
    dispatch(setAssetsChanged({ changed: true }));
    setOpen(false);
  }

  const onDropAdditional = useCallback((assetImageAcceptedFiles: any[]) => {
    assetImageAcceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImageUpload((prev: any) => [{ id: index, src: e.target!.result }]);
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

  const {
    acceptedFiles: assetImageAcceptedFiles,
    getRootProps: assetImageFilesGetRootProps,
    getInputProps: assetImageFilesGetInputProps,
  } = useDropzone({
    onDrop: onDropAdditional,
  });

  return (
    <Modal
      open={openModal}
      onClose={() => {
        setOpen(false);
      }}
      _class={styles.assetModal}
      scale={"xl"}
      padding={"xl"}
      type={"confirm"}
      onConfirm={confirmNewAsset}
    >
      <Text scale="l" primary>
        New Asset
      </Text>
      <Input
        name="name"
        value={newAsset.name}
        placeholder="Name of your Asset"
        onChange={newAssetChange}
      />
      <Spacer />
      <Input
        name="serialNumber"
        placeholder="S/N"
        value={newAsset.serialNumber}
        onChange={newAssetChange}
      />
      <Spacer />
      <Input
        name="diesel"
        type={"number"}
        placeholder="Fuel volumn"
        value={newAsset.diesel}
        onChange={newAssetChange}
      />
      <Spacer />
      <div
        {...assetImageFilesGetRootProps({ className: "dropzone" })}
        style={{
          border: "2px dashed var(--text300)",
          padding: "10px",
          borderRadius: "var(--borderRadius)",
        }}
      >
        <input {...assetImageFilesGetInputProps()} />
        <Text padding="xl" align="center">
          Drag &apos;n&apos; drop, or click to select files
        </Text>
      </div>
      <Spacer />
      <Image src={imageUpload[0].src} />
    </Modal>
  );
}

export default AddAsset;
