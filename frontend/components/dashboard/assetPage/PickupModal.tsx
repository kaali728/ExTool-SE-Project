import {
  Modal,
  Image,
  Input,
  Text,
  Flex,
  ImageGallery,
} from "@findnlink/neuro-ui";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { updateTable } from "lib/api";
import { useDispatch, useSelector } from "react-redux";
import {
  selectedAssetSelector,
  updateSelectedAssetTable,
} from "lib/slices/assetSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, STATE_CHANGED } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { v4 } from "uuid";

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
  const onDrop = useCallback((acceptedFiles: any[]) => {
    acceptedFiles.map((file, index) => {
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
  }, []);

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const [formData, setFormData] = useState({ address: "", date: "" });
  const selectedAsset = useSelector(selectedAssetSelector);

  const submit = async () => {
    // zuerst bild hochladen
    // url nehmen und dann in table speichern
    // update table

    const downloadUrls = await uploadFiles(images);
    if (downloadUrls == undefined) return;

    console.log("downloadUrls", downloadUrls);

    dispatch(
      updateSelectedAssetTable({
        tableContent: {
          date: formData.date,
          destination: formData.address,
          status: "Pickup",
          images: downloadUrls,
        },
      })
    );
    await updateTable(selectedAsset?.id, selectedAsset?.table);
  };

  function uploadFiles(files: any) {
    if (!files) return;
    let urls: any = [];
    //console.log(files);

    const metadata = {
      contentType: "image/jpeg",
    };
    console.log(acceptedFiles);

    acceptedFiles.forEach(async (image, index: number) => {
      const storageRef = ref(
        storage,
        `assets/${selectedAsset?.name}/images/pick-up-${formData.date}-${v4()}`
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
      console.log("downloadUrl", downloadUrl);
      console.log("urls push", urls);
      //urls.push("test");
      //urls.push(downloadUrl);
    });

    return urls;
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      type="confirm"
      onConfirm={async () => {
        await submit();
        setOpen(false);
      }}
    >
      <Text weight="bold" scale="xl">
        Pickup
      </Text>
      <Flex>
        <Text scale="s">Address</Text>
        <Input
          scale="l"
          name={"pickup-address"}
          placeholder="Address"
          value={formData.address}
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, address: e.target.value }));
          }}
          margin="0 0 m 0"
        />
        <Text scale="s">Date</Text>
        <Input
          scale="l"
          margin="0 0 m 0"
          type={"date"}
          id="pickup-date"
          name="pickup-date"
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, date: e.target.value }));
          }}
        />
        <Text scale="s">Pictures</Text>
        <div
          {...getRootProps({ className: "dropzone" })}
          style={{
            border: "2px dashed var(--text300)",
            padding: "10px",
            borderRadius: "var(--borderRadius)",
          }}
        >
          <input {...getInputProps()} />
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
      </Flex>
    </Modal>
  );
}