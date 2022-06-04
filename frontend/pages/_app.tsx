import "../styles/globals.scss";
import "@findnlink/neuro-ui/lib/style.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import AppWrapper from "../components/AppWrapper";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <AppWrapper>
        <Component {...pageProps} />
        <Toaster />
      </AppWrapper>
    </Provider>
  );
}

export default MyApp;
