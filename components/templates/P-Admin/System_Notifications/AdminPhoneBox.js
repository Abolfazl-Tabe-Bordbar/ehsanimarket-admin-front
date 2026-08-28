import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import deleteAdminPhone from "@/funcs/deleteAdminPhone";
import Loader from "@/components/modules/Loader";
import EditAdminPhoneModal from "./EditAdminPhoneModal";

function AdminPhoneBox({ adminPhone, getAdminsPhoneHandler }) {
  const [isEditAdminPhoneModalShow, setIsEditAdminPhoneModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteAdminPhoneHandler = () => {
    setIsLoading(true);
    deleteAdminPhone(adminPhone.id).then((res) => {
      setIsLoading(false);
      getAdminsPhoneHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditAdminPhoneModalShow && (
        <EditAdminPhoneModal
          setIsEditAdminPhoneModalShow={setIsEditAdminPhoneModalShow}
          adminPhoneData={adminPhone}
          getAdminsPhoneHandler={getAdminsPhoneHandler}
        />
      )}
      <div className="admin-card py-4 px-4 flex justify-between items-center relative">
        <div className="flex flex-col gap-2 mt-6 lg:mt-0">
          <h2 className="text-sm lg:text-base font-bold line-clamp-1">
            {adminPhone?.phone}
          </h2>
        </div>
        <div className="absolute top-2 left-4 lg:static flex items-center gap-5 text-xs lg:text-base">
          <div
            className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
            onClick={() => setIsEditAdminPhoneModalShow(true)}
          >
            ویرایش
            <span className="text-sm lg:text-2xl">
              <BorderColorOutlinedIcon fontSize="" />
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[#F51313] cursor-pointer"
            onClick={deleteAdminPhoneHandler}
          >
            حذف
            <span className="text-sm lg:text-2xl">
              <DeleteOutlineIcon fontSize="" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPhoneBox;
