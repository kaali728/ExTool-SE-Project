import React, { useState } from "react";
import { Grid, Flex, Input, Text, Button, Spacer } from "@findnlink/neuro-ui";
import Lottie from "react-lottie-player";
import lottieJson from "../public/assets/register_lottie.json";
import scss from "../styles/auth/Auth.module.scss";
import { useRouter } from "next/router";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../lib/firebase";
import toast from "react-hot-toast";
import { login } from "../lib/slices/userSlice";

function signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const register = (e) => {
    e.preventDefault();
    if (!form.name) {
      return alert("Please enter a full name");
    }

    console.log("register the user");

    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then((userAuth) => {
        toast.success("Successfully registered!");
        updateProfile(userAuth.user, {
          displayName: form.name,
        })
          .then((user) => {
            console.log("UPDATED USER", user);
            login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: name,
            });
            router.push("/");
          })
          .catch((error) => {
            console.log("user not updated");
          });
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <Grid _class={scss.gridWrapper}>
      <Flex alignItems="center" justifyContent="center">
        <div className={scss.left}>
          <Text style={{ fontSize: 50 }} color={"--text100"}>
            Register
          </Text>
          <Spacer margin="l" />
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                name: e.target.value,
              }));
            }}
          />
          <Spacer margin="xs" />
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
          <Input
            placeholder="Confirm your password"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }));
            }}
          />
          <Spacer margin="xs" />
          <Button
            padding="s xl"
            margin="l m"
            primary
            scale="l"
            onClick={register}
          >
            Create a Account
          </Button>
          <Text>
            Already have an Account?
            <Text
              pointer
              weight="bold"
              color={"--primary"}
              style={{ textAlign: "center" }}
              onClick={() => router.push("/signin")}
            >
              Login
            </Text>
          </Text>
        </div>
      </Flex>
      <Flex alignItems="center" justifyContent="center" _class={scss.right}>
        <Text
          style={{ fontSize: 40, textAlign: "center" }}
          weight="bold"
          color={"--text100"}
          margin="m xl"
        >
          Just one step away from your new expert tool
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

export default signup;
