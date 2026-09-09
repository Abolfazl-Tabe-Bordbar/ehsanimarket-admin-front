"use client";

import { uploadUrl, siteUrl } from "@/data/variables";
import React, { useEffect, useState } from "react";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import EditProductModal from "./EditProductModal";
import ProductCommentsModal from "./ProductCommentsModal";
import Link from "next/link";
import Loader from "@/components/modules/Loader";
import deleteProduct from "@/funcs/deleteProduct";
import deleteOffer from "@/funcs/deleteOffer";
import adjustProductStock from "@/funcs/adjustProductStock";

function MetaItem({ icon: Icon, label, value, highlight = false, children = null }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5 min-w-[140px]">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 mb-1">
        <Icon sx={{ fontSize: 14 }} />
        {label}
      </div>
      {children || (
        <p
          className={`text-sm leading-6 break-words ${
            highlight ? "font-bold text-brand-navy" : "font-medium text-gray-700"
          }`}
        >
          {value}
        </p>
      )}
    </div>
  );
}

function ProductBox(props) {
  const [isEditProductModalShow, setIsEditProductModalShow] = useState(false);
  const [isCommentsModalShow, setIsCommentsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stockCount, setStockCount] = useState(Number(props.count || 0));
  const [isStockUpdating, setIsStockUpdating] = useState(false);

  useEffect(() => {
    setStockCount(Number(props.count || 0));
  }, [props.count]);

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

  const adjustStockHandler = async (delta) => {
    if (isStockUpdating) return;
    if (delta < 0 && stockCount <= 0) return;

    setIsStockUpdating(true);
    const res = await adjustProductStock(props.id, delta);
    if (res?.status && res?.body?.count !== undefined) {
      setStockCount(Number(res.body.count));
    }
    setIsStockUpdating(false);
  };

  const displayPrice =
    props?.totalPrice > 0 ? Number(props.totalPrice) : Number(props?.price || 0);

  const stockBadge =
    stockCount <= 0
      ? {
          label: "ناموجود",
          className: "border-red-200 bg-red-50 text-red-700",
        }
      : {
          label: "موجود",
          className: "border-emerald-200 bg-emerald-50 text-emerald-700",
        };

  return (
    <div className="space-y-3">
      {isLoading && <Loader />}
      {isEditProductModalShow && (
        <EditProductModal
          setIsEditProductModalShow={setIsEditProductModalShow}
          productData={props}
          brands={props.brands || []}
        />
      )}
      {isCommentsModalShow && (
        <ProductCommentsModal
          product={props}
          onClose={() => setIsCommentsModalShow(false)}
          onCommentsChange={props.getProductsHandler}
        />
      )}

      <div className="admin-card overflow-hidden !p-0">
        <div className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white p-1.5">
                <img
                  src={`${uploadUrl}/products/${props.images_path[0]}`}
                  className="h-full w-full object-contain"
                  alt=""
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm md:text-base font-bold text-brand-navy line-clamp-2">
                  {props?.name}
                </h2>
                {props?.brand?.name ? (
                  <p className="mt-1 text-xs text-gray-500">{props.brand.name}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start">
              <span
                className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${stockBadge.className}`}
              >
                {stockBadge.label}
              </span>
              {discountPercent > 0 ? (
                <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                  {discountPercent.toLocaleString("fa-IR")}% تخفیف
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <MetaItem
              icon={CategoryOutlinedIcon}
              label="دسته‌بندی"
              value={props?.senf?.name || "—"}
            />
            {props?.brand?.name ? (
              <MetaItem icon={LocalOfferOutlinedIcon} label="برند" value={props.brand.name} />
            ) : null}
            <MetaItem
              icon={VisibilityOutlinedIcon}
              label="بازدید"
              value={Number(props?.view_count || 0).toLocaleString("fa-IR")}
            />
            <MetaItem icon={PaymentsOutlinedIcon} label="مبلغ" highlight>
              <div className="flex flex-wrap items-center gap-2">
                {props?.totalPrice > 0 ? (
                  <span className="text-xs text-gray-400 line-through">
                    {Number(props?.price).toLocaleString("fa-IR")}
                  </span>
                ) : null}
                <span className="text-sm font-bold text-brand-navy">
                  {displayPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </MetaItem>
            <MetaItem icon={Inventory2OutlinedIcon} label="موجودی">
              <div
                className={`inline-flex items-center rounded-lg border overflow-hidden ${
                  stockCount <= 0
                    ? "border-red-200 bg-white"
                    : "border-gray-200 bg-white"
                }`}
              >
                <button
                  type="button"
                  disabled={isStockUpdating || stockCount <= 0}
                  onClick={() => adjustStockHandler(-1)}
                  className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="کاهش موجودی"
                >
                  <RemoveIcon sx={{ fontSize: 18 }} />
                </button>
                <span
                  className={`min-w-[2.75rem] px-1 text-center text-sm font-bold tabular-nums ${
                    stockCount <= 0 ? "text-red-600" : "text-brand-navy"
                  }`}
                >
                  {stockCount.toLocaleString("fa-IR")}
                </span>
                <button
                  type="button"
                  disabled={isStockUpdating}
                  onClick={() => adjustStockHandler(1)}
                  className="flex h-8 w-8 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="افزایش موجودی"
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </MetaItem>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1 border-t border-gray-100">
            <Link
              href={`${siteUrl}/product/${props.id}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-1 text-sm font-medium text-brand-navy hover:text-[#00386b] transition-colors"
            >
              مشاهده در سایت
              <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
            </Link>

            <div className="admin-card-actions shrink-0 !flex-row flex-wrap">
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
      </div>
    </div>
  );
}

export default ProductBox;
