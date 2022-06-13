import { Input, Modal, Spacer, Text } from "@findnlink/neuro-ui";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { storage, firestore } from "../../../lib/firebase";
import styles from "../Dashboard.module.scss";
import { v4 } from "uuid";
import { addDoc, collection } from "firebase/firestore";

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
    setNewAsset((prev) => ({
      ...prev,
      [e.target.name]: e.name == "image" ? e.target.files[0] : e.target.value,
    }));
    e.preventDefault();
  }

  async function confirmNewAsset() {
    if (
      newAsset.image == null ||
      newAsset.sn.length == 0 ||
      newAsset.name.length == 0
    ) {
      toast.error("You need to add a Picture and give a name to it");
      return;
    }

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: "image/jpeg",
    };

    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(
      storage,
      `assets/${newAsset.name}/images/${newAsset.name + "_" + v4()}`
    );
    const uploadTask = uploadBytesResumable(
      storageRef,
      newAsset.image,
      metadata
    );

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            //console.log("Upload is paused");
            break;
          case "running":
            //console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      async () => {
        // Upload completed successfully, now we can get the download URL
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        // Add a new document with a generated id.
        const docRef = await addDoc(collection(firestore, "assets"), {
          name: newAsset.name,
          sn: newAsset.sn,
          imageUrl: downloadUrl,
          time: "",
          status: "",
        });
        console.log("Document written with ID: ", docRef.id);
        toast.success("Asset created successfully");
        setOpen(false);
      }
    );
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
      <input
        name="image"
        type="file"
        value={newAsset.image}
        onChange={newAssetChange}
      />
    </Modal>
  );
}

export default AddAsset;
