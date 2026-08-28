import SiteSettingsMain from "@/components/templates/P-Admin/SiteSettings/SiteSettingsMain";
import getSiteSettings from "@/funcs/getSiteSettings";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - اطلاعات کلی سایت",
};

async function page() {
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;
  const settingsData = await getSiteSettings(token);
  const initialSettings = settingsData?.body || {};

  return <SiteSettingsMain initialSettings={initialSettings} />;
}

export default page;
