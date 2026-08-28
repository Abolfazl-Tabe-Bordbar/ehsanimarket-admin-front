"use client";

import ErrorPageLayout from "@/components/modules/ErrorPageLayout";

export default function GlobalError({ reset }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-IRANSans">
        <ErrorPageLayout
          code="500"
          title="خطای سرور"
          description="متأسفانه خطایی در سیستم رخ داده است. لطفاً صفحه را رفرش کنید یا چند لحظه دیگر دوباره تلاش کنید."
          variant="error"
          onRetry={() => reset()}
          secondaryHref={null}
        />
      </body>
    </html>
  );
}
