import "@findnlink/neuro-ui/lib/style.css";
import { DASHBOARD } from "lib/constants/routes";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import AppWrapper from "../components/AppWrapper";
import DashboardWrapper from "../components/dashboard/DashboardWrapper";
import { store } from "../lib/store";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <Provider store={store}>
      <AppWrapper>
        <>
          {router.pathname.includes(DASHBOARD) ? (
            <DashboardWrapper>
              <Component {...pageProps} />
            </DashboardWrapper>
          ) : (
            <Component {...pageProps} />
          )}
        </>

        <Toaster />
      </AppWrapper>
    </Provider>
  );
}

export default MyApp;
