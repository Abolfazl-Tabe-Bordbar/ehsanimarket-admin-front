"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "../navConfig";

function AdminNavList({ badgeCount = 0, onNavigate, className = "" }) {
  const pathname = usePathname();

  return (
    <ul className={`space-y-1 ${className}`.trim()}>
      {adminNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.path || pathname.startsWith(`${item.path}/`);
        const showBadge = item.badgeKey === "orders" && badgeCount > 0;

        return (
          <li key={item.path}>
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
                <span className="admin-nav-badge">{badgeCount.toLocaleString("fa")}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default AdminNavList;
