import DashboardMain from "@/components/templates/P-Admin/Dashboard/DashboardMain";
import getDashboardStats from "@/funcs/getDashboardStats";
import isLogin from "@/funcs/isLogin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupportOnlyAdmin } from "@/components/admin/navConfig";

export const metadata = {
  title: "احسانی مارکت - داشبورد",
};

async function DashboardPage() {
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;
  const [statsRes, adminInfo] = await Promise.all([
    getDashboardStats(token),
    isLogin(token),
  ]);

  // کارشناس پشتیبانی به داشبورد دسترسی ندارد و مستقیم به تیکت‌ها می‌رود
  if (isSupportOnlyAdmin(adminInfo?.permissions)) {
    redirect("/p-admin/tickets");
  }

  const stats = statsRes?.status ? statsRes.body : null;
  const adminName = adminInfo?.name
    ? `${adminInfo.name}${adminInfo.family ? ` ${adminInfo.family}` : ""}`
    : "";

  return <DashboardMain stats={stats} adminName={adminName} />;
}

export default DashboardPage;
