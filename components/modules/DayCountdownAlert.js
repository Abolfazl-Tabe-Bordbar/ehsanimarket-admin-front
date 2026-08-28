import React from "react";

function DayCountdownAlert() {
  function daysUntilDate(targetDate) {
    const today = new Date();
    const target = new Date(targetDate);
    const difference = target.getTime() - today.getTime();
    const days = Math.ceil(difference / (1000 * 3600 * 24));
    return days;
  }
  const targetDate = "2025-06-15"; // تاریخ مورد نظر را به فرمت 'YYYY-MM-DD' وارد کنید

  return (
    <div className="py-4 w-full text-center bg-[#CA8549] text-white">
      <p>
        باسلام مدیر محترم وبسایت شما بدون لایه محافظتی و امنیتی میباشد. هرگونه
        از دست دادن داده و پاک شدن و مختل شدن سامانه برعهده شرکت برنامه نویسی
        نمیباشد!
      </p>
    </div>
  );
}

export default DayCountdownAlert;
