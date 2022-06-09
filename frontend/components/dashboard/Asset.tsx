import {
  Button,
  Flex,
  Icon,
  Image,
  Modal,
  Spacer,
  Tab,
  Tabs,
  TabsContent,
  TabsHeader,
  Text,
} from "@findnlink/neuro-ui";
import React, { useEffect, useState } from "react";
import scss from "./Dashboard.module.scss";
import DummyBugger from "../../public/assets/bobcat-e26.png";
import Overview from "./assetPage/Overview";
import Service from "./assetPage/Service";
import Gallery from "./assetPage/Gallery";
import Contracts from "./assetPage/Contracts";
import Availiblity from "./assetPage/Availiblity";

type AssetProps = {
  onBackClick: () => void;
  id: string;
};

type AssetType = {
  id: string;
  imageUrl: string;
  name: string;
  table: any;
  serialNumber: string;
  engine: string;
  location: string;
  machineHours: number;
};

export default function Asset({ onBackClick, id }: AssetProps) {
  const [data, setData] = useState<AssetType>({
    id: id,
    name: "T66 T-Loader",
    imageUrl: DummyBugger.src,
    table: {},
    serialNumber: "ND126788",
    location: "115 Stwart, Thornhill, L4J1K7",
    engine: "Running",
    machineHours: 1256,
  });

  const [openPickup, setOpenPickup] = useState(false);
  const [openDropoff, setOpenDropoff] = useState(false);

  // useEffect(() => {
  //   setData({ id: id, imageUrl: DummyBugger.src });
  // }, []);

  return (
    <div className={scss.asset}>
      <Flex
        alignItems="center"
        justifyContent="center"
        onClick={onBackClick}
        className={scss.backButton}
      >
        <Icon icon="arrow"></Icon>
      </Flex>

      <div className={scss.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d18875910.7550825!2d-113.71418756987697!3d54.723902171898864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4b0d03d337cc6ad9%3A0x9968b72aa2438fa5!2sKanada!5e0!3m2!1sde!2sde!4v1654796003917!5m2!1sde!2sde"
          loading="lazy"
          width={"100%"}
          height={"400px"}
          allowFullScreen={true}
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className={scss.gradient}></div>
      </div>

      <Image _class={scss.image} src={data.imageUrl} />

      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        _class={scss.nameWrapper}
      >
        <div>
          <Text weight="bold" scale="xl">
            {data.name}
          </Text>
          <Text weight="light">S/N: {data.serialNumber}</Text>
        </div>
        <div>
          <Button
            onClick={() => {
              setOpenPickup(true);
            }}
            scale="l"
            primary
          >
            Pick up
          </Button>
          <Button
            onClick={() => {
              setOpenDropoff(true);
            }}
            scale="l"
            margin="m 0 m m"
          >
            Drop off
          </Button>
        </div>
      </Flex>

      <Spacer padding="xl" />
      <Tabs _class={scss.tabs}>
        <TabsHeader padding="m">
          <Tab margin="0 m 0 0" index={0}>
            Overview
          </Tab>
          <Tab margin="0 m 0 0" index={1}>
            Service
          </Tab>
          <Tab margin="0 m 0 0" index={2}>
            Gallery
          </Tab>
          <Tab margin="0 m 0 0" index={3}>
            Contracts
          </Tab>
          <Tab margin="0 m 0 0" index={4}>
            Availibility
          </Tab>
        </TabsHeader>
        <TabsContent margin="0" padding="xl 0 0 0">
          {[
            <Overview data={data} />,
            <Service />,
            <Gallery />,
            <Contracts />,
            <Availiblity />,
          ]}
        </TabsContent>
      </Tabs>

      <Modal
        open={openPickup}
        onClose={() => {
          setOpenPickup(false);
        }}
      >
        Pickup
      </Modal>

      <Modal
        open={openDropoff}
        onClose={() => {
          setOpenDropoff(false);
        }}
      >
        Dropoff
      </Modal>
    </div>
  );
}
