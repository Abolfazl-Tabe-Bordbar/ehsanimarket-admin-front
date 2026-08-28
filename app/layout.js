import './globals.css';

export const metadata = {
  title: 'احسانی مارکت',
  description:
    'فروشگاه احسانی، با سابقه فعالیت از سال ۱۳۷۲ در حوزه تأمین لوازم قنادی، شیرینی‌پزی، بستنی‌سازی و ظروف یکبارمصرف، محصولات باکیفیت و سلامت‌محور را با قیمت رقابتی عرضه می‌کند. این مجموعه با راه‌اندازی فروشگاه آنلاین، دسترسی آسان در سراسر کشور را فراهم کرده و همواره پذیرای نظرات مشتریان برای بهبود خدمات است.',
  icons: {
    icon: '/images/logo-1.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="font-IRANSans">{children}</body>
    </html>
  );
}
