import React, { useState } from "react";
import { Grid, Flex, Input, Text, Button, Spacer } from "@findnlink/neuro-ui";
import Lottie from "react-lottie-player";
import lottieJson from "../public/assets/login_lottie.json";
import scss from "../styles/auth/Login.module.scss";

function signin() {
  const [form, setForm] = useState({ email: "", password: "" });

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
          <Text
            pointer
            style={{ textAlign: "right", width: "100%" }}
            onClick={() => console.log("Reset password")}
            margin="m"
          >
            Forget password?
          </Text>
          <Button padding="s xl" margin="l m" primary scale="l">
            Login
          </Button>
          <Text>
            Not registered yet?
            <Text
              pointer
              weight="bold"
              color={"--primary"}
              onClick={() => navigate("/signup")}
              style={{ textAlign: "center" }}
            >
              Create Account
            </Text>
          </Text>
        </div>
      </Flex>
      <Flex alignItems="center" justifyContent="center" _class={scss.right}>
        <Text
          style={{ fontSize: 40, textAlign: "center" }}
          weight="bold"
          color={"--text100"}
        >
          The Best Way To Manage Your Assets
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

export default signin;
