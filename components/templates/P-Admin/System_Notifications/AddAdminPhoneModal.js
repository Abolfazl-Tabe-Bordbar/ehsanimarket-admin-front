import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import createAdminPhone from "@/funcs/createAdminPhone";

function AddAdminPhoneModal({setIsAddAdminPhoneModalShow}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    createAdminPhone({
      phone: data.phone,
    }).then((res) => setIsLoading(false));
  };

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
            onClick={() => setIsAddAdminPhoneModalShow(false)}
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
                  ثبت شماره
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAdminPhoneModal;
