import {
  Flex,
  Line,
  Navigation,
  Tab,
  Tabs,
  TabsHeader,
} from "@findnlink/neuro-ui";
import Image from "next/image";
import React from "react";
import styles from "./Dashboard.module.scss";
import Logo from "../../public/assets/logo.webp";
import { FiGrid, FiSettings, FiLogOut } from "react-icons/fi";
import { GoLocation, GoTools } from "react-icons/go";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { auth, signOut } from "../../lib/firebase";
import toast from "react-hot-toast";
import { logout } from "../../lib/slices/userSlice";

type Props = {
  setSelectedTab: any;
};

function SideMenu({ setSelectedTab }: Props) {
  const dispatch = useDispatch();

  const signinOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
        dispatch(logout());
      })
      .catch((error) => {
        toast.error("An error happened.");
      });
  };

  //TODO: Hier fix machen

  return (
    <Navigation type="side" _class={styles.sideMenu}>
      <Tabs direction="column" id="navigation" hover>
        <TabsHeader padding="xl">
          <Tab index={0} onClick={() => setSelectedTab(0)}>
            <span className={styles.tab}>
              <FiGrid />
              Assets
            </span>
          </Tab>
          <Tab index={1} onClick={() => setSelectedTab(1)}>
            <span className={styles.tab}>
              <GoLocation />
              Deliveries
            </span>
          </Tab>
          <Tab index={2} onClick={() => setSelectedTab(2)}>
            <span className={styles.tab}>
              <GoTools />
              Repairs
            </span>
          </Tab>
          <Tab index={3} onClick={() => setSelectedTab(3)}>
            <span className={styles.tab}>
              <FaFileInvoiceDollar />
              Invoices
            </span>
          </Tab>
          <Line margin={"xl"} />
          <Tab index={4} onClick={() => setSelectedTab(4)}>
            <span className={styles.tab}>
              <FiSettings />
              Settings
            </span>
          </Tab>
        </TabsHeader>
      </Tabs>
      <Flex alignItems="center">
        <div className={styles.logoutWrapper} onClick={signinOut}>
          <span className={styles.tab}>
            <FiLogOut />
            Logout
          </span>
        </div>
      </Flex>
    </Navigation>
  );
}

export default SideMenu;
