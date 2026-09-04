import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

const TEXT_FIELDS = [
  "phone_landline",
  "phone_mobile",
  "email",
  "address",
  "about_title",
  "about_hero_text",
  "about_section_1_title",
  "about_section_1_text",
  "about_section_2_title",
  "about_section_2_text",
  "footer_description",
  "instagram_url",
  "telegram_url",
  "whatsapp_url",
  "bale_url",
  "map_embed_url",
];

const IMAGE_FIELDS = [
  "about_image_hero",
  "about_image_section_1",
  "about_image_section_2",
  "about_image_banner",
  "about_image_cta",
];

async function updateSiteSettings(settingsData, imageFiles = {}) {
  try {
    const formData = new FormData();

    TEXT_FIELDS.forEach((key) => {
      if (settingsData[key] !== undefined && settingsData[key] !== null) {
        formData.append(key, settingsData[key]);
      }
    });

    IMAGE_FIELDS.forEach((key) => {
      if (imageFiles[key]) {
        formData.append(key, imageFiles[key]);
      }
    });

    const { data } = await axios.put(`${baseUrl}/site_settings`, formData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title: data.message,
    });

    return data;
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { status: false };
  }
}

export default updateSiteSettings;
