import {
  Button,
  Flex,
  Icon,
  Image,
  Spacer,
  Tab,
  Tabs,
  TabsContent,
  TabsHeader,
  Text,
} from "@findnlink/neuro-ui";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AssetTableObject, StatusDataResponse } from "types/global";
import Availiblity from "components/dashboard/assetPage/Availiblity";
import Contracts from "components/dashboard/assetPage/Contracts";
import Gallery from "components/dashboard/assetPage/Gallery";
import Overview from "components/dashboard/assetPage/Overview";
import Service from "components/dashboard/assetPage/Service";
import scss from "components/dashboard/Dashboard.module.scss";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { ASSET_PICK_DROP, ENGINE } from "lib/models/assetEnum";

import PickupModal from "src/components/dashboard/assetPage/PickupModal";
import DropoffModal from "src/components/dashboard/assetPage/DropoffModal";
import { useDispatch, useSelector } from "react-redux";
import { selectedAssetSelector, setSelectedAsset } from "lib/slices/assetSlice";
import { getAssetStatusAirFleet, updateSelectedAsset } from "lib/api";

export default function Asset() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;

  const [openPickup, setOpenPickup] = useState(false);
  const [openDropoff, setOpenDropoff] = useState(false);

  const [buttonsDisabled, setButtonsDisabled] = useState<{
    pickup: boolean;
    dropoff: boolean;
  }>({
    pickup: true,
    dropoff: true,
  });

  const data = useSelector(selectedAssetSelector);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        //@ts-ignore
        const docSnap = await getDoc(doc(getFirestore(), "assets", id)).then(
          (asset) => {
            const data = asset.data();

            if (data) {
              getInfoFromApi(data);

              dispatch(
                setSelectedAsset({
                  asset: {
                    id: id || "",
                    name: data.name || "",
                    imageUrl: data.imageUrl || "",
                    table: data.table || [],
                    serialNumber: data.sn || "",
                    location: data.location || {
                      long: 42.9150826,
                      lat: -79.4913604,
                    },
                    diesel: data.diesel || "",
                    engine: data.engine || ENGINE.STOPED,
                    machineHours: data.machineHours || "",
                    ...asset.data(),
                  },
                })
              );
            }
          }
        );
      };

      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      const dropoff = data.table.find(
        (value: AssetTableObject, index: number) => {
          if (value.status === ASSET_PICK_DROP.DROP_OFF) {
            return true;
          }
          return false;
        }
      );

      const pickup = data.table.find(
        (value: AssetTableObject, index: number) => {
          if (value.status === ASSET_PICK_DROP.PICKUP) {
            return true;
          }
          return false;
        }
      );

      setButtonsDisabled({
        pickup: pickup ? false : true,
        dropoff: dropoff ? false : true,
      });
    }
  }, [data?.table]);

  const isEngineStopped = (voltage: number) => {
    return voltage > 13000 ? ENGINE.RUNNING : ENGINE.STOPED;
  };

  const getInfoFromApi = async (data: any) => {
    const status: StatusDataResponse = await getAssetStatusAirFleet(
      data?.serialNumber
    );
    let assetEdited = data;

    console.log(status);
    if (status === undefined) return;
    if (
      status.latitude !== assetEdited.location.lat ||
      status.longitude !== assetEdited.location.long ||
      status.engineHours !== assetEdited.engineHours
    ) {
      await updateSelectedAsset(id, {
        location: {
          long: status.longitude,
          lat: status.latitude,
        },
        engine: isEngineStopped(status.voltage),
        machineHours: status.engineHours / 3600,
      });
    }

    dispatch(
      setSelectedAsset({
        asset: {
          ...assetEdited,
          id: id,
          location: {
            long: status.longitude,
            lat: status.latitude,
          },
          engine: isEngineStopped(status.voltage),
          machineHours: status.engineHours ? status.engineHours / 3600 : 0,
        },
      })
    );
  };

  const MapWithNoSSR = dynamic(
    () => import("../../../components/dashboard/assetPage/Map"),
    {
      ssr: false,
    }
  );

  return (
    data && (
      <div className={scss.asset}>
        <Flex
          alignItems="center"
          justifyContent="center"
          onClick={() => {
            dispatch(setSelectedAsset({ asset: null }));
            router.back();
          }}
          className={scss.backButton}
        >
          <Icon icon="arrow"></Icon>
        </Flex>

        <div className={scss.map}>
          <MapWithNoSSR />
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
            {!buttonsDisabled.pickup && (
              <Button
                onClick={() => {
                  setOpenPickup(true);
                }}
                scale="l"
                primary
              >
                Pick up
              </Button>
            )}
            {!buttonsDisabled.dropoff && (
              <Button
                onClick={() => {
                  setOpenDropoff(true);
                }}
                scale="l"
                margin="m 0 m m"
              >
                Drop off
              </Button>
            )}
          </div>
        </Flex>

        <Spacer padding="xl 0" />
        <Tabs id="assetTabs" _class={scss.tabs}>
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
          <TabsContent margin="0 0 xl 0" padding="xl 0 0 0">
            {[
              <Overview key={1} />,
              <Service key={2} />,
              <Gallery key={3} />,
              <Contracts key={4} />,
              <Availiblity key={5} />,
            ]}
          </TabsContent>
        </Tabs>

        <PickupModal data={data} open={openPickup} setOpen={setOpenPickup} />
        <DropoffModal data={data} open={openDropoff} setOpen={setOpenDropoff} />
      </div>
    )
  );
}
