"use client";

import ErrorPageLayout from "@/components/modules/ErrorPageLayout";

export default function Error({ reset }) {
  return (
    <ErrorPageLayout
      code="500"
      title="خطایی رخ داده است"
      description="مشکلی در بارگذاری این بخش از پنل پیش آمده. لطفاً دوباره تلاش کنید."
      variant="error"
      onRetry={() => reset()}
      secondaryHref={null}
    />
  );
}
