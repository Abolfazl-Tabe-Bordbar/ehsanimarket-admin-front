"use client";
import React, { useMemo, useState } from "react";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import deleteAdmin from "@/funcs/deleteAdmin";
import {
  getPermissionActionLabel,
  groupPermissions,
} from "@/funcs/groupPermissions";
import ManagePermissionsModal from "./ManagePermissionsModal";
import UpdateAdminPasswordModal from "./UpdateAdminPasswordModal";

function getInitials(admin) {
  const first = admin?.first_name?.trim()?.[0] || "";
  const last = admin?.last_name?.trim()?.[0] || "";
  return (first + last || admin?.username?.[0] || "?").toUpperCase();
}

function AdminBox({ admin, permissions, refreshDataHandler }) {
  const [isPermissionsModalShow, setIsPermissionsModalShow] = useState(false);
  const [isUpdatePasswordModalShow, setIsUpdatePasswordModalShow] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllPermissions, setShowAllPermissions] = useState(false);

  const adminPermissions = admin?.permissions || [];
  const permissionGroups = useMemo(
    () => groupPermissions(adminPermissions),
    [adminPermissions]
  );
  const visibleGroups = showAllPermissions
    ? permissionGroups
    : permissionGroups.slice(0, 4);
  const hiddenGroupCount = permissionGroups.length - visibleGroups.length;

  const deleteAdminHandler = () => {
    Swal.fire({
      title: "حذف ادمین",
      text: `آیا از حذف ${admin.first_name} ${admin.last_name} مطمئن هستید؟`,
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "لغو",
      confirmButtonText: "حذف",
      confirmButtonColor: "#F51313",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        deleteAdmin(admin.id).then(() => {
          setIsLoading(false);
          refreshDataHandler();
        });
      }
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isPermissionsModalShow && (
        <ManagePermissionsModal
          setIsPermissionsModalShow={setIsPermissionsModalShow}
          admin={admin}
          permissions={permissions}
          refreshDataHandler={refreshDataHandler}
          setIsLoading={setIsLoading}
        />
      )}
      {isUpdatePasswordModalShow && (
        <UpdateAdminPasswordModal
          setIsUpdatePasswordModalShow={setIsUpdatePasswordModalShow}
          admin={admin}
          setIsLoading={setIsLoading}
        />
      )}

      <article className="admin-card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#141c32]/8 text-base font-bold text-[#141c32]"
              aria-hidden="true"
            >
              {getInitials(admin)}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-gray-900">
                {admin.first_name} {admin.last_name}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                نام کاربری:{" "}
                <span className="dir-ltr inline-block rounded-md bg-gray-100 px-2 py-0.5 font-semibold text-gray-700">
                  {admin.username}
                </span>
              </p>
            </div>
          </div>

          <div className="admin-card-actions shrink-0">
            <button
              type="button"
              className="admin-action admin-action-edit"
              onClick={() => setIsPermissionsModalShow(true)}
            >
              <ManageAccountsOutlinedIcon sx={{ fontSize: 18 }} />
              مدیریت دسترسی‌ها
            </button>
            <button
              type="button"
              className="admin-action admin-action-view"
              onClick={() => setIsUpdatePasswordModalShow(true)}
            >
              <LockResetOutlinedIcon sx={{ fontSize: 18 }} />
              تغییر رمز
            </button>
            <button
              type="button"
              className="admin-action admin-action-delete"
              onClick={deleteAdminHandler}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              حذف
            </button>
          </div>
        </div>

        <div className="pt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-gray-800">دسترسی‌های فعال</p>
            <span className="rounded-full bg-[#CA8549]/10 px-2.5 py-0.5 text-xs font-medium text-[#9a6435]">
              {adminPermissions.length} دسترسی
            </span>
          </div>

          {!adminPermissions.length ? (
            <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
              هیچ دسترسی فعالی ثبت نشده است.
            </p>
          ) : (
            <div className="space-y-3">
              {visibleGroups.map((group) => (
                <div
                  key={group.key}
                  className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-gray-700">
                      {group.label}
                    </p>
                    <span className="text-[11px] text-gray-400">
                      {group.items.length} مورد
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((permission) => (
                      <span
                        key={permission.id}
                        className="admin-permission-chip"
                        title={permission.description}
                      >
                        {getPermissionActionLabel(permission.description)}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {hiddenGroupCount > 0 && (
                <button
                  type="button"
                  className="admin-btn-ghost w-full text-xs"
                  onClick={() => setShowAllPermissions(true)}
                >
                  <ExpandMoreIcon sx={{ fontSize: 18 }} />
                  نمایش {hiddenGroupCount} دسته دیگر
                </button>
              )}

              {showAllPermissions && permissionGroups.length > 4 && (
                <button
                  type="button"
                  className="admin-btn-ghost w-full text-xs"
                  onClick={() => setShowAllPermissions(false)}
                >
                  نمایش کمتر
                </button>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

export default AdminBox;
