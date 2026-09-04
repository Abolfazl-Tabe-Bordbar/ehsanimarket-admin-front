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
import { DiscountOutlined, SellOutlined, SmsOutlined, RateReviewOutlined, LocalOfferOutlined } from "@mui/icons-material";

export const adminNavItems = [
  {
    href: "/p-admin/dashboard",
    path: "/p-admin/dashboard",
    label: "داشبورد",
    description: "آمار کلی و وضعیت سایت",
    icon: DashboardOutlinedIcon,
  },
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
  {
    href: "/p-admin/purchases?p=1&status=pending",
    path: "/p-admin/purchases",
    label: "خریدها",
    description: "پیگیری سفارشات کاربران",
    icon: ShoppingBasketOutlinedIcon,
    badgeKey: "orders",
  },
  {
    href: "/p-admin/users?p=1",
    path: "/p-admin/users",
    label: "کاربران سایت",
    description: "لیست کاربران ثبت‌نام‌شده",
    icon: PersonOutlineOutlinedIcon,
  },
  {
    href: "/p-admin/faq",
    path: "/p-admin/faq",
    label: "سوالات متداول",
    description: "مدیریت پرسش‌های پرتکرار",
    icon: HelpOutlineIcon,
  },
  {
    href: "/p-admin/articles",
    path: "/p-admin/articles",
    label: "مقالات",
    description: "انتشار و ویرایش مقالات",
    icon: ArticleOutlinedIcon,
  },
  {
    href: "/p-admin/newsletter",
    path: "/p-admin/newsletter",
    label: "خبرنامه",
    description: "مشترکین پیامک مقالات جدید",
    icon: SmsOutlined,
  },
  {
    href: "/p-admin/banners",
    path: "/p-admin/banners",
    label: "بنرها",
    description: "مدیریت بنرهای صفحه اصلی",
    icon: CollectionsOutlinedIcon,
  },
  {
    href: "/p-admin/testimonials",
    path: "/p-admin/testimonials",
    label: "نظرات شما",
    description: "نظرات مشتریان و کسب‌وکارها",
    icon: RateReviewOutlined,
  },
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
  {
    href: "/p-admin/system-notifications",
    path: "/p-admin/system-notifications",
    label: "مدیریت پیام‌ها",
    description: "تنظیم پیامک‌های سیستمی",
    icon: AdUnitsIcon,
  },
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
];

export function getNavItemByPath(pathname) {
  return adminNavItems.find((item) => item.path === pathname) || null;
}
