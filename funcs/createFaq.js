import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function createFaq(faqData) {
  try {
    const { data } = await axios.post(`${baseUrl}/faq`, faqData, {
      headers: {
        cookies: getCookie("ramian-pakhsh-admin"),
      },
    });

    if (data.status) {
      Swal.fire({
        icon: "success",
        title: data.message,
      }).then(() => window.location.reload());
    } else {
      Swal.fire({
        icon: "error",
        title: data.message,
      });
    }
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default createFaq;
