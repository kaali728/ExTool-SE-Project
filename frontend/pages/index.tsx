import { DASHBOARD, SIGNIN } from "lib/constants/routes";
import { selectUser } from "lib/slices/userSlice";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import WithAuthorization from "components/auth/WithAuthorization";

const Home: NextPage = () => {
  const router = useRouter();
  const user = useSelector(selectUser);
  useEffect(() => {
    if (user) {
      router.push(DASHBOARD);
    }
  }, [user]);
  return (
    <WithAuthorization needsAuthorization>
      <div>loading</div>
    </WithAuthorization>
  );
};

export default Home;
