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
  selectedAssetSelector,
  updateSelectedAssetTable,
} from "lib/slices/assetSlice";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, STATE_CHANGED } from "../../../lib/firebase";
import toast from "react-hot-toast";
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
    front: "",
    rightSide: "",
    leftSide: "",
    back: "",
    fuelGuage: "",
    hoursReading: "",
  });
  const [assetPictureStepMap, setAssetPictureStepMap] = useState(
    new Map([
      ["1", "front"],
      ["2", "rightSide"],
      ["3", "leftSide"],
      ["4", "back"],
      ["5", "fuelGuage"],
      ["6", "hoursReading"],
    ])
  );
  const [assetPictureStep, setAssetPictureStep] = useState(1);

  const onDropAssetPictures = useCallback((acceptedFiles: any[]) => {
    const assetSide = assetPictureStepMap.get(assetPictureStep.toString());
    if (assetSide == undefined) return;

    acceptedFiles.map((file, index) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        setImages((prevState): any => [
          ...prevState,
          { id: index, src: e.target!.result },
        ]);
      };
      reader.readAsDataURL(file);
      setAssetPictures((prev): any => ({
        ...prev,
        [assetSide]: file,
      }));
      if (assetPictureStep < 6) {
        setAssetPictureStep((prev): number => prev + 1);
      } else {
        setAssetPictureStep((prev): number => 1);
      }
      console.log(assetPictures);
      return file;
    });
  }, []);

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

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop: onDropAssetPictures,
  });
  const {
    acceptedFiles: additionalPictureAcceptedFiles,
    getRootProps: additionalPictureGetRootProps,
    getInputProps: additionalPictureGetInputProps,
  } = useDropzone({
    onDrop: onDropAdditional,
  });

  const [formData, setFormData] = useState({ address: "", date: "" });
  const [tableSaveToggle, setTableSaveToggle] = useState<boolean>(false);
  const selectedAsset = useSelector(selectedAssetSelector);

  const submit = async () => {
    if (formData.address.length === 0 || formData.date.length === 0) {
      toast.error("You have to give an address and a date");
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
      setFormData({ address: "", date: "" });
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

    let urls = additionalPictureAcceptedFiles.map(
      async (image, index: number) => {
        const storageRef = ref(
          storage,
          `assets/${selectedAsset?.name}/images/pick-up-${
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
                toast.error(
                  "User doesn't have permission to access the object"
                );
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
    );

    let _downloadUrls = Promise.all(urls).then(function (results) {
      return results;
    });

    return _downloadUrls;
  }

  return (
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
          value={formData.date}
          id="pickup-date"
          name="pickup-date"
          onChange={(e) => {
            setFormData((prev) => ({ ...prev, date: e.target.value }));
          }}
        />
        {/* <Text scale="s">Asset Picture</Text>
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
            Drop a picture of:
          </Text>
          <Text weight="bold" padding="xl" align="center">
            {assetPictureStep}.{" "}
            {assetPictureStepMap.get(assetPictureStep.toString())}
          </Text>
        </div> */}
        <Text scale="s">Add Pictures</Text>
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
      </Flex>
    </Modal>
  );
}
