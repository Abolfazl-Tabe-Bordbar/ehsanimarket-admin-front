'use client';
import React, { useState } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import Loader from '@/components/modules/Loader';
import deleteDiscountPlan from '@/funcs/deleteDiscountPlan';
import changeDiscountPlanStatus from '@/funcs/changeDiscountPlanStatus';
import EditDiscountModal from './EditDiscountModal';

const translateColors = {
  bronze: 'برنزی',
  silver: 'نقره ای',
  golden: 'طلایی',
}

function DiscountBox(props) {
  const [isEditDiscountModalShow, setIsEditDiscountModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteDiscountHandler = () => {
    setIsLoading(true);
    deleteDiscountPlan(props.id).then((res) => {
      setIsLoading(false);
      props.getDiscountPlansHandler();
    });
  };

  const changeStatusHandler = () => {
    setIsLoading(true);
    changeDiscountPlanStatus(props.id).then((res) => {
      setIsLoading(false);
      props.getDiscountPlansHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditDiscountModalShow && (
        <EditDiscountModal
          setIsEditDiscountModalShow={setIsEditDiscountModalShow}
          discountData={props}
        />
      )}
      <div className="admin-card py-2 lg:px-4 flex justify-between items-center relative">
        <div className="flex items-end lg:items-center lg:gap-6">
          <div className="flex flex-col lg:flex-row mt-6 lg:mt-0">
            <h2 className="text-sm lg:text-base font-bold whitespace-nowrap">
              {props?.name}
            </h2>
            <div className="flex flex-wrap items-center mt-2 lg:mt-0">
              <div className="whitespace-nowrap lg:mr-8 ml-6 text-xs lg:text-base">
                <span>کد تخفیف : </span>{' '}
                <span className="font-bold">{props?.code}</span>
              </div>
              <div className="whitespace-nowrap lg:mr-8 ml-6 text-xs lg:text-base">
                <span>درصد تخفیف : </span>{' '}
                <span className="font-bold">{props?.percentage}%</span>
              </div>
              <div className="line-clamp-1 text-xs lg:text-base">
                <span>حداقل مبلغ :</span>{' '}
                <span className="text-xs lg:text-lg font-bold">
                  {Number(props?.minimum_price).toLocaleString('fa-IR')}{' '}
                  <span className="text-[10px] lg:text-xs font-medium">
                    تومان
                  </span>
                </span>
              </div>
              <div className="whitespace-nowrap lg:mr-8 mr-6 text-xs lg:text-base">
                <span>رنگ تخفیف : </span>{' '}
                <span className="font-bold">{translateColors[props?.color]}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-2 left-4 lg:static flex items-center gap-5 text-xs lg:text-base">
          <div
            className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
            onClick={changeStatusHandler}
          >
            {props?.is_active ? (
              <>
                فعال
                <span className="text-sm lg:text-2xl">
                  <ToggleOffOutlinedIcon fontSize="" />
                </span>
              </>
            ) : (
              <>
                غیرفعال
                <span className="text-sm lg:text-2xl">
                  <ToggleOnOutlinedIcon fontSize="" />
                </span>
              </>
            )}
          </div>
          <div
            className="flex items-center gap-1 text-[#004B8F] cursor-pointer"
            onClick={() => setIsEditDiscountModalShow(true)}
          >
            ویرایش
            <span className="text-sm lg:text-2xl">
              <BorderColorOutlinedIcon fontSize="" />
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-[#F51313] cursor-pointer"
            onClick={deleteDiscountHandler}
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

export default DiscountBox;
