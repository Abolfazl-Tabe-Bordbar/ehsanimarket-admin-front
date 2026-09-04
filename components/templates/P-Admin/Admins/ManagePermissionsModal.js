"use client";
import React, { useMemo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ToggleOnOutlinedIcon from "@mui/icons-material/ToggleOnOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import setAdminPermission from "@/funcs/setAdminPermission";
import { groupPermissions } from "@/funcs/groupPermissions";

function ManagePermissionsModal({
  setIsPermissionsModalShow,
  admin,
  permissions,
  refreshDataHandler,
  setIsLoading,
}) {
  const adminPermissionIds = (admin?.permissions || []).map((p) => p.id);
  const permissionGroups = useMemo(
    () => groupPermissions(permissions),
    [permissions]
  );
  const activeCount = adminPermissionIds.length;

  const togglePermissionHandler = (permissionId, hasPermission) => {
    setIsLoading(true);
    setAdminPermission({
      admin_id: admin.id,
      permission_id: permissionId,
      status: hasPermission ? 0 : 1,
    }).then((res) => {
      setIsLoading(false);
      if (res?.status) {
        refreshDataHandler();
      }
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div id="managePermissionsModal" className="admin-modal-panel max-h-[90vh] overflow-auto">
        <button
          type="button"
          className="admin-modal-close"
          onClick={() => setIsPermissionsModalShow(false)}
          aria-label="بستن"
        >
          <CloseIcon />
        </button>

        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 lg:text-lg">
            مدیریت دسترسی‌های {admin.first_name} {admin.last_name}
          </h2>
          <p className="mt-1 text-xs text-gray-500 lg:text-sm">
            برای افزودن یا حذف دسترسی، روی هر مورد کلیک کنید.
          </p>
          <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            {activeCount} دسترسی فعال از {permissions?.length || 0}
          </p>
        </div>

        {!permissions?.length ? (
          <p className="text-sm text-gray-500">هیچ دسترسی تعریف نشده است.</p>
        ) : (
          <div className="space-y-5">
            {permissionGroups.map((group) => (
              <section
                key={group.key}
                className="overflow-hidden rounded-2xl border border-gray-200"
              >
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <h3 className="text-sm font-bold text-gray-800">
                    {group.label}
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {group.items.map((permission) => {
                    const hasPermission = adminPermissionIds.includes(
                      permission.id
                    );

                    return (
                      <button
                        key={permission.id}
                        type="button"
                        className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-right transition-colors hover:bg-gray-50 ${
                          hasPermission ? "bg-emerald-50/40" : ""
                        }`}
                        onClick={() =>
                          togglePermissionHandler(permission.id, hasPermission)
                        }
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {permission.description}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-400 dir-ltr text-left">
                            {permission.name}
                          </p>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
                            hasPermission
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {hasPermission ? (
                            <>
                              فعال
                              <ToggleOffOutlinedIcon sx={{ fontSize: 18 }} />
                            </>
                          ) : (
                            <>
                              غیرفعال
                              <ToggleOnOutlinedIcon sx={{ fontSize: 18 }} />
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagePermissionsModal;
