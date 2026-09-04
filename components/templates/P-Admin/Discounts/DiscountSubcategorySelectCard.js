"use client";

import { uploadUrl } from "@/data/variables";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function DiscountSubcategorySelectCard({ subcategory, isSelected, onToggle }) {
  const hasImage = Boolean(subcategory.image_path);

  return (
    <button
      type="button"
      onClick={() => onToggle(subcategory.id)}
      className={`discount-select-card ${isSelected ? "discount-select-card--active" : ""}`}
    >
      {isSelected && (
        <span className="absolute top-2 left-2 z-10 text-brand-gold">
          <CheckCircleIcon sx={{ fontSize: 20 }} />
        </span>
      )}

      <div className="relative mb-3">
        <div
          className={`discount-hex-ring ${isSelected ? "discount-hex-ring--active" : ""}`}
          aria-hidden="true"
        />
        <div className="discount-hex-frame discount-hex-frame--md">
          {hasImage ? (
            <img
              src={`${uploadUrl}/senf/${subcategory.image_path}`}
              alt={subcategory.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400">
              <CategoryOutlinedIcon sx={{ fontSize: 28 }} />
            </div>
          )}
        </div>
      </div>

      <p className="line-clamp-2 text-center text-xs font-semibold leading-5">
        {subcategory.name}
      </p>
    </button>
  );
}

export default DiscountSubcategorySelectCard;
