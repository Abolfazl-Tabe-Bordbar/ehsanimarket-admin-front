import ErrorPageLayout from "@/components/modules/ErrorPageLayout";

export default function NotFound() {
  return (
    <ErrorPageLayout
      code="404"
      title="صفحه پیدا نشد"
      description="این آدرس در پنل مدیریت وجود ندارد. لطفاً از منوی کناری استفاده کنید یا به داشبورد برگردید."
      variant="not-found"
    />
  );
}
