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
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useState } from "react";
import { AssetType } from "types/global";
import Availiblity from "components/dashboard/assetPage/Availiblity";
import Contracts from "components/dashboard/assetPage/Contracts";
import Gallery from "components/dashboard/assetPage/Gallery";
import Overview from "components/dashboard/assetPage/Overview";
import Service from "components/dashboard/assetPage/Service";
import scss from "components/dashboard/Dashboard.module.scss";
import DummyBugger from "../../../public/assets/bobcat-e26.png";

export default function Asset() {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  const [data, setData] = useState<AssetType>({
    id: id || "",
    name: "T66 T-Loader",
    imageUrl: DummyBugger.src,
    table: {},
    serialNumber: "ND126788",
    location: { long: 42.9150826, lat: -79.4913604 },
    engine: "Running",
    machineHours: 1256,
  });

  const [openPickup, setOpenPickup] = useState(false);
  const [openDropoff, setOpenDropoff] = useState(false);

  // useEffect(() => {
  //   setData({ id: id, imageUrl: DummyBugger.src });
  // }, []);

  const MapWithNoSSR = dynamic(
    () => import("../../../components/dashboard/assetPage/Map"),
    {
      ssr: false,
    }
  );

  return (
    <div className={scss.asset}>
      <Flex
        alignItems="center"
        justifyContent="center"
        onClick={() => router.back()}
        className={scss.backButton}
      >
        <Icon icon="arrow"></Icon>
      </Flex>

      <div className={scss.map}>
        <MapWithNoSSR name={data.name} location={data.location} />
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

      <Spacer padding="xl 0" />
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
