import { Flex, Text } from "@findnlink/neuro-ui";
import React from "react";
import Assets from "./Assets";

type Props = {
  selectedTab: number;
};

function Dashboard({ selectedTab }: Props) {
  switch (selectedTab) {
    case 0:
      return (
        <Flex flex="3">
          <Assets />
        </Flex>
      );
    default:
      return (
        <Flex flex="3">
          <Text>Coming Soon</Text>
        </Flex>
      );
  }
}

export default Dashboard;
