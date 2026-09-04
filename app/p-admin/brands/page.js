import BrandsMain from "@/components/templates/P-Admin/Brands/Main";
import getBrands from "@/funcs/getBrands";
import { cookies } from "next/headers";

export const metadata = {
  title: "احسانی مارکت - برندها",
};

async function BrandsPage() {
  const token = (await cookies()).get("ramian-pakhsh-admin")?.value;
  const data = await getBrands(token);

  return <BrandsMain data={data} />;
}

export default BrandsPage;
