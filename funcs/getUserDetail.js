import { baseUrl } from "@/data/variables";

async function getUserDetail(token, userId) {
  if (!token || !userId) {
    return { status: false, message: "داده‌های درخواست ناقص است" };
  }

  try {
    const res = await fetch(`${baseUrl}/users/${userId}`, {
      headers: {
        cookies: token,
      },
      cache: "no-store",
    });

    return await res.json();
  } catch (error) {
    return {
      status: false,
      message: "خطایی رخ داده است. دوباره تلاش کنید",
    };
  }
}

export default getUserDetail;
