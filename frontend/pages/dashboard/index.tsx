import { ASSETS } from "lib/constants/routes";
import { useRouter } from "next/router";
import { useEffect } from "react";

function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.push(ASSETS);
  }, []);
}

export default DashboardPage;
