import React, { useState } from "react";
import { Grid, Flex, Input, Text, Button, Spacer } from "@findnlink/neuro-ui";
import Lottie from "react-lottie-player";
import lottieJson from "../public/assets/login_lottie.json";
import scss from "../styles/auth/Auth.module.scss";
import { useRouter } from "next/router";
import { auth, signInWithEmailAndPassword } from "../lib/firebase";
import { useDispatch } from "react-redux";
import { login } from "../lib/slices/userSlice";
import { DASHBOARD, PASSWORD_FORGET, SIGNUP } from "../lib/constants/routes";

function Signin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();

  const signinToApp = (e: any) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, form.email, form.password)
      .then((userAuth) => {
        console.log(userAuth);
        dispatch(
          login({
            email: userAuth.user.email,
            uid: userAuth.user.uid,
            displayName: userAuth.user.displayName,
            photoUrl: userAuth.user.photoURL,
          })
        );
        router.push(DASHBOARD);
      })
      .catch((err) => {
        alert(err);
      });
  };

  return (
    <Grid _class={scss.gridWrapper}>
      <Flex alignItems="center" justifyContent="center">
        <div className={scss.left}>
          <Text style={{ fontSize: 50 }} color={"--text100"}>
            Login
          </Text>
          <Spacer margin="l" />
          <Input
            value={form.email}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }));
            }}
            placeholder="Your Email"
          />
          <Spacer margin="xs" />
          <Input
            placeholder="Your Password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
          <Spacer margin="xs" />
          <Text
            pointer
            style={{ textAlign: "right", width: "100%" }}
            onClick={() => router.push(PASSWORD_FORGET)}
            margin="m"
          >
            Forget password?
          </Text>
          <Button
            padding="s xl"
            margin="l m"
            primary
            scale="l"
            onClick={signinToApp}
          >
            Login
          </Button>
          <Text>
            Not registered yet?
            <Text
              pointer
              weight="bold"
              color={"--primary"}
              onClick={() => router.push(SIGNUP)}
              style={{ textAlign: "center" }}
            >
              Create Account
            </Text>
          </Text>
        </div>
      </Flex>
      <Flex alignItems="center" justifyContent="center" _class={scss.right}>
        <Text
          style={{ fontSize: 50, textAlign: "center" }}
          weight="bold"
          color={"--text100"}
        >
          {/* The Best Way To Manage Your Assets */}
          Staff Login
        </Text>
        <Lottie
          loop
          animationData={lottieJson}
          play
          style={{ width: "100%", maxWidth: "700px" }}
        />
      </Flex>
    </Grid>
  );
}

export default Signin;
