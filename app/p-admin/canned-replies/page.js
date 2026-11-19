import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import CannedReplies from "@/components/templates/P-Admin/Support/CannedReplies";

export const metadata = {
  title: "احسانی مارکت - پاسخ‌های آماده",
};

function page() {
  return (
    <AdminPageShell title="پاسخ‌های آماده" description="متن‌های تکراری که کارشناس با یک کلیک درج می‌کند">
      <CannedReplies />
    </AdminPageShell>
  );
}

export default page;
