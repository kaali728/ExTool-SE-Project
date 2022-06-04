import {
  Flex,
  Layout,
  Navigation,
  StoreProvider,
  Tab,
  Tabs,
  TabsHeader,
  Text,
  ThemeChanger,
} from "@findnlink/neuro-ui";
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import WithAuthorization from "../components/auth/WithAuthorization";
import Dashboard from "../components/dashboard/Dashboard";
import SideMenu from "../components/dashboard/SideMenu";
import styles from "../styles/Home.module.scss";
import Logo from "../public/assets/logo.webp";

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  return (
    <WithAuthorization needsAuthorization>
      {/* <Flex flexDirection="row" className={styles.dashboard}>
        <SideMenu setSelectedTab={setSelectedTab} />
        <Dashboard selectedTab={selectedTab} />
      </Flex> */}
      <StoreProvider disableSplashScreen defaultTheme="dark">
        <Layout type="docs">
          <Flex padding="0 xl" flexDirection="row" alignItems="center">
            {/* <Image width="20px" src={Logo} /> */}
            <Image src={Logo} />
          </Flex>

          <Navigation type="top">
            <Tabs id="navigation" hover margin="0 m 0 0">
              <TabsHeader>
                <Tab index={0}>
                  <ThemeChanger />
                </Tab>
              </TabsHeader>
            </Tabs>
          </Navigation>

          <SideMenu setSelectedTab={setSelectedTab} />
          <div>
            <div style={{ maxWidth: "1000px" }}>
              <Dashboard selectedTab={selectedTab} />
            </div>
          </div>
        </Layout>
      </StoreProvider>
    </WithAuthorization>
  );
};

export default Home;
