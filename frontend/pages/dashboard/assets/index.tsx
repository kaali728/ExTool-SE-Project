import {
  Button,
  Card,
  CardHeader,
  Flex,
  Grid,
  Spacer,
  Tag,
  Text,
  Image,
  Modal,
} from "@findnlink/neuro-ui";
import React, { useEffect, useState } from "react";
import AssetsSearch from "components/dashboard/assetsPage/AssetsSearch";
import AddAsset from "components/dashboard/assetsPage/AddAsset";
import scss from "components/dashboard/Dashboard.module.scss";
import { firestore } from "lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import {
  assetsChanged,
  getAllAssets,
  selectAssetFilter,
  selectAssets,
  setAssetsChanged,
} from "../../../lib/slices/assetSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { ASSETS } from "lib/constants/routes";
import { AssetType } from "types/global";
import { MdDelete, MdEdit } from "react-icons/md";
import { removeAsset } from "lib/api";

function Assets() {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [openRemoveModal, setOpenRemoveModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const assets = useSelector(selectAssets);
  const filteredAsset = useSelector(selectAssetFilter);
  const assetsStateChanged = useSelector(assetsChanged);
  const router = useRouter();
  const [showingAsset, setShowingAsset] = useState<AssetType[]>([]);
  const [editData, setEditData] = useState({
    name: "",
    serialNumber: "",
    diesel: "",
    imageUrl: "",
    assetId: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect((): any => {
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

    // cancel any future `setData`
    return () => (isSubscribed = false);
  }, [assetsStateChanged]);

  useEffect(() => {
    if (filteredAsset.length > 0) {
      setShowingAsset(sortAssetsArray(filteredAsset));
    } else {
      setShowingAsset(sortAssetsArray(assets));
    }
  }, [filteredAsset, assets]);

  function sortAssetsArray(assets: AssetType[]): AssetType[] {
    const sortedAssets = [...assets];
    sortedAssets.sort((a, b) => (a.name > b.name ? 1 : -1));
    return sortedAssets;
  }

  return (
    <Flex padding="xl">
      <>
        <Flex>
          <Text style={{ fontSize: "35px" }} weight="bold">
            My Assets
          </Text>
        </Flex>
        <Flex style={{ padding: "3.5rem 0px" }}>
          <Flex flexDirection="row" alignItems="center" flexWrap="wrap">
            <AssetsSearch></AssetsSearch>
            <Button
              scale="l"
              primary
              onClick={() => {
                setIsEdit(false);
                setOpenModal(true);
              }}
            >
              Add Asset
            </Button>
          </Flex>
          <Spacer />
          <Grid _class={scss.assetsGrid}>
            {showingAsset.map((item: any, index: any) => (
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
                    <Flex flexDirection="row">
                      <Text
                        scale="xl"
                        weight="bold"
                        margin="xl s m m"
                        padding="0 0 0 m"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedId(item.id);
                          setIsEdit(true);
                          setEditData({
                            name: item.name,
                            serialNumber: item.serialNumber,
                            imageUrl: item.imageUrl,
                            diesel: item.diesel,
                            assetId: item.id,
                          });
                          setOpenModal(true);
                        }}
                      >
                        <MdEdit />
                      </Text>
                      <Text
                        scale="xl"
                        weight="bold"
                        margin="xl 0 m 0"
                        padding="0 0 0 m"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedId(item.id);
                          setOpenRemoveModal(true);
                        }}
                      >
                        <MdDelete />
                      </Text>
                    </Flex>
                  </Flex>
                </CardHeader>
              </Card>
            ))}
          </Grid>
        </Flex>
        <AddAsset
          openModal={openModal}
          selectedId={selectedId}
          setOpen={setOpenModal}
          editData={editData}
          isEdit={isEdit}
        />
        <Modal
          type="confirm"
          open={openRemoveModal}
          onConfirm={() => {
            setOpenRemoveModal(false);
            removeAsset(selectedId);
          }}
          onClose={() => setOpenRemoveModal(false)}
        >
          <Text>Warning: Are you sure you want to delete this assest?</Text>
        </Modal>
      </>
    </Flex>
  );
}
export default Assets;
