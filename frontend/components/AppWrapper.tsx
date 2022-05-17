import { onAuthStateChanged } from "firebase/auth";
import Router from "next/router";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { DASHBOARD } from "../lib/constants/routes";
import { auth } from "../lib/firebase";
import { login, logout } from "../lib/slices/userSlice";

export default function AppWrapper(props: any) {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        dispatch(
          login({
            email: userAuth.email,
            uid: userAuth.uid,
            displayName: userAuth.displayName,
            photoUrl: userAuth.photoURL,
          })
        );
        //Router.push(DASHBOARD);
      } else {
        dispatch(logout());
      }
    });
  }, []);
  return props.children;
}
