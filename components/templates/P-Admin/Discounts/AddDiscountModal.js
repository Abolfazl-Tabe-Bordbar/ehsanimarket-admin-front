'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import CloseIcon from '@mui/icons-material/Close';
import createDiscountPlan from '@/funcs/createDiscountPlan';
import Loader from '@/components/modules/Loader';

function AddDiscountModal({ setIsAddDiscountModalShow }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    createDiscountPlan({
      name: data.name,
      percentage: Number(data.percentage),
      code: data.code,
      minimum_price: Number(data.minimum_price),
      color: data.color,
    }).then((res) => setIsLoading(false));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="fixed w-full h-[100vh] flex justify-center top-0 left-0 bg-black bg-opacity-30 z-50">
        <div
          id="addDiscountModal"
          className="bg-white w-[500px] max-h-fit rounded-xl my-4 mx-2 p-5 pb-14 overflow-auto relative"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsAddDiscountModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div className="mt-2">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-bold">
                  نام پلن تخفیف
                </label>
                <input
                  id="name"
                  type="text"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register('name', { required: true })}
                />
                {errors.name?.type === 'required' && (
                  <p className="text-red-500 text-xs mr-2">
                    نام پلن تخفیف اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="percentage" className="block text-sm font-bold">
                  درصد تخفیف
                </label>
                <input
                  id="percentage"
                  type="number"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register('percentage', { required: true })}
                />
                {errors.percentage?.type === 'required' && (
                  <p className="text-red-500 text-xs mr-2">
                    درصد تخفیف اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="code" className="block text-sm font-bold">
                  کد تخفیف
                </label>
                <input
                  id="code"
                  type="text"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register('code', { required: true })}
                />
                {errors.code?.type === 'required' && (
                  <p className="text-red-500 text-xs mr-2">
                    کد تخفیف اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="minimum_price"
                  className="block text-sm font-bold"
                >
                  حداقل مبلغ خرید
                </label>
                <input
                  id="minimum_price"
                  type="number"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register('minimum_price', { required: true })}
                />
                {errors.minimum_price?.type === 'required' && (
                  <p className="text-red-500 text-xs mr-2">
                    حداقل مبلغ خرید اجباری است
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="color" className="block text-sm font-bold">
                  رنگ پلن تخفیف
                </label>
                <select
                  name=""
                  id="color"
                  className="border rounded-full px-3 py-2 w-full text-sm text-gray-700 outline-gray-300"
                  {...register('color', { required: true })}
                >
                  <option value="">رنگ پلن تخفیف را انتخاب کنید</option>
                  <option value="golden">طلایی</option>
                  <option value="bronze">برنزی</option>
                  <option value="silver">نقره ای</option>
                </select>
                {errors.color?.type === 'required' && (
                  <p className="text-red-500 text-xs mr-2">
                    رنگ پلن تخفیف اجباری است
                  </p>
                )}
              </div>

              <div>
                <button
                  className="bg-[#CA8549] text-white rounded-full py-2 w-3/4 md:w-2/4 block mx-auto mt-16"
                  type="submit"
                >
                  ثبت پلن تخفیف
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddDiscountModal;
