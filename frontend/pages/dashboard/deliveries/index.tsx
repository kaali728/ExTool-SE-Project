import {
  Flex,
  Text,
  Card,
  CardHeader,
  CardContent,
  Grid,
  Line,
  Image,
} from "@findnlink/neuro-ui";
import React, { useEffect } from "react";
import scss from "components/dashboard/Dashboard.module.scss";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { AssetType } from "types/global";
import { ASSETS } from "lib/constants/routes";
import {
  assetsChanged,
  getAllAssets,
  selectAssets,
  setAssetsChanged,
} from "lib/slices/assetSlice";
import toast from "react-hot-toast";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "lib/firebase";
import { ASSET_PICK_DROP } from "lib/models/assetEnum";

type Props = {};

function Index({}: Props) {
  const router = useRouter();
  const assets = useSelector(selectAssets);
  const dispatch = useDispatch();
  const assetsStateChanged = useSelector(assetsChanged);

  useEffect((): any => {
    if (assets.length === 0) {
      let isSubscribed = true;
      let assets: any[] = [];
      const fetchData = async () => {
        const querySnapshot = await getDocs(collection(firestore, "assets"));
        querySnapshot.forEach((doc) => {
          assets.push({ id: doc.id, ...doc.data() });
        });

        if (isSubscribed) {
          dispatch(getAllAssets(assets));
          dispatch(setAssetsChanged({ changed: false }));
        }
      };

      fetchData().catch((e) => {
        toast.error("Something went wrong!");
        console.log("error", e);
      });
      return () => (isSubscribed = false);
    }
    // cancel any future `setData`
  }, [assetsStateChanged]);

  function getNextDeliveries(type: ASSET_PICK_DROP) {
    let nextDeliveries: any = [];

    nextDeliveries = assets
      .map((asset, index) => {
        let isNextDelivery = false;
        asset.table.map((tableItem: any) => {
          if (tableItem.status === type && tableItem.confirmed === false) {
            isNextDelivery = true;
          }
        });
        if (isNextDelivery) {
          return asset;
        }
      })
      .filter((i) => i);

    console.log("nextDeliveries", nextDeliveries);

    return (
      <Grid _class={scss.assetsGrid}>
        {nextDeliveries.map((item: any, index: any) => (
          <Card
            key={index}
            pointer
            margin="0"
            padding="xl"
            onClick={() => {
              router.push(`${ASSETS}/${item.id}`);
            }}
          >
            <Image src={item.imageUrl} />
            <CardHeader padding="0" margin="0">
              <Flex
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Text scale="xl" weight="bold" margin="xl m m m">
                  {item.name}
                </Text>
              </Flex>
            </CardHeader>
          </Card>
        ))}
      </Grid>
    );
  }

  return (
    <>
      <Flex>
        <Text style={{ fontSize: "35px" }} weight="bold">
          Deliveries
        </Text>

        <Line />

        <Text style={{ fontSize: "20px" }} weight="bold">
          Next pick up&apos;s
        </Text>

        {getNextDeliveries(ASSET_PICK_DROP.PICKUP)}

        <Line />
        <Text style={{ fontSize: "20px" }} weight="bold">
          Next drop off&apos;s
        </Text>

        {getNextDeliveries(ASSET_PICK_DROP.DROP_OFF)}
      </Flex>
    </>
  );
}

export default Index;
