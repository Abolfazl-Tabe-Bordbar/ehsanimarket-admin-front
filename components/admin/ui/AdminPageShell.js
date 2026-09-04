import React from "react";

function AdminPageShell({
  title,
  description,
  actions,
  children,
  className = "",
  narrow = false,
  stickyHeader = false,
}) {
  const contentClass = narrow
    ? "mx-auto w-full max-w-3xl"
    : "w-full";

  return (
    <div className={`admin-page ${className}`.trim()}>
      <div className={contentClass}>
        {(title || description || actions) && (
          <header
            className={`admin-page-header${stickyHeader ? " admin-page-header-sticky" : ""}`}
          >
            <div className="min-w-0">
              {title && <h1 className="admin-page-title">{title}</h1>}
              {description && <p className="admin-page-desc">{description}</p>}
            </div>
            {actions && <div className="admin-page-actions shrink-0">{actions}</div>}
          </header>
        )}
        {children}
      </div>
    </div>
  );
}

export default AdminPageShell;
