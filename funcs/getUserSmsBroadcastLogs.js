import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getUserSmsBroadcastLogs(token, broadcastId) {
  try {
    const res = await fetch(`${baseUrl}/user-sms/broadcasts/${broadcastId}/logs`, {
      headers: { cookies: token },
    });
    return await res.json();
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default getUserSmsBroadcastLogs;
