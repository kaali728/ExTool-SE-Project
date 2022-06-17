import { Input, Modal, Spacer, Text } from "@findnlink/neuro-ui";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { storage, firestore, STATE_CHANGED } from "../../../lib/firebase";
import styles from "../Dashboard.module.scss";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";
import { createNewAsset } from "../../../lib/api";
import { Asset } from "../../../types/global";

type Props = {
  openModal: boolean;
  setOpen: any;
};
function AddAsset({ openModal, setOpen }: Props) {
  const [newAsset, setNewAsset] = useState({
    name: "",
    sn: "",
    image: null,
  });

  function newAssetChange(e: any) {
    let uploadImage: any;
    if (e.name === "image") {
      let reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function (e) {
        uploadImage = e.target?.result;
      };
    }

    setNewAsset((prev) => ({
      ...prev,
      [e.target.name]:
        e.name == "image" ? new Blob([uploadImage]) : e.target.value,
    }));
    e.preventDefault();
  }

  async function confirmNewAsset(e: any) {
    e.preventDefault();
    if (
      newAsset.image == null ||
      newAsset.sn.length == 0 ||
      newAsset.name.length == 0
    ) {
      toast.error("You need to add a Picture and give a name to it");
      return;
    }
    const url = await uploadFiles(newAsset.image);
    await createNewAsset({
      id: "",
      name: newAsset.name,
      sn: newAsset.sn,
      imageUrl: url,
      time: "",
      status: "",
    });
    setOpen(false);
  }

  async function uploadFiles(files: any) {
    if (!files) return;

    console.log(typeof files);

    const storageRef = ref(
      storage,
      `assets/${newAsset.name}/images/${newAsset.name + "_" + v4()}`
    );

    const metadata = {
      contentType: "image/jpeg",
    };

    const uploadTask = uploadBytesResumable(storageRef, files, metadata);

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
        name="sn"
        placeholder="S/N"
        value={newAsset.sn}
        onChange={newAssetChange}
      />
      <Spacer />
      <input name="image" type="file" onChange={newAssetChange} />
    </Modal>
  );
}

export default AddAsset;
