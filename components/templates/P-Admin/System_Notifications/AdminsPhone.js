"use client";

import EmptyMessage from "@/components/modules/EmptyMessage";
import React, { useState } from "react";
import AdminPhoneBox from "./AdminPhoneBox";
import getAdminsPhone from "@/funcs/getAdminsPhone";
import getCookie from "@/funcs/cookies/getCookie";
import AddAdminPhoneModal from "./AddAdminPhoneModal";

function AdminsPhone({ adminsPhone }) {
  const [shownData, setShownData] = useState(adminsPhone);
  const [isAddAdminPhoneModalShow, setIsAddAdminPhoneModalShow] =
    useState(false);

  const getAdminsPhoneHandler = () => {
    getAdminsPhone(getCookie("ramian-pakhsh-admin")).then((res) => {
      setShownData(res);
    });
  };

  return (
    <>
      {isAddAdminPhoneModalShow && (
        <AddAdminPhoneModal
          setIsAddAdminPhoneModalShow={setIsAddAdminPhoneModalShow}
        />
      )}
      <section className="admin-section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="admin-section-title !border-0 !pb-0">شماره‌های مدیران</h2>
          <button
            type="button"
            className="admin-btn-primary"
            onClick={() => setIsAddAdminPhoneModalShow(true)}
          >
            ایجاد شماره جدید
          </button>
        </div>
        {!shownData?.body?.length ? (
          <EmptyMessage text="هیچ شماره‌ای ثبت نشده است." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shownData.body.map((phone) => (
              <AdminPhoneBox
                key={phone.id}
                adminPhone={phone}
                getAdminsPhoneHandler={getAdminsPhoneHandler}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default AdminsPhone;
