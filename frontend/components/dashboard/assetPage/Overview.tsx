import { Flex, Spacer, Text } from "@findnlink/neuro-ui";
import React, { useEffect, useState } from "react";
import scss from "../Dashboard.module.scss";
import Table from "./Table";
import { GoLocation, GoTools } from "react-icons/go";
import { FaClock, FaHeartbeat } from "react-icons/fa";
import { FiClock } from "react-icons/fi";

export default function Overview({ data }: any) {
  const [address, setAddress] = useState();

  useEffect(() => {
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${data.location.long}&lon=${data.location.lat}`
    )
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        setAddress(responseJson.display_name);
      });
  }, []);

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
        <Text>{address}</Text>
        <Spacer />

        <Text weight="bold">
          <Flex flexDirection="row" alignItems="center">
            <FaHeartbeat style={{ marginRight: "10px" }} />
            Engine:
          </Flex>
        </Text>

        <Flex flexDirection="row" alignItems="center">
          {data.engine === "Running" ? (
            <div className={scss.runningAnimation}></div>
          ) : (
            <div className={scss.offline}></div>
          )}
          <Text margin="0 0 0 l">{data.engine}</Text>
        </Flex>

        <Spacer />
        <Text weight="bold">
          <Flex flexDirection="row" alignItems="center">
            <FiClock style={{ marginRight: "10px" }} />
            Machine Hours:
          </Flex>
        </Text>
        <Text>{data.machineHours} hours</Text>
      </div>
      <div className={scss.table + " " + scss.tabsContainer}>
        <Table _data={data} />
      </div>
    </Flex>
  );
}

console.log("date", new Date().toString());
