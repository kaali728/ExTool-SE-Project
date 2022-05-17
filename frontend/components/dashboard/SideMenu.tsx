import { Flex, Line, Tab, Tabs, TabsHeader } from "@findnlink/neuro-ui";
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

type Props = {};

function SideMenu({}: Props) {
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

  return (
    <Flex
      className={styles.sideMenu}
      flex="1"
      alignItems="center"
      flexDirection="column"
    >
      <Image src={Logo} />
      <Tabs direction="column" id="navigation" hover scale={"l"} margin={"xl"}>
        <TabsHeader>
          <Tab index={0}>
            <span className={styles.tab}>
              <FiGrid />
              Assets
            </span>
          </Tab>
          <Tab index={1}>
            <span className={styles.tab}>
              <GoLocation />
              Deliveries
            </span>
          </Tab>
          <Tab index={2}>
            <span className={styles.tab}>
              <GoTools />
              Repairs
            </span>
          </Tab>
          <Tab index={3}>
            <span className={styles.tab}>
              <FaFileInvoiceDollar />
              Invoices
            </span>
          </Tab>
          <Line margin={"xl"} />
          <Tab>
            <span className={styles.tab}>
              <FiSettings />
              Settings
            </span>
          </Tab>
        </TabsHeader>
      </Tabs>
      <div className={styles.logoutWrapper} onClick={signinOut}>
        <span className={styles.tab}>
          <FiLogOut />
          Logout
        </span>
      </div>
    </Flex>
  );
}

export default SideMenu;
