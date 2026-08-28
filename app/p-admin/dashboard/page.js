import DashboardMain from "@/components/templates/P-Admin/Dashboard/DashboardMain";
import getDashboardStats from "@/funcs/getDashboardStats";
import isLogin from "@/funcs/isLogin";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - داشبورد",
};

async function DashboardPage() {
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;
  const [statsRes, adminInfo] = await Promise.all([
    getDashboardStats(token),
    isLogin(token),
  ]);

  const stats = statsRes?.status ? statsRes.body : null;
  const adminName = adminInfo?.name
    ? `${adminInfo.name}${adminInfo.family ? ` ${adminInfo.family}` : ""}`
    : "";

  return <DashboardMain stats={stats} adminName={adminName} />;
}

export default DashboardPage;
