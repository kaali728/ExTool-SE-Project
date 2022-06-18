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
import WithAuthorization from "../../components/auth/WithAuthorization";
import SideMenu from "../../components/dashboard/SideMenu";
import styles from "../styles/Home.module.scss";
import Logo from "../../public/assets/logo.webp";

type Props = {
  children: any;
};

function DashboardWrapper({ children }: Props) {
  return (
    <WithAuthorization needsAuthorization>
      <StoreProvider disableSplashScreen defaultTheme="dark">
        <Layout type="docs">
          <Flex padding="0 xl" flexDirection="row" alignItems="center">
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

          <SideMenu />
          <div>
            <div style={{ maxWidth: "1000px" }}>{children}</div>
          </div>
        </Layout>
      </StoreProvider>
    </WithAuthorization>
  );
}

export default DashboardWrapper;
