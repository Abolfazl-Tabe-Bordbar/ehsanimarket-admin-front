"use client";
import React, { useState } from "react";
import AdminBox from "./AdminBox";
import getAdmins from "@/funcs/getAdmins";
import getPermissions from "@/funcs/getPermissions";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";

function AdminsList({ adminsData, permissionsData }) {
  const [shownAdmins, setShownAdmins] = useState(adminsData);
  const [shownPermissions, setShownPermissions] = useState(permissionsData);

  const refreshDataHandler = () => {
    Promise.all([
      getAdmins(getCookie("ramian-pakhsh-admin")),
      getPermissions(getCookie("ramian-pakhsh-admin")),
    ]).then(([adminsRes, permissionsRes]) => {
      setShownAdmins(adminsRes);
      setShownPermissions(permissionsRes);
    });
  };

  const admins = shownAdmins?.body || shownAdmins?.data || [];
  const permissions = shownPermissions?.body || shownPermissions?.data || [];

  return (
    <div className="my-2">
      {admins.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">تعداد ادمین‌ها</span>
            <span className="text-lg font-bold text-[#141c32]">{admins.length}</span>
          </div>
          <div className="admin-card flex items-center justify-between py-3 px-4">
            <span className="text-sm text-gray-600">دسترسی‌های تعریف‌شده</span>
            <span className="text-lg font-bold text-[#CA8549]">{permissions.length}</span>
          </div>
        </div>
      )}

      {!admins?.length ? (
        <EmptyMessage text="هیچ ادمینی ثبت نشده است." />
      ) : (
        <div className="admin-list">
          {admins.map((admin) => (
            <AdminBox
              key={admin.id}
              admin={admin}
              permissions={permissions}
              refreshDataHandler={refreshDataHandler}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminsList;
