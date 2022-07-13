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

  const submit = async () => {
    await updateTable(data.id, data.table);
    console.log("submit");
  };

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
        Drop Off
      </Text>
      <Flex>
        <Text scale="s">Address</Text>
        <Input
          scale="l"
          name={"dropoff-address"}
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
