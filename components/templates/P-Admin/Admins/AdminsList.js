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
    <div className="my-6">
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
