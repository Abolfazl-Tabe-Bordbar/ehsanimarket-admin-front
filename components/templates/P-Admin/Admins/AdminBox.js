"use client";
import React, { useState } from "react";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import deleteAdmin from "@/funcs/deleteAdmin";
import ManagePermissionsModal from "./ManagePermissionsModal";
import UpdateAdminPasswordModal from "./UpdateAdminPasswordModal";

function AdminBox({ admin, permissions, refreshDataHandler }) {
  const [isPermissionsModalShow, setIsPermissionsModalShow] = useState(false);
  const [isUpdatePasswordModalShow, setIsUpdatePasswordModalShow] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const adminPermissions = admin?.permissions || [];

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
      <div className="admin-card py-4 px-4 flex flex-col gap-4 relative">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col gap-2 mt-6 lg:mt-0">
            <h2 className="text-sm lg:text-base font-bold">
              {admin.first_name} {admin.last_name}
            </h2>
            <div className="text-xs lg:text-sm text-gray-600">
              <span>نام کاربری : </span>
              <span className="font-bold text-gray-800">{admin.username}</span>
            </div>
          </div>
          <div className="absolute top-2 left-4 lg:static flex items-center gap-5 text-xs lg:text-base">
            <div
              className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
              onClick={() => setIsPermissionsModalShow(true)}
            >
              مدیریت دسترسی ها
              <span className="text-sm lg:text-2xl">
                <ManageAccountsOutlinedIcon fontSize="" />
              </span>
            </div>
            <div
              className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
              onClick={() => setIsUpdatePasswordModalShow(true)}
            >
              تغییر رمز
              <span className="text-sm lg:text-2xl">
                <LockResetOutlinedIcon fontSize="" />
              </span>
            </div>
            <div
              className="flex items-center gap-1 text-[#F51313] cursor-pointer"
              onClick={deleteAdminHandler}
            >
              حذف
              <span className="text-sm lg:text-2xl">
                <DeleteOutlineIcon fontSize="" />
              </span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs lg:text-sm font-bold mb-2">دسترسی های فعال :</p>
          {!adminPermissions?.length ? (
            <p className="text-xs lg:text-sm text-gray-500">
              هیچ دسترسی فعالی ثبت نشده است.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {adminPermissions.map((permission) => (
                <span
                  key={permission.id}
                  className="bg-[#CA8549]/10 text-[#CA8549] text-xs lg:text-sm px-3 py-1 rounded-full font-bold"
                >
                  {permission.description}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminBox;
