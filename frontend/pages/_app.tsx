import "../styles/globals.scss";
import "@findnlink/neuro-ui/lib/style.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import AppWrapper from "../components/AppWrapper";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <Provider store={store}>
      <AppWrapper>
        <>
          {router.pathname.includes("dashboard") ? (
            // <Layout>
            <Component {...pageProps} />
          ) : (
            // </Layout>
            <Component {...pageProps} />
          )}
        </>

        <Toaster />
      </AppWrapper>
    </Provider>
  );
}

export default MyApp;
