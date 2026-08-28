import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";
import Swal from "sweetalert2";

async function createProduct(productData) {
  try {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("senf_id", productData.senf_id);
    formData.append("price", productData.price);
    formData.append("description", productData.description);
    formData.append("features", JSON.stringify(productData.features));
    for (let i = 0; i < productData.images.length; i++) {
      formData.append("image", productData.images[i]);
    }
    formData.append("count", productData.count);
    if (productData.product_code?.trim()) {
      formData.append("product_code", productData.product_code.trim());
    }

    const { data } = await axios.post(`${baseUrl}/products`, formData, {
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

export default createProduct;
