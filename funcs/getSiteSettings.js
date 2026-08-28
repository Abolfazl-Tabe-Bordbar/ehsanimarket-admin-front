import { baseUrl } from "@/data/variables";

async function getSiteSettings(token) {
  try {
    const res = await fetch(`${baseUrl}/site_settings`, {
      headers: token ? { cookies: token } : {},
      cache: "no-store",
    });
    const resData = await res.json();
    return resData;
  } catch (error) {
    return { status: false, body: null };
  }
}

export default getSiteSettings;
