import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import editAdminPhone from "@/funcs/editAdminPhone";

function EditAdminPhoneModal({ setIsEditAdminPhoneModalShow, adminPhoneData, getAdminsPhoneHandler }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    editAdminPhone(
      {
        phone: data.phone,
      },
      adminPhoneData.id
    ).then((res) => {
      setIsLoading(false);
      getAdminsPhoneHandler();
      setIsEditAdminPhoneModalShow(false);
    });
  };

  useEffect(() => {
    setValue("phone", adminPhoneData.phone);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addSenfModal"
          className="bg-white w-11/12 md:w-[500px] max-h-fit rounded-xl my-4 px-8 pb-14 pt-20 overflow-auto relative"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsEditAdminPhoneModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 space-y-2">
                <label htmlFor="phone" className="block text-sm font-bold">
                  شماره تلفن
                </label>
                <input
                  type="number"
                  className="border rounded px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="phone"
                  {...register("phone", { required: true })}
                />
                {errors.phone?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">
                    شماره تلفن اجباری است
                  </p>
                )}
              </div>
              <div>
                <button className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base">
                  ویرایش شماره
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditAdminPhoneModal;
