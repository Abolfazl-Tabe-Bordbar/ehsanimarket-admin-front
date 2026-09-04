import React from "react";
import Image from "next/image";
import Form from "@/components/templates/Index/Form";

const highlights = [
  "مدیریت محصولات و موجودی انبار",
  "پیگیری و مدیریت سفارشات",
  "مدیریت کاربران و دسترسی‌ها",
  "تنظیمات و محتوای فروشگاه",
];

function Main() {
  return (
    <div className="login-page min-h-screen flex">
      {/* Form panel — first in RTL = right side on desktop */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-10 sm:px-10 bg-[#f8f9fc] relative overflow-hidden">
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-[#CA8549]/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-[#1a1a2e]/5 blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-[420px]">
          <div className="lg:hidden mb-8 text-center">
            <Image src="/images/logo-1.png" alt="logo" width={100} height={54} className="mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">ورود به پنل مدیریت</h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8 sm:p-10">
            <div className="hidden lg:block mb-8 text-right">
              <h2 className="text-2xl font-bold text-gray-800">خوش آمدید</h2>
              <p className="text-gray-400 text-sm mt-2">برای ادامه وارد حساب کاربری خود شوید</p>
            </div>
            <Form />
          </div>

          <p className="text-center text-gray-400 text-xs mt-6">
            © {new Date().getFullYear()} احسانی مارکت — تمامی حقوق محفوظ است
          </p>
        </div>
      </div>

      {/* Decorative panel — second in RTL = left side on desktop */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative overflow-hidden bg-gradient-to-bl from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#CA8549]/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#CA8549]/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        </div>

        <div className="relative z-10 flex flex-col min-h-full p-12 xl:p-16 w-full text-right">
          <Image
            src="/images/logo-1.png"
            alt="logo"
            width={120}
            height={65}
            className="brightness-0 invert opacity-90 self-start shrink-0"
          />

          <div className="flex-1 flex flex-col justify-center py-10 space-y-8 w-full items-start">
            <div className="space-y-6 w-full max-w-md">
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-relaxed text-right">
                پنل مدیریت
                <br />
                <span className="text-[#CA8549]">احسانی مارکت</span>
              </h1>
              <p className="text-white/60 text-base xl:text-lg leading-relaxed text-right max-w-xl">
                مدیریت محصولات، سفارشات، کاربران و تنظیمات فروشگاه در یک پنل یکپارچه
              </p>
            </div>

            <ul className="space-y-3 w-full max-w-md text-right">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-white/75 text-sm xl:text-base justify-start"
                >
                  <span className="w-2 h-2 rounded-full bg-[#CA8549] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-3 text-white/40 text-sm self-start shrink-0">
            <span>نسخه مدیریت ۱.۰</span>
            <div className="w-8 h-px bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
