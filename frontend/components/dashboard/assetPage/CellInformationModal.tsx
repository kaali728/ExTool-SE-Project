import {
  Modal,
  Text,
  Flex,
  ImageGallery,
  Grid,
  CardHeader,
  Card,
  CardContent,
} from "@findnlink/neuro-ui";
import { getDownloadURlFromPath } from "lib/firebase";
import useAsyncEffect from "lib/hooks/useAsyncEffect";
import Image from "next/image";
import React, { useState } from "react";
import { GrMapLocation } from "react-icons/gr";
import { AssetPictures, AssetTableObject } from "types/global";
import scss from "./Table.module.scss";

export default function CellInformationModal({
  open,
  setOpen,
  cellData,
}: {
  open: boolean;
  setOpen: (arg: boolean) => any;
  cellData: AssetTableObject;
}) {
  const [images, setImages] = useState<AssetPictures>({
    front: "",
    rightSide: "",
    leftSide: "",
    back: "",
    fuelGuage: "",
    hoursReading: "",
  });

  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  useAsyncEffect(async () => {
    if (cellData.images) {
      setImages({
        front: await getDownloadURlFromPath(cellData.images!.front),
        rightSide: await getDownloadURlFromPath(cellData.images!.rightSide),
        leftSide: await getDownloadURlFromPath(cellData.images!.leftSide),
        back: await getDownloadURlFromPath(cellData.images!.back),
        fuelGuage: await getDownloadURlFromPath(cellData.images!.fuelGuage),
        hoursReading: await getDownloadURlFromPath(
          cellData.images!.hoursReading
        ),
      });
    }
  }, []);

  useAsyncEffect(async () => {
    if (cellData.additionalImages && cellData.additionalImages.length > 0) {
      console.log(additionalImages);
      let addImages: any = [];
      cellData.additionalImages.map(async (imagePath) => {
        let url = await getDownloadURlFromPath(imagePath);
        addImages.push(url);
      });

      setAdditionalImages(addImages);
    }
  }, [cellData]);

  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      type="confirm"
    >
      <Text weight="bold" scale="xl">
        {cellData.status}
      </Text>
      <Flex>
        <Text margin="xl 0 m 0" scale="s">
          Address
        </Text>
        <Text weight="bold">{cellData.destination}</Text>
        <Text href={`https://maps.google.com/?q=${cellData.destination}`}>
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
        <Text weight="bold">{cellData.date}</Text>

        <Text margin="xl 0 m 0" scale="s">
          Report
        </Text>
        <Text weight="bold">{cellData.report}</Text>

        <Text margin="xl 0 m 0" scale="s">
          Hours
        </Text>
        <Text weight="bold">{cellData.hours}</Text>

        <Text margin="xl 0 m 0" scale="s">
          Diesel
        </Text>
        <Text weight="bold">{cellData.diesel}</Text>

        <Text margin="xl 0 m 0" scale="s">
          Office Notes
        </Text>
        {cellData.officeNotes?.map((officeNote: any, index) => (
          <Flex flexDirection="row" key={index}>
            <input type={"checkbox"} value={officeNote.checked}></input>
            <Text margin="m" weight="bold">
              {officeNote.text}
            </Text>
          </Flex>
        ))}
      </Flex>

      {cellData.confirmed && (
        <div className={"imageContainer"}>
          <Flex>
            <Text margin="xl 0 m 0" scale="s">
              Pictures
            </Text>
            {images.front !== "" && (
              <Grid>
                <Card pointer margin="0">
                  <CardHeader margin="0">
                    <a
                      href={images.hoursReading as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={images.front as string}
                      />
                    </a>
                  </CardHeader>
                  <CardContent margin="0">
                    <Text margin="0 0 l 0" align="center">
                      Front
                    </Text>
                  </CardContent>
                </Card>
                <Card pointer margin="0">
                  <CardHeader margin="0">
                    <a
                      href={images.hoursReading as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={images.back as string}
                      />
                    </a>
                  </CardHeader>
                  <CardContent margin="0">
                    <Text margin="0 0 l 0" align="center">
                      Back
                    </Text>
                  </CardContent>
                </Card>
                <Card pointer margin="0">
                  <CardHeader margin="0">
                    <a
                      href={images.hoursReading as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={images.rightSide as string}
                      />
                    </a>
                  </CardHeader>
                  <CardContent margin="0">
                    <Text margin="0 0 l 0" align="center">
                      Right side
                    </Text>
                  </CardContent>
                </Card>
                <Card pointer margin="0">
                  <CardHeader margin="0">
                    <a
                      href={images.hoursReading as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={images.leftSide as string}
                      />
                    </a>
                  </CardHeader>
                  <CardContent margin="0">
                    <Text margin="0 0 l 0" align="center">
                      Left side
                    </Text>
                  </CardContent>
                </Card>
                <Card pointer margin="0">
                  <CardHeader margin="0">
                    <a
                      href={images.hoursReading as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={images.hoursReading as string}
                      />
                    </a>
                  </CardHeader>
                  <CardContent margin="0">
                    <Text margin="0 0 l 0" align="center">
                      Hours reading
                    </Text>
                  </CardContent>
                </Card>
                <Card pointer margin="0">
                  <CardHeader margin="0">
                    <a
                      href={images.hoursReading as string}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        width={200}
                        height={200}
                        src={images.fuelGuage as string}
                      />
                    </a>
                  </CardHeader>
                  <CardContent margin="0">
                    <Text margin="0 0 l 0" align="center">
                      Fuel guage
                    </Text>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Flex>
        </div>
      )}
      {additionalImages.length > 0 ? (
        <ImageGallery margin="xl 0" showPaginate>
          {additionalImages.map((image: any, index: number) => (
            <Image key={index} src={image} />
          ))}
        </ImageGallery>
      ) : null}
    </Modal>
  );
}
