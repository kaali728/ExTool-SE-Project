import "../styles/globals.scss";
import "@findnlink/neuro-ui/lib/style.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { useUserData } from "../lib/hooks/userHooks";
import { UserContext } from "../lib/context/userContext";
import { useEffect } from "react";
import { auth, onAuthStateChanged } from "../lib/firebase";

function MyApp({ Component, pageProps }: AppProps) {
  const userData = useUserData();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
      } else {
      }
    });
  }, []);

  return (
    <UserContext.Provider value={userData}>
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}

export default MyApp;
