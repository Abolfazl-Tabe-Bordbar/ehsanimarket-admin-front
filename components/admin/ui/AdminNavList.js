"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { adminNavGroups } from "../navConfig";

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

function AdminNavListContent({ badgeCount = 0, onNavigate, className = "" }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stage = searchParams.get("stage");

  return (
    <div className={`space-y-5 ${className}`.trim()}>
      {adminNavGroups.map((group) => (
        <section key={group.id}>
          <p className="admin-nav-group-title">{group.title}</p>
          <ul className="space-y-1">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item, pathname, stage);
              const showBadge = item.badgeKey === "orders" && badgeCount > 0;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`admin-nav-link ${isActive ? "admin-nav-link-active" : ""}`}
                  >
                    <span className="admin-nav-icon">
                      <Icon fontSize="small" />
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {showBadge && (
                      <span className="admin-nav-badge">
                        {badgeCount.toLocaleString("fa")}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
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
