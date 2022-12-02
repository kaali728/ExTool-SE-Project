import { Flex, Spacer, Text } from "@findnlink/neuro-ui";
import React, { useEffect, useState } from "react";
import scss from "../Dashboard.module.scss";
import Table from "./Table";
import { GoLocation, GoTools } from "react-icons/go";
import { FaClock, FaHeartbeat } from "react-icons/fa";
import { FiClock } from "react-icons/fi";
import { useSelector } from "react-redux";
import { selectedAssetSelector } from "lib/slices/assetSlice";

export default function Overview() {
  const [address, setAddress] = useState();
  const data = useSelector(selectedAssetSelector);

  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${data?.location.lat}&lon=${data?.location.long}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        //console.log(responseJson);
        setAddress(responseJson.display_name);
      });
  }, [data]);

  return (
    <Flex
      _class={scss.overview}
      flexDirection="row"
      justifyContent="space-between"
    >
      <div className={scss.stats + " " + scss.tabsContainer}>
        <Text weight="bold">
          <Flex flexDirection="row" alignItems="center">
            <GoLocation style={{ marginRight: "10px" }} />
            Current Location:
          </Flex>
        </Text>
        <Text
          href={`https://maps.google.com/?q=${data?.location.lat},${data?.location.long}`}
        >
          {address}
        </Text>
        <Spacer />

        <Text weight="bold">
          <Flex flexDirection="row" alignItems="center">
            <FaHeartbeat style={{ marginRight: "10px" }} />
            Engine:
          </Flex>
        </Text>

        <Flex flexDirection="row" alignItems="center">
          {data && data.engine === "Running" ? (
            <div className={scss.runningAnimation}></div>
          ) : (
            <div className={scss.offline}></div>
          )}
          <Text margin="0 0 0 l">{data && data.engine}</Text>
        </Flex>

        <Spacer />
        <Text weight="bold">
          <Flex flexDirection="row" alignItems="center">
            <FiClock style={{ marginRight: "10px" }} />
            Machine Hours:
          </Flex>
        </Text>
        <Text>{data && data.machineHours} hours</Text>
      </div>
      <div className={scss.table + " " + scss.tabsContainer}>
        <Table _data={data} />
      </div>
    </Flex>
  );
}

console.log("date", new Date().toString());
