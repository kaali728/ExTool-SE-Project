import React, { useState } from "react";
import { Grid, Flex, Input, Text, Button, Spacer } from "@findnlink/neuro-ui";
import Lottie from "react-lottie-player";
import lottieJson from "../public/assets/register_lottie.json";
import scss from "./Login.module.scss";

function signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

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
            // type="password"
            value={form.name}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
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
          <Input
            placeholder="Your Password"
            // type="password"
            value={form.password}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
          <Input
            placeholder="Confirm your password"
            // type="password"
            value={form.confirmPassword}
            onChange={(e) => {
              setForm((prev) => ({
                ...prev,
                password: e.target.value,
              }));
            }}
          />
          <Button padding="s xl" margin="l m" primary scale="l">
            Create a Account
          </Button>
          <Text>
            Already have an Account?
            <Text
              pointer
              weight="bold"
              color={"--primary"}
              style={{ textAlign: "center" }}
              onClick={() => navigate("/login")}
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
