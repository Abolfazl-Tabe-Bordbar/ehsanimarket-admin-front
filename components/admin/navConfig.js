import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import AdUnitsIcon from "@mui/icons-material/AdUnits";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import {
  DiscountOutlined,
  SellOutlined,
  SmsOutlined,
  RateReviewOutlined,
  LocalOfferOutlined,
  BlockOutlined,
  CheckCircleOutline,
  LocalShippingOutlined,
  LabelOutlined,
  SendOutlined,
  Inventory2Outlined,
  OutboxOutlined,
} from "@mui/icons-material";

export const adminNavGroups = [
  {
    id: "overview",
    title: "کلی",
    items: [
      {
        href: "/p-admin/dashboard",
        path: "/p-admin/dashboard",
        label: "داشبورد",
        description: "آمار کلی و وضعیت سایت",
        icon: DashboardOutlinedIcon,
      },
    ],
  },
  {
    id: "shop",
    title: "فروشگاه",
    items: [
      {
        href: "/p-admin/products?p=1",
        path: "/p-admin/products",
        label: "محصولات",
        description: "مدیریت محصولات فروشگاه",
        icon: LocalMallOutlinedIcon,
      },
      {
        href: "/p-admin/asnaf",
        path: "/p-admin/asnaf",
        label: "دسته‌بندی‌ها",
        description: "مدیریت دسته‌بندی اصلی",
        icon: ApartmentOutlinedIcon,
      },
      {
        href: "/p-admin/subcategories",
        path: "/p-admin/subcategories",
        label: "زیردسته‌ها",
        description: "مدیریت زیردسته محصولات",
        icon: BusinessIcon,
      },
      {
        href: "/p-admin/brands",
        path: "/p-admin/brands",
        label: "برندها",
        description: "مدیریت برندهای محصولات",
        icon: LocalOfferOutlined,
      },
    ],
  },
  {
    id: "orders",
    title: "سفارشات",
    items: [
      {
        href: "/p-admin/purchases?p=1&status=pending",
        path: "/p-admin/purchases",
        label: "خریدها",
        description: "پیگیری سفارشات کاربران",
        icon: ShoppingBasketOutlinedIcon,
        badgeKey: "orders",
      },
      {
        href: "/p-admin/approval-messages?stage=approve",
        path: "/p-admin/approval-messages",
        matchStage: "approve",
        label: "پیام‌های تایید",
        description: "پیام‌های انتقال به مرحله آماده‌سازی",
        icon: CheckCircleOutline,
      },
      {
        href: "/p-admin/approval-messages?stage=preparing",
        path: "/p-admin/approval-messages",
        matchStage: "preparing",
        label: "پیام‌های آماده‌سازی",
        description: "پیام‌های انتقال به مرحله ارسال",
        icon: Inventory2Outlined,
      },
      {
        href: "/p-admin/approval-messages?stage=shipping",
        path: "/p-admin/approval-messages",
        matchStage: "shipping",
        label: "پیام‌های ارسال",
        description: "پیام‌های ثبت ارسال شده",
        icon: OutboxOutlined,
      },
      {
        href: "/p-admin/rejection-reasons",
        path: "/p-admin/rejection-reasons",
        label: "دلایل رد خرید",
        description: "تعریف دلایل آماده برای رد سفارش",
        icon: BlockOutlined,
      },
      {
        href: "/p-admin/shipping-rates",
        path: "/p-admin/shipping-rates",
        label: "هزینه پست",
        description: "تعریف هزینه پست بر اساس وزن برای هر شهر",
        icon: LocalShippingOutlined,
      },
    ],
  },
  {
    id: "users",
    title: "کاربران",
    items: [
      {
        href: "/p-admin/users?p=1",
        path: "/p-admin/users",
        label: "کاربران سایت",
        description: "لیست کاربران ثبت‌نام‌شده",
        icon: PersonOutlineOutlinedIcon,
      },
      {
        href: "/p-admin/user-tags",
        path: "/p-admin/user-tags",
        label: "تگ‌های کاربران",
        description: "تعریف تگ با رنگ",
        icon: LabelOutlined,
      },
      {
        href: "/p-admin/user-sms",
        path: "/p-admin/user-sms",
        label: "پیامک به کاربران",
        description: "ارسال پیامک بر اساس تگ یا کاربر خاص",
        icon: SendOutlined,
      },
    ],
  },
  {
    id: "content",
    title: "محتوا",
    items: [
      {
        href: "/p-admin/articles",
        path: "/p-admin/articles",
        label: "مقالات",
        description: "انتشار و ویرایش مقالات",
        icon: ArticleOutlinedIcon,
      },
      {
        href: "/p-admin/banners",
        path: "/p-admin/banners",
        label: "بنرها",
        description: "مدیریت بنرهای صفحه اصلی",
        icon: CollectionsOutlinedIcon,
      },
      {
        href: "/p-admin/faq",
        path: "/p-admin/faq",
        label: "سوالات متداول",
        description: "مدیریت پرسش‌های پرتکرار",
        icon: HelpOutlineIcon,
      },
      {
        href: "/p-admin/testimonials",
        path: "/p-admin/testimonials",
        label: "نظرات شما",
        description: "نظرات مشتریان و کسب‌وکارها",
        icon: RateReviewOutlined,
      },
      {
        href: "/p-admin/newsletter",
        path: "/p-admin/newsletter",
        label: "خبرنامه",
        description: "مشترکین پیامک مقالات جدید",
        icon: SmsOutlined,
      },
    ],
  },
  {
    id: "discounts",
    title: "تخفیف",
    items: [
      {
        href: "/p-admin/discount-plans",
        path: "/p-admin/discount-plans",
        label: "پلن‌های تخفیف",
        description: "تعریف پلن‌های تخفیف",
        icon: DiscountOutlined,
      },
      {
        href: "/p-admin/discounts",
        path: "/p-admin/discounts",
        label: "تخفیف‌ها",
        description: "مدیریت کدهای تخفیف",
        icon: SellOutlined,
      },
    ],
  },
  {
    id: "notifications",
    title: "پیامک و اعلان",
    items: [
      {
        href: "/p-admin/sms-events",
        path: "/p-admin/sms-events",
        label: "ایونت‌های SMS",
        description: "فعال/غیرفعال کردن پیامک‌های سیستمی",
        icon: SmsOutlined,
      },
      {
        href: "/p-admin/system-notifications",
        path: "/p-admin/system-notifications",
        label: "مدیریت پیام‌ها",
        description: "تنظیم پیامک‌های سیستمی",
        icon: AdUnitsIcon,
      },
    ],
  },
  {
    id: "settings",
    title: "تنظیمات",
    items: [
      {
        href: "/p-admin/site-settings",
        path: "/p-admin/site-settings",
        label: "اطلاعات سایت",
        description: "تماس، شبکه‌ها و درباره ما",
        icon: SettingsOutlinedIcon,
      },
      {
        href: "/p-admin/admins",
        path: "/p-admin/admins",
        label: "مدیریت ادمین‌ها",
        description: "کاربران پنل مدیریت",
        icon: ManageAccountsOutlinedIcon,
      },
    ],
  },
];

export const adminNavItems = adminNavGroups.flatMap((group) => group.items);

export function getNavItemByPath(pathname, stage = null) {
  const resolvedStage =
    pathname === "/p-admin/approval-messages" ? stage || "approve" : stage;

  if (resolvedStage) {
    const stageMatch = adminNavItems.find(
      (item) => item.path === pathname && item.matchStage === resolvedStage
    );
    if (stageMatch) return stageMatch;
  }

  return (
    adminNavItems.find(
      (item) =>
        !item.matchStage &&
        (item.path === pathname || pathname.startsWith(`${item.path}/`))
    ) || null
  );
}
