import { TopRightToast } from "@/components/modules/Toast";

import { baseUrl } from "@/data/variables";



async function getArticles(token, query = "") {

  try {

    const qs = query ? (query.startsWith("?") ? query : `?${query}`) : "";

    const res = await fetch(`${baseUrl}/articles${qs}`, {

      headers: { cookies: token },

    });

    return res.json();

  } catch (error) {

    TopRightToast.fire({

      icon: "error",

      title: "خطایی رخ داده است. دوباره تلاش کنید",

    });

  }

}



export default getArticles;

