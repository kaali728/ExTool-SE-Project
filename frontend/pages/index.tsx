import { Flex, Text } from "@findnlink/neuro-ui";
import type { NextPage } from "next";
import WithAuthorization from "../components/auth/WithAuthorization";
import Dashboard from "../components/dashboard/Dashboard";
import SideMenu from "../components/dashboard/SideMenu";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <WithAuthorization needsAuthorization>
      <Flex flexDirection="row" className={styles.dashboard}>
        <SideMenu />
        <Dashboard />
      </Flex>
    </WithAuthorization>
  );
};

export default Home;
