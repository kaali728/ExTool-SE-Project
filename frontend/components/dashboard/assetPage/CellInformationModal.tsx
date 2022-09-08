import {
  Modal,
  Input,
  Text,
  Flex,
  ImageGallery,
  Button,
  Grid,
  CardHeader,
  Card,
  CardContent,
} from "@findnlink/neuro-ui";
import { getDownloadURlFromPath } from "lib/firebase";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { GrMapLocation } from "react-icons/gr";
import { useDispatch } from "react-redux";
import { AssetTableObject } from "types/global";
import scss from "./Table.module.scss";

export default function CellInformationModal({
  open,
  setOpen,
  cellData,
}: {
  open: boolean;
  setOpen: (arg: boolean) => any;
  cellData?: AssetTableObject;
}) {
  const dispatch = useDispatch();

  if (cellData === undefined) return <></>;

  function getDownloadUrlImage(filePath: string) {
    let url = "/test.jpg";
    getDownloadURlFromPath(filePath).then((downloadUrl) => {
      url = downloadUrl;
    });
    console.log(url);

    return url;
  }

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
        {cellData.confirmed && (
          <Flex>
            <Text margin="xl 0 m 0" scale="s">
              Pictures
            </Text>
            <Grid>
              <Card pointer>
                <CardHeader>
                  <Image
                    width={30}
                    height={30}
                    src={getDownloadUrlImage(cellData.images!.front)}
                  />
                </CardHeader>
                <CardContent>
                  <Text>Front</Text>
                </CardContent>
              </Card>
              <Card pointer>
                <CardHeader>
                  <Image
                    width={30}
                    height={30}
                    src={getDownloadUrlImage(cellData.images!.back)}
                  />
                </CardHeader>
                <CardContent>
                  <Text>Back</Text>
                </CardContent>
              </Card>
              <Card pointer>
                <CardHeader>
                  <Image
                    width={30}
                    height={30}
                    src={getDownloadUrlImage(cellData.images!.rightSide)}
                  />
                </CardHeader>
                <CardContent>
                  <Text>rightSide</Text>
                </CardContent>
              </Card>
              <Card pointer>
                <CardHeader>
                  <Image
                    width={30}
                    height={30}
                    src={getDownloadUrlImage(cellData.images!.leftSide)}
                  />
                </CardHeader>
                <CardContent>
                  <Text>leftSide</Text>
                </CardContent>
              </Card>
              <Card pointer>
                <CardHeader>
                  <Image
                    width={30}
                    height={30}
                    src={getDownloadUrlImage(cellData.images!.hoursReading)}
                  />
                </CardHeader>
                <CardContent>
                  <Text>hoursReading</Text>
                </CardContent>
              </Card>
              <Card pointer>
                <CardHeader>
                  <Image
                    width={30}
                    height={30}
                    src={getDownloadUrlImage(cellData.images!.fuelGuage)}
                  />
                </CardHeader>
                <CardContent>
                  <Text>Fuel Guage</Text>
                </CardContent>
              </Card>
            </Grid>
          </Flex>
        )}
      </Flex>
    </Modal>
  );
}
