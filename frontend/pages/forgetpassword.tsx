import React, { useState } from "react";
import { Grid, Flex, Input, Text, Button, Spacer } from "@findnlink/neuro-ui";
import scss from "../styles/auth/Auth.module.scss";
import { useRouter } from "next/router";
import { auth, sendPasswordResetEmail } from "../lib/firebase";
import toast from "react-hot-toast";
import { SIGNUP } from "../lib/constants/routes";

function ForgetPassword() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "" });

  const sendEmail = (e: any) => {
    e.preventDefault();
    if (!form.email) {
      return alert("Please enter a Email address");
    }

    sendPasswordResetEmail(auth, form.email).then((a) => {
      toast.success("Password reset email sent");
    });
  };

  return (
    <Grid _class={scss.gridWrapper}>
      <Flex alignItems="center" justifyContent="center">
        <Text style={{ fontSize: 50 }} color={"--text100"}>
          Forget Password
        </Text>
        <Spacer margin="l" />
        <div className={scss.forgetPasswordInput}>
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
        </div>
        <Button
          padding="s xl"
          margin="l m"
          primary
          scale="l"
          onClick={sendEmail}
        >
          Send Email
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
      </Flex>
    </Grid>
  );
}

export default ForgetPassword;
