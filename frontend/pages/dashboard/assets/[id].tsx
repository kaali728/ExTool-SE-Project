import {
  Button,
  Flex,
  Icon,
  Image,
  Input,
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
import { useCallback, useEffect, useState } from "react";
import { AssetType } from "types/global";
import Availiblity from "components/dashboard/assetPage/Availiblity";
import Contracts from "components/dashboard/assetPage/Contracts";
import Gallery from "components/dashboard/assetPage/Gallery";
import Overview from "components/dashboard/assetPage/Overview";
import Service from "components/dashboard/assetPage/Service";
import scss from "components/dashboard/Dashboard.module.scss";
import DummyBugger from "../../../public/assets/bobcat-e26.png";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { firestore } from "lib/firebase";
import { ENGINE } from "lib/models/assetEnum";

import { useDropzone } from "react-dropzone";

export default function Asset() {
  const router = useRouter();
  const { id } = router.query;

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

  const [data, setData] = useState<AssetType | null>();

  const [openPickup, setOpenPickup] = useState(false);
  const [openDropoff, setOpenDropoff] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        //@ts-ignore
        const docSnap = await getDoc(doc(getFirestore(), "assets", id)).then(
          (asset) => {
            console.log("asset", asset.data());
            const data = asset.data();

            if (data) {
              setData((prev) => ({
                id: id || "",
                name: data.name || "",
                imageUrl: data.imageUrl || "",
                table: data.table || [],
                serialNumber: data.sn || "",
                location: data.location || {
                  long: 42.9150826,
                  lat: -79.4913604,
                },
                engine: data.engine || ENGINE.STOPED,
                machineHours: data.machineHours || "",
                ...asset.data(),
              }));
            }
          }
        );
      };

      fetchData();
    }
  }, [id]);

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
          <TabsContent margin="0 0 xl 0" padding="xl 0 0 0">
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
          type="confirm"
        >
          Pickup
          <Input name={"pickup-address"} value={""} />
          <input type="date" id="pickup-date" name="pickup-date" />
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          {images.map((image: any) => (
            <Image src={image.src} />
          ))}
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
    )
  );
}
