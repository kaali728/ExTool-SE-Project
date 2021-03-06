import { Input, Modal, Spacer, Text } from "@findnlink/neuro-ui";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { storage, STATE_CHANGED } from "../../../lib/firebase";
import styles from "../Dashboard.module.scss";
import { v4 } from "uuid";
import { createNewAsset } from "../../../lib/api";
import { useDispatch } from "react-redux";
import { setAssetsChanged } from "../../../lib/slices/assetSlice";
import { ASSET_PICK_DROP, ENGINE, STATUS } from "../../../lib/models/assetEnum";

type Props = {
  openModal: boolean;
  setOpen: any;
};
function AddAsset({ openModal, setOpen }: Props) {
  const dispatch = useDispatch();
  const [newAsset, setNewAsset] = useState({
    name: "",
    serialNumber: "",
  });
  const [imageUpload, setImageUpload] = useState<File | null>(null);

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
    const url = await uploadFiles(imageUpload);
    await createNewAsset({
      id: "",
      name: newAsset.name,
      serialNumber: newAsset.serialNumber,
      imageUrl: url,
      status: STATUS.CONFIRMED,
      time: 0,
      table: [
        {
          date: new Date().toString(),
          status: ASSET_PICK_DROP.ASSET_CREATED,
          destination: "",
          confirmed: false,
        },
      ],
      engine: ENGINE.STOPED,
      location: { long: 0, lat: 0 },
      machineHours: 0,
    });
    dispatch(setAssetsChanged({ changed: true }));
    setOpen(false);
  }

  async function uploadFiles(files: any) {
    if (!files) return;

    console.log(files);

    const storageRef = ref(
      storage,
      `assets/${newAsset.name}/images/${newAsset.name + "_" + v4()}`
    );

    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadTask = uploadBytesResumable(storageRef, imageUpload!, metadata);

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
  }

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
      <input
        type="file"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;
          setImageUpload(e.target.files[0]);
        }}
      />
    </Modal>
  );
}

export default AddAsset;
