import { TopRightToast } from "@/components/modules/Toast";
import { baseUrl } from "@/data/variables";

async function getArticleMeta(token) {
  try {
    const headers = { cookies: token };
    const [categoriesRes, tagsRes] = await Promise.all([
      fetch(`${baseUrl}/articles/categories`, { headers }),
      fetch(`${baseUrl}/articles/tags`, { headers }),
    ]);

    const categories = await categoriesRes.json();
    const tags = await tagsRes.json();

    return {
      categories: categories?.data || [],
      tags: tags?.data || [],
    };
  } catch (error) {
    TopRightToast.fire({
      icon: "error",
      title: "خطایی رخ داده است. دوباره تلاش کنید",
    });
    return { categories: [], tags: [] };
  }
}

export default getArticleMeta;
