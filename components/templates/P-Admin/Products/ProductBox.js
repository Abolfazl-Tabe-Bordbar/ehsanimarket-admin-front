"use client";

import { uploadUrl, siteUrl } from "@/data/variables";
import React, { useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditProductModal from "./EditProductModal";
import ProductCommentsModal from "./ProductCommentsModal";
import Link from "next/link";
import Loader from "@/components/modules/Loader";
import deleteProduct from "@/funcs/deleteProduct";
import deleteOffer from "@/funcs/deleteOffer";

function ProductBox(props) {
  const [isEditProductModalShow, setIsEditProductModalShow] = useState(false);
  const [isCommentsModalShow, setIsCommentsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let discountPercent = null;
  if (
    props.totalPrice &&
    props.price &&
    props.price > props.totalPrice &&
    props.price > 0
  ) {
    const rawPercent = ((props.price - props.totalPrice) / props.price) * 100;
    discountPercent = Math.round(rawPercent);
  }

  const deleteProductHandler = () => {
    setIsLoading(true);
    deleteProduct(props.id).then(() => {
      setIsLoading(false);
      props.getProductsHandler();
    });
  };

  const deleteOfferHandler = () => {
    setIsLoading(true);
    deleteOffer(props.id).then(() => {
      setIsLoading(false);
      props.getProductsHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditProductModalShow && (
        <EditProductModal
          setIsEditProductModalShow={setIsEditProductModalShow}
          productData={props}
        />
      )}
      {isCommentsModalShow && (
        <ProductCommentsModal
          product={props}
          onClose={() => setIsCommentsModalShow(false)}
          onCommentsChange={props.getProductsHandler}
        />
      )}

      <div className="admin-card p-4 flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1 min-w-0">
          <img
            src={`${uploadUrl}/products/${props.images_path[0]}`}
            className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl border border-gray-100 bg-white shrink-0"
            alt=""
          />
          <div className="min-w-0 flex-1">
            <h2 className="font-bold text-sm md:text-base line-clamp-2 text-brand-navy">
              {props?.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs md:text-sm text-gray-600">
              <span>
                دسته‌بندی:{" "}
                <span className="font-bold text-gray-800">{props?.senf?.name}</span>
              </span>
              {props?.brand?.name && (
                <span>
                  برند:{" "}
                  <span className="font-bold text-gray-800">{props.brand.name}</span>
                </span>
              )}
              <span>
                بازدید:{" "}
                <span className="font-bold text-gray-800">
                  {Number(props?.view_count || 0).toLocaleString("fa-IR")}
                </span>
              </span>
              <span className="inline-flex flex-wrap items-center gap-2">
                مبلغ:
                {props?.totalPrice > 0 ? (
                  <>
                    <span className="text-gray-400 line-through">
                      {Number(props?.price).toLocaleString("fa-IR")}
                    </span>
                    <span className="font-bold text-brand-navy">
                      {Number(props?.totalPrice).toLocaleString("fa-IR")}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-brand-navy">
                    {Number(props?.price).toLocaleString("fa-IR")}
                  </span>
                )}
                <span className="text-[11px]">تومان</span>
                {discountPercent > 0 ? (
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-red-100 text-red-600 text-xs font-bold">
                    {discountPercent.toLocaleString("fa-IR")}%
                  </span>
                ) : null}
              </span>
            </div>
          </div>
        </div>

        <div className="admin-card-actions shrink-0 border-t lg:border-t-0 lg:border-r border-gray-100 pt-3 lg:pt-0 lg:pr-4">
          <Link
            href={`${siteUrl}/product/${props.id}`}
            target="_blank"
            className="admin-action-view"
          >
            مشاهده
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          </Link>
          <button
            type="button"
            onClick={() => setIsCommentsModalShow(true)}
            className="admin-action-comments"
          >
            نظرات
            <ChatBubbleOutlineIcon sx={{ fontSize: 16 }} />
            {(props.pendingCommentsCount || 0) > 0 && (
              <span className="inline-flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {Number(props.pendingCommentsCount).toLocaleString("fa-IR")}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsEditProductModalShow(true)}
            className="admin-action-edit"
          >
            ویرایش
            <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
          {discountPercent > 0 ? (
            <button
              type="button"
              onClick={deleteOfferHandler}
              className="admin-action-discount"
            >
              حذف تخفیف
              <RemoveIcon sx={{ fontSize: 16 }} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={deleteProductHandler}
            className="admin-action-delete"
          >
            حذف
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductBox;
