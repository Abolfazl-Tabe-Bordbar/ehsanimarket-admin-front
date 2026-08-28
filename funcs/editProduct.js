import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "./cookies/getCookie";
import { TopRightToast } from "@/components/modules/Toast";

async function editProduct(productData, productId) {
  try {
    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("senf_id", productData.senf_id);
    formData.append("price", productData.price);
    formData.append("totalPrice", productData.totalPrice);
    formData.append("description", productData.description);
    formData.append("features", JSON.stringify(productData.features));
    for (let i = 0; i < productData.images.length; i++) {
      formData.append("image", productData.images[i]);
    }
    formData.append("delete_images", JSON.stringify(productData.delete_images));
    formData.append("count", productData.count);
    if (productData.product_code?.trim()) {
      formData.append("product_code", productData.product_code.trim());
    } else {
      formData.append("product_code", "");
    }

    const { data } = await axios.put(
      `${baseUrl}/products/${productId}`,
      formData,
      {
        headers: {
          cookies: getCookie("ramian-pakhsh-admin"),
        },
      }
    );

    TopRightToast.fire({
      icon: data.status ? "success" : "error",
      title: data.message,
    })
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
  }
}

export default editProduct;
