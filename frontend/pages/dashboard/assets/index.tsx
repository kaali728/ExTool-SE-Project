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
      setShowingAsset(filteredAsset);
    } else {
      setShowingAsset(assets);
    }
  }, [filteredAsset, assets]);

  // useEffect(() => {
  //   console.log(assets);
  // }, [assets]);

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
                          console.log("item.imageUrl", item.imageUrl);
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

                  <Tag>
                    {[
                      <Flex alignItems="center" flexDirection="row" key={1}>
                        <svg
                          id="Component_34_8"
                          data-name="Component 34 – 8"
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                        >
                          <g id="Component_33_20" data-name="Component 33 – 20">
                            <rect
                              id="Rectangle_6659"
                              data-name="Rectangle 6659"
                              width="15"
                              height="15"
                              fill="none"
                            />
                          </g>
                          <g
                            id="Icon_feather-clock"
                            data-name="Icon feather-clock"
                            transform="translate(-2 -2)"
                          >
                            <path
                              id="Path_1179"
                              data-name="Path 1179"
                              d="M15.971,9.486A6.486,6.486,0,1,1,9.486,3,6.486,6.486,0,0,1,15.971,9.486Z"
                              fill="none"
                              stroke="var(--text200)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                            <path
                              id="Path_1180"
                              data-name="Path 1180"
                              d="M18,9v3.891l2.594,1.3"
                              transform="translate(-8.514 -3.406)"
                              fill="none"
                              stroke="var(--text200)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </g>
                        </svg>
                        <Text padding="0 0 0 s" margin="0">
                          {item.time}
                        </Text>
                      </Flex>,
                      <Flex alignItems="center" flexDirection="row" key={2}>
                        <svg
                          id="Component_35_5"
                          data-name="Component 35 – 5"
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                        >
                          <g id="Component_34_9" data-name="Component 34 – 9">
                            <g
                              id="Component_33_20"
                              data-name="Component 33 – 20"
                            >
                              <rect
                                id="Rectangle_6659"
                                data-name="Rectangle 6659"
                                width="15"
                                height="15"
                                fill="none"
                              />
                            </g>
                          </g>
                          <line
                            id="Line_1057"
                            data-name="Line 1057"
                            x2="3.052"
                            y2="3.446"
                            transform="translate(2.947 8.036)"
                            fill="none"
                            stroke="var(--text200)"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                          />
                          <line
                            id="Line_1058"
                            data-name="Line 1058"
                            x1="6.452"
                            y2="7.039"
                            transform="translate(5.999 4.442)"
                            fill="none"
                            stroke="var(--text200)"
                            strokeLinecap="round"
                            strokeWidth="2.5"
                          />
                        </svg>
                        <Text padding="0 0 0 s" margin="0">
                          {item.status}
                        </Text>
                      </Flex>,
                    ]}
                  </Tag>
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
