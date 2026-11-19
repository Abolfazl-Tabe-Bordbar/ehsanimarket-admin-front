"use client";

import { Suspense, useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { adminNavGroups, canSeeNavItem } from "../navConfig";

function isNavItemActive(item, pathname, stage) {
  const pathMatches =
    pathname === item.path || pathname.startsWith(`${item.path}/`);

  if (!pathMatches) return false;
  if (item.matchStage) {
    const currentStage =
      pathname === "/p-admin/approval-messages" ? stage || "approve" : stage;
    return currentStage === item.matchStage;
  }
  return true;
}

function isPathUnder(pathname, path) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

// زیرمنو به‌طور پیش‌فرض وقتی باز است که صفحه والد یا یکی از زیرمنوهایش باز باشد
function isSectionOpenByDefault(parentPath, items, pathname) {
  if (isPathUnder(pathname, parentPath)) return true;
  return items.some(
    (sibling) => sibling.parentPath === parentPath && isPathUnder(pathname, sibling.path)
  );
}

function hasSubItems(item, items) {
  return items.some((other) => other.parentPath === item.path);
}

function AdminNavListContent({ badgeCount = 0, ticketCount = 0, permissions = null, onNavigate, className = "" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage");
  // باز/بسته کردن دستی زیرمنو؛ با رفتن به صفحه دیگر به حالت پیش‌فرض برمی‌گردد
  const [toggled, setToggled] = useState({});

  useEffect(() => {
    setToggled({});
  }, [pathname]);

  const isSectionOpen = (parentPath, items) =>
    toggled[parentPath] ?? isSectionOpenByDefault(parentPath, items, pathname);

  const toggleSection = (parentPath, items) => {
    const next = !isSectionOpen(parentPath, items);
    setToggled((prev) => ({ ...prev, [parentPath]: next }));
  };

  return (
    <div className={`space-y-5 ${className}`.trim()}>
      {adminNavGroups.map((group) => {
        const visibleItems = group.items.filter((item) => canSeeNavItem(item, permissions, group));
        if (!visibleItems.length) return null;
        return (
        <section key={group.id}>
          <p className="admin-nav-group-title">{group.title}</p>
          <ul className="space-y-1">
            {visibleItems.map((item) => {
              if (item.parentPath && !isSectionOpen(item.parentPath, group.items)) return null;
              const Icon = item.icon;
              const isSub = Boolean(item.parentPath);
              const isParent = hasSubItems(item, group.items);
              const isOpen = isParent && isSectionOpen(item.path, group.items);
              const isActive = isNavItemActive(item, pathname, stage);
              const badgeValue =
                item.badgeKey === "orders" ? badgeCount : item.badgeKey === "tickets" ? ticketCount : 0;
              const showBadge = badgeValue > 0;

              return (
                <li
                  key={item.href}
                  className={isSub ? "mr-6" : isParent ? "relative" : undefined}
                >
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`admin-nav-link ${isActive ? "admin-nav-link-active" : ""} ${isParent ? "pl-11" : ""} ${isSub ? "gap-2 py-1.5 text-xs" : ""}`}
                  >
                    <span className={`admin-nav-icon ${isSub ? "h-6 w-6 text-[15px]" : ""}`}>
                      <Icon fontSize={isSub ? "inherit" : "small"} />
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {showBadge && (
                      <span className="admin-nav-badge">
                        {badgeValue.toLocaleString("fa")}
                      </span>
                    )}
                  </Link>
                  {isParent && (
                    <button
                      type="button"
                      onClick={() => toggleSection(item.path, group.items)}
                      aria-expanded={isOpen}
                      aria-label={isOpen ? `بستن زیرمنوی ${item.label}` : `باز کردن زیرمنوی ${item.label}`}
                      title={isOpen ? "بستن" : "باز کردن"}
                      className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/15 hover:text-white"
                    >
                      <ExpandMoreIcon
                        fontSize="small"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
        );
      })}
    </div>
  );
}

function AdminNavListFallback({ className = "" }) {
  return (
    <div className={`space-y-5 ${className}`.trim()}>
      {[1, 2, 3].map((group) => (
        <div key={group} className="space-y-2">
          <div className="mx-3 h-3 w-16 rounded bg-white/10" />
          <div className="space-y-1">
            {[1, 2].map((item) => (
              <div key={item} className="mx-1 h-10 rounded-xl bg-white/5" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminNavList(props) {
  return (
    <Suspense fallback={<AdminNavListFallback className={props.className} />}>
      <AdminNavListContent {...props} />
    </Suspense>
  );
}

export default AdminNavList;
