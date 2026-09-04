"use client";

import { uploadUrl } from "@/data/variables";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

function DiscountSubcategoryCard({
  subcategory,
  onEdit,
  onRemove,
  isRemoving,
  isEditDisabled,
}) {
  const hasImage = Boolean(subcategory.image_path);

  return (
    <article className="discount-subcategory-card group">
      <div className="discount-subcategory-card__glow" aria-hidden="true" />

      <div className="relative flex flex-col items-center px-4 pb-4 pt-6">
        <div className="relative mb-4">
          <div className="discount-hex-ring" aria-hidden="true" />
          <div className="discount-hex-frame discount-hex-frame--lg">
            {hasImage ? (
              <img
                src={`${uploadUrl}/senf/${subcategory.image_path}`}
                alt={subcategory.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-gold/15 to-brand-navy/10 text-brand-navy/40">
                <CategoryOutlinedIcon sx={{ fontSize: 36 }} />
              </div>
            )}
          </div>

          {subcategory.discountPercent != null && (
            <span className="absolute -bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-md shadow-emerald-500/30">
              <LocalOfferOutlinedIcon sx={{ fontSize: 13 }} />
              {subcategory.discountPercent}٪
            </span>
          )}
        </div>

        <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-center text-sm font-bold text-brand-navy">
          {subcategory.name}
        </h3>

        {subcategory.discountedProductsCount != null && (
          <p className="mt-1 text-xs text-gray-500">
            {subcategory.discountedProductsCount.toLocaleString("fa-IR")} محصول
            با تخفیف
          </p>
        )}

        <div className="mt-4 flex w-full gap-2">
          <button
            type="button"
            onClick={() => onEdit(subcategory)}
            disabled={isRemoving || isEditDisabled}
            className="admin-btn-accent flex-1 !py-2 !text-xs"
          >
            <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
            ویرایش
          </button>
          <button
            type="button"
            onClick={() => onRemove(subcategory)}
            disabled={isRemoving}
            className="admin-btn flex-1 !border-red-200 !py-2 !text-xs text-red-600 hover:!bg-red-50"
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            حذف
          </button>
        </div>
      </div>
    </article>
  );
}

export default DiscountSubcategoryCard;
