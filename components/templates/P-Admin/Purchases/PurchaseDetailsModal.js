import { uploadUrl } from "@/data/variables";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function PurchaseDetails({ setIsPurchaseDetailsModalShow, purchaseInfo }) {
  return (
    <div className="admin-modal-overlay">
      <div className="bg-white w-full max-w-[1100px] rounded-xl my-4 mx-2 pb-7 pt-6 overflow-auto relative">
        <div className="pb-5 px-5 border-b border-b-[#444444]">
          <div className="flex gap-3 md:gap-6 items-center">
            <p className="text-xs md:text-base">
              {new Date(purchaseInfo.createdAt).toLocaleDateString("fa")}
            </p>
            <div className="flex gap-2 items-center text-xs md:text-base">
              <p>شناسه پرداخت :</p>
              <p className="font-bold">{purchaseInfo.payment.ref_id}</p>
            </div>
          </div>
          <div
            className="admin-modal-close"
            onClick={() => setIsPurchaseDetailsModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
        </div>
        <div className="mt-10 px-5">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-[6] space-y-6">
              {purchaseInfo.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-2xl p-4 px-0 md:px-4 flex justify-between items-end relative"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <img
                        src={`${uploadUrl}/products/${
                          item.product_images_path
                            ? item.product_images_path[0]
                            : ""
                        }`}
                        className="max-w-[80px] h-[80px]"
                        alt=""
                      />
                    </div>
                    <div className="space-y-4 md:space-y-8">
                      <h2 className="font-bold text-sm md:text-base">
                        {item.product_name}
                      </h2>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-4 lg:gap-16">
                        <p className="text-xs md:text-sm whitespace-nowrap">
                          تعداد کالا :{" "}
                          <span className="font-bold">
                            {item.count.toLocaleString("fa")}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm lg:text-base absolute md:static md:-mb-0.5 bottom-4 left-2 whitespace-nowrap">
                    <span>مبلغ :</span>{" "}
                    <span className="text-xs">
                      <span className="text-sm md:text-base lg:text-lg font-bold">
                        {item.product_price.toLocaleString("fa")}
                      </span>{" "}
                      تومان
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-[2] space-y-6">
              <div className="border px-5 py-8 rounded-2xl space-y-6 h-fit">
                <h2 className="md:text-lg font-bold text-center">فاکتور خرید</h2>
                <div>
                  <div className="flex justify-between items-center border-b border-b-black pb-8">
                    <p>
                      جمع کالاها (
                      {purchaseInfo.orderItems.length.toLocaleString("fa")})
                    </p>
                    <p className="text-xs">
                      <span className="text-lg">
                        {purchaseInfo.total_price.toLocaleString("fa")}
                      </span>{" "}
                      تومان
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-5">
                    <p className="font-bold">جمع کل</p>
                    <p className="text-xs">
                      <span className="text-lg font-bold">
                        {purchaseInfo.total_price.toLocaleString("fa")}
                      </span>{" "}
                      تومان
                    </p>
                  </div>
                </div>
              </div>
              <div className="border px-5 py-8 rounded-2xl space-y-6 h-fit">
                <h2 className="md:text-lg font-bold text-center">اطلاعات گیرنده</h2>
                <div className="space-y-6 text-sm md:text-base">
                  <div className="flex gap-2">
                    <p className="font-bold">نام گیرنده: </p>
                    <p>
                      {purchaseInfo.user.first_name}{" "}
                      {purchaseInfo.user.last_name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <p className="font-bold">شماره تماس: </p>
                    <p>{purchaseInfo.user.phone_number}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="font-bold">آدرس: </p>
                    <p>{purchaseInfo.user.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <p className="font-bold">کد پستی: </p>
                    <p>{purchaseInfo.user.post_code}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseDetails;
