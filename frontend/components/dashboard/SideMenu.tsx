import {
  Flex,
  Line,
  Navigation,
  Tab,
  Tabs,
  TabsHeader,
} from "@findnlink/neuro-ui";
import { auth, signOut } from "lib/firebase";
import { logout } from "lib/slices/userSlice";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaFileInvoiceDollar } from "react-icons/fa";
import { FiGrid, FiLogOut, FiSettings } from "react-icons/fi";
import { GoLocation, GoTools } from "react-icons/go";
import { useDispatch } from "react-redux";
import {
  ASSETS,
  DELIVERIES,
  INVOICES,
  REPAIRS,
  SETTINGS,
} from "../../lib/constants/routes";
import styles from "./Dashboard.module.scss";

function SideMenu() {
  const router = useRouter();
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

  console.log("router", router);

  return (
    <Navigation type="side" _class={styles.sideMenu}>
      <Tabs direction="column" id="navigation" hover>
        <TabsHeader padding="xl">
          <Tab
            _class={
              router.pathname === "/dashboard/assets" ||
              router.pathname === "/dashboard/assets/[id]"
                ? styles.tabSelected
                : ""
            }
            index={0}
            onClick={() => router.push(ASSETS)}
          >
            <span className={styles.tab}>
              <FiGrid />
              Assets
            </span>
          </Tab>
          <Tab
            _class={
              router.pathname === "/dashboard/deliveries"
                ? styles.tabSelected
                : ""
            }
            index={1}
            onClick={() => router.push(DELIVERIES)}
          >
            <span className={styles.tab}>
              <GoLocation />
              Deliveries
            </span>
          </Tab>
          <Tab
            _class={
              router.pathname === "/dashboard/repairs" ? styles.tabSelected : ""
            }
            index={2}
            onClick={() => router.push(REPAIRS)}
          >
            <span className={styles.tab}>
              <GoTools />
              Repairs
            </span>
          </Tab>
          <Tab
            _class={
              router.pathname === "/dashboard/invoices"
                ? styles.tabSelected
                : ""
            }
            index={3}
            onClick={() => router.push(INVOICES)}
          >
            <span className={styles.tab}>
              <FaFileInvoiceDollar />
              Invoices
            </span>
          </Tab>
          <Line margin={"xl"} />
          <Tab
            _class={
              router.pathname === "/dashboard/settings"
                ? styles.tabSelected
                : ""
            }
            index={4}
            onClick={() => router.push(SETTINGS)}
          >
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
