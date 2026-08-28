"use client";
import Loader from "@/components/modules/Loader";
import editSystemNotification from "@/funcs/editSystemNotification";
import React, { useState } from "react";
import Swal from "sweetalert2";

function SystemNotifications({ systemMessages }) {
  const systemMessagesData = systemMessages.body.data;

  const loginMessage = systemMessagesData.find(
    (message) => message.tag === "user_login"
  );
  const registrationOtpMessage = systemMessagesData.find(
    (message) => message.tag === "user_registration_otp"
  );
  const registrationWelcomeMessage = systemMessagesData.find(
    (message) => message.tag === "user_registration_welcome"
  );
  const productBalanceMessage = systemMessagesData.find(
    (message) => message.tag === "admin_product_balance"
  );
  const articlePublishedMessage = systemMessagesData.find(
    (message) => message.tag === "article_published"
  );
  const productBackInStockMessage = systemMessagesData.find(
    (message) => message.tag === "product_back_in_stock"
  );

  const [loginMessageValue, setLoginMessageValue] = useState(loginMessage?.msg || "");
  const [registrationOtpMessageValue, setRegistrationOtpMessageValue] =
    useState(registrationOtpMessage?.msg_id || "");
  const [registrationWelcomeMessageValue, setRegistrationWelcomeMessageValue] =
    useState(registrationWelcomeMessage?.msg || "");
  const [productBalanceMessageValue, setProductBalanceMessageValue] = useState(
    productBalanceMessage?.msg || ""
  );
  const [articlePublishedMessageValue, setArticlePublishedMessageValue] = useState(
    articlePublishedMessage?.msg ||
      "مقاله جدید «articleTitle» در احسانی مارکت منتشر شد.\narticleUrl"
  );
  const [productBackInStockMessageValue, setProductBackInStockMessageValue] = useState(
    productBackInStockMessage?.msg ||
      "محصول «productName» دوباره موجود شد.\nproductUrl"
  );
  const [isLoading, setIsLoading] = useState(false);

  const editLoginMessage = () => {
    if (!loginMessageValue.trim()) {
      Swal.fire("توجه!", "وارد کردن پیام ورود کاربر اجباری است", "warning");
    } else {
      setIsLoading(true);
      editSystemNotification(
        {
          tag: "user_login",
          msg_id: "login",
          msg: loginMessageValue,
        },
        loginMessage.id
      ).then((res) => {
        setIsLoading(false);
      });
    }
  };
  const editRegistrationOtpMessage = () => {
    if (!registrationOtpMessageValue.trim()) {
      Swal.fire("توجه!", "وارد کردن کد شناسه otp اجباری است", "warning");
    } else {
      setIsLoading(true);
      editSystemNotification(
        {
          tag: "user_registration_otp",
          msg_id: registrationOtpMessageValue,
        },
        registrationOtpMessage.id
      ).then((res) => {
        setIsLoading(false);
      });
    }
  };
  const editRegistrationWelcomeMessage = () => {
    if (!registrationWelcomeMessageValue.trim()) {
      Swal.fire("توجه!", "وارد کردن پیام خوش‌آمدگویی اجباری است", "warning");
    } else {
      setIsLoading(true);
      editSystemNotification(
        {
          tag: "user_registration_welcome",
          msg_id: "welcom",
          msg: registrationWelcomeMessageValue,
        },
        registrationWelcomeMessage.id
      ).then((res) => {
        setIsLoading(false);
      });
    }
  };
  const editProductBalanceMessage = () => {
    if (!productBalanceMessageValue.trim()) {
      Swal.fire(
        "توجه!",
        "وارد کردن پیام کمبود موجودی محصول اجباری است",
        "warning"
      );
    } else if (!productBalanceMessage?.id) {
      Swal.fire("توجه!", "رکورد پیام در پایگاه داده یافت نشد", "warning");
    } else {
      setIsLoading(true);
      editSystemNotification(
        {
          tag: "admin_product_balance",
          msg_id: "productbalance",
          msg: productBalanceMessageValue,
        },
        productBalanceMessage.id
      ).then((res) => {
        setIsLoading(false);
      });
    }
  };

  const editArticlePublishedMessage = () => {
    if (!articlePublishedMessageValue.trim()) {
      Swal.fire("توجه!", "وارد کردن پیام انتشار مقاله اجباری است", "warning");
    } else if (!articlePublishedMessage?.id) {
      Swal.fire(
        "توجه!",
        "رکورد پیام خبرنامه در پایگاه داده یافت نشد. API را ری‌استارت کنید.",
        "warning"
      );
    } else {
      setIsLoading(true);
      editSystemNotification(
        {
          tag: "article_published",
          msg_id: "article_published",
          msg: articlePublishedMessageValue,
        },
        articlePublishedMessage.id
      ).then(() => {
        setIsLoading(false);
      }      );
    }
  };

  const editProductBackInStockMessage = () => {
    if (!productBackInStockMessageValue.trim()) {
      Swal.fire("توجه!", "وارد کردن پیام موجود شدن محصول اجباری است", "warning");
    } else if (!productBackInStockMessage?.id) {
      Swal.fire(
        "توجه!",
        "رکورد پیام در پایگاه داده یافت نشد. API را ری‌استارت کنید.",
        "warning"
      );
    } else {
      setIsLoading(true);
      editSystemNotification(
        {
          tag: "product_back_in_stock",
          msg_id: "product_back_in_stock",
          msg: productBackInStockMessageValue,
        },
        productBackInStockMessage.id
      ).then(() => {
        setIsLoading(false);
      });
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="admin-section space-y-6">
        <div>
          <h2 className="admin-section-title !border-0 !pb-0 mb-2">تنظیمات پیام‌های سیستمی</h2>
          <p className="text-sm text-gray-500">
            سیستم دارای <b>۶ نوع پیام</b> می‌باشد. در هر بخش می‌توانید متن پیام را
            تنظیم کرده و از متغیرهای مشخص‌شده استفاده نمایید.
          </p>
        </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
            <h3 className="font-semibold text-base text-brand-navy mb-2">
              ۱. پیام ورود کاربر
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              این پیام پس از ورود موفق کاربر ارسال می‌شود.
            </p>

            <div className="text-xs bg-blue-50 text-blue-700 p-3 rounded-lg mb-3">
              متغیرهای قابل استفاده:
              <ul className="list-disc list-inside mt-1">
                <li>
                  <b>fullname</b> : نام و نام خانوادگی کاربر
                </li>
                <li>
                  <b>date</b> : تاریخ و ساعت ورود
                </li>
              </ul>
            </div>

            <textarea
              rows="4"
              className="admin-input"
              value={loginMessageValue}
              onChange={(e) => setLoginMessageValue(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="admin-btn-accent"
                onClick={editLoginMessage}
              >
                ذخیره
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
            <h3 className="font-semibold text-base text-amber-900 mb-2">
              ۲. پیام OTP (کد اعتبارسنجی)
            </h3>

            <p className="text-sm text-yellow-700 mb-3">
              متن این پیام <b>قابل ویرایش نیست</b> و فقط شناسه آن در سیستم ذخیره
              می‌شود.
            </p>

            <div className="text-xs bg-yellow-100 text-yellow-800 p-3 rounded-lg mb-3">
              ✳️ ویرایش متن پیام OTP فقط از طریق <b>پنل کاوه‌نگار</b> انجام
              می‌شود.
            </div>

            <label htmlFor="otp" className="text-sm text-yellow-800 mr-0.5">
              کد شناسه :
            </label>
            <input
              type="text"
              id="otp"
              className="admin-input bg-amber-50/50"
              placeholder="کد شناسه را وارد کنید"
              value={registrationOtpMessageValue}
              onChange={(e) => setRegistrationOtpMessageValue(e.target.value)}
            />
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="admin-btn-accent"
                onClick={editRegistrationOtpMessage}
              >
                ذخیره
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-5">
            <h3 className="font-semibold text-base text-brand-navy mb-2">
              ۳. پیام خوش‌آمدگویی
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              این پیام پس از ثبت‌نام موفق کاربر ارسال می‌شود.
            </p>

            <div className="text-xs bg-blue-50 text-blue-700 p-3 rounded-lg mb-3">
              متغیر قابل استفاده:
              <ul className="list-disc list-inside mt-1">
                <li>
                  <b>fullname</b> : نام و نام خانوادگی کاربر
                </li>
              </ul>
            </div>

            <textarea
              rows="4"
              className="admin-input"
              value={registrationWelcomeMessageValue}
              onChange={(e) =>
                setRegistrationWelcomeMessageValue(e.target.value)
              }
            />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="admin-btn-accent"
                onClick={editRegistrationWelcomeMessage}
              >
                ذخیره
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
            <h3 className="font-semibold text-base text-red-800 mb-2">
              ۴. پیام کمبود موجودی محصول
            </h3>

            <p className="text-sm text-red-600 mb-3">
              این پیام جهت اطلاع مدیر در صورت کمبود موجودی محصول ارسال می‌شود.
            </p>

            <div className="text-xs bg-red-100 text-red-700 p-3 rounded-lg mb-3">
              متغیر قابل استفاده:
              <ul className="list-disc list-inside mt-1">
                <li>
                  <b>productName</b> : نام محصول
                </li>
              </ul>
            </div>

            <textarea
              rows="4"
              className="admin-input bg-red-50/30"
              value={productBalanceMessageValue}
              onChange={(e) => setProductBalanceMessageValue(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="admin-btn-accent"
                onClick={editProductBalanceMessage}
              >
                ذخیره
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#253c8a]/20 bg-[#253c8a]/5 p-5">
            <h3 className="font-semibold text-base text-[#253c8a] mb-2">
              ۵. پیام انتشار مقاله (خبرنامه)
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              این پیام هنگام انتشار مقاله جدید برای مشترکین خبرنامه ارسال می‌شود.
            </p>

            <div className="text-xs bg-blue-50 text-blue-700 p-3 rounded-lg mb-3">
              متغیرهای قابل استفاده:
              <ul className="list-disc list-inside mt-1">
                <li>
                  <b>articleTitle</b> : عنوان مقاله
                </li>
                <li>
                  <b>articleUrl</b> : لینک مقاله در سایت
                </li>
              </ul>
            </div>

            <textarea
              rows="4"
              className="admin-input"
              value={articlePublishedMessageValue}
              onChange={(e) => setArticlePublishedMessageValue(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="admin-btn-accent"
                onClick={editArticlePublishedMessage}
              >
                ذخیره
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
            <h3 className="font-semibold text-base text-emerald-800 mb-2">
              ۶. پیام موجود شدن محصول
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              این پیام وقتی محصول ناموجود دوباره موجود می‌شود برای درخواست‌دهندگان
              ارسال می‌شود.
            </p>

            <div className="text-xs bg-emerald-100 text-emerald-800 p-3 rounded-lg mb-3">
              متغیرهای قابل استفاده:
              <ul className="list-disc list-inside mt-1">
                <li>
                  <b>productName</b> : نام محصول
                </li>
                <li>
                  <b>productUrl</b> : لینک محصول در سایت
                </li>
              </ul>
            </div>

            <textarea
              rows="4"
              className="admin-input"
              value={productBackInStockMessageValue}
              onChange={(e) => setProductBackInStockMessageValue(e.target.value)}
            />

            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="admin-btn-accent"
                onClick={editProductBackInStockMessage}
              >
                ذخیره
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-100/80 p-4 rounded-xl leading-relaxed">
            نکته: در پنل سایت، تنها شناسه پیام‌ها ذخیره می‌شود و ارسال پیام‌ها از
            طریق سرویس پیامک انجام می‌گیرد. برای مدیریت و ویرایش متن پیام‌ها، از
            پنل کاوه‌نگار استفاده نمایید.
          </div>
      </section>
    </>
  );
}

export default SystemNotifications;
