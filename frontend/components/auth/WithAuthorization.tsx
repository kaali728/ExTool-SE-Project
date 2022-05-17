import { onAuthStateChanged } from "firebase/auth";
import Router from "next/router";
import React, { Component, useEffect } from "react";
import { SIGNIN } from "../../lib/constants/routes";
import { auth } from "../../lib/firebase";

type Props = {
  needsAuthorization: boolean;
  children: any;
};

export default function WithAuthorization(props: Props) {
  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (!userAuth && props.needsAuthorization) {
        Router.push(SIGNIN);
      }
    });
  }, []);

  return props.children;
}
