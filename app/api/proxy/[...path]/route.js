import { createApiProxy } from "@/lib/apiProxy";

export const dynamic = "force-dynamic";

const handler = createApiProxy({
  prefix: "admins",
  tokenPaths: ["login"],
});

export {
  handler as GET,
  handler as HEAD,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
