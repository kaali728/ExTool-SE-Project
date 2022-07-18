import {
  Modal,
  Image,
  Input,
  Text,
  Flex,
  ImageGallery,
} from "@findnlink/neuro-ui";
import React, { useCallback, useEffect, useState } from "react";
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
import toast from "react-hot-toast";
import { v4 } from "uuid";
import useAsyncEffect from "lib/hooks/useAsyncEffect";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";

export default function DropoffModal({
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
  const [tableSaveToggle, setTableSaveToggle] = useState<boolean>(false);
  const selectedAsset = useSelector(selectedAssetSelector);
  const [nextDropOff, setNextDropOff] = useState<{
    date: string;
    destination: string;
  } | null>();

  useEffect(() => {
    const findedPickup = selectedAsset?.table.find(
      (value: AssetTableObject) => {
        if (value.status === ASSET_PICK_DROP.DROP_OFF) {
          return { ...value };
        }
      }
    );
    setNextDropOff({
      date: findedPickup?.date,
      destination: findedPickup?.destination,
    });
  }, [selectedAsset]);

  const submit = async () => {
    if (
      formData.address.length === 0 ||
      formData.date.length === 0 ||
      images.length === 0
    ) {
      toast.error("You have to give an address, a date and upload a picture");
      return true;
    }

    const downloadUrls = await uploadFiles(images);

    if (downloadUrls == undefined) {
      toast.error("Could not upload Images!");
      return true;
    }

    dispatch(
      updateSelectedAssetTable({
        tableContent: {
          date: formData.date,
          destination: formData.address,
          status: ASSET_PICK_DROP.DROP_OFF,
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
      setFormData({ address: "", date: "" });
      acceptedFiles.splice(0, acceptedFiles.length);

      if (stopped()) return;
    },
    [tableSaveToggle]
  );

  function uploadFiles(files: any) {
    if (!files) return;
    const metadata = {
      contentType: "image/jpeg",
    };

    let urls = acceptedFiles.map(async (image, index: number) => {
      const storageRef = ref(
        storage,
        `assets/${selectedAsset?.name}/images/drop-off-${formData.date}-${v4()}`
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
    nextDropOff && (
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
          Dropoff
        </Text>
        <Flex>
          <Text scale="s">Address</Text>
          <Text weight="bold">{nextDropOff.destination}</Text>
          <Text scale="s">Date</Text>
          <Text weight="bold">{nextDropOff.date}</Text>
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
    )
  );
}
