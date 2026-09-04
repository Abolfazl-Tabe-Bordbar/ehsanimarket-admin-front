"use client";

import { uploadUrl } from "@/data/variables";
import CloseIcon from "@mui/icons-material/Close";
import EmptyMessage from "@/components/modules/EmptyMessage";

function EditSubcategoryDiscountModal({
  subcategory,
  products,
  selectedProductIds,
  discountPercent,
  isApplying,
  onClose,
  onDiscountPercentChange,
  onProductToggle,
  onSelectAllToggle,
  onApply,
}) {
  const allProductsSelected =
    products?.body?.length > 0 &&
    products.body.every((product) => selectedProductIds.includes(product.id));

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-panel max-h-[90vh] overflow-auto !py-6 !px-5 sm:!px-8">
        <div className="admin-modal-close" onClick={onClose}>
          <span>
            <CloseIcon />
          </span>
        </div>

        <div className="mt-2 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-navy">
              ویرایش تخفیف «{subcategory.name}»
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              محصولات و درصد تخفیف را ویرایش کنید
            </p>
          </div>

          {products?.status && products?.body?.length > 0 ? (
            <>
              <div className="flex flex-wrap items-end gap-4 p-4 rounded-xl border border-gray-200/80 bg-gradient-to-l from-brand-gold/5 to-white">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allProductsSelected}
                    onChange={onSelectAllToggle}
                    className="w-4 h-4 accent-[#CA8549]"
                  />
                  <span className="text-sm font-medium">انتخاب همه</span>
                </label>

                <div className="flex flex-col gap-1">
                  <label htmlFor="editDiscountPercent" className="text-sm font-medium">
                    درصد تخفیف
                  </label>
                  <input
                    id="editDiscountPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => onDiscountPercentChange(e.target.value)}
                    className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CA8549]"
                    placeholder="مثلاً ۲۰"
                  />
                </div>

                <button
                  type="button"
                  onClick={onApply}
                  disabled={isApplying || selectedProductIds.length === 0}
                  className="admin-btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ذخیره تغییرات
                </button>
              </div>

              <div className="space-y-3">
                {products.body.map((product) => {
                  const hasDiscount = Number(product.totalPrice) > 0;
                  const currentPercent =
                    hasDiscount && product.price > 0
                      ? Math.round((1 - product.totalPrice / product.price) * 100)
                      : null;

                  return (
                    <div
                      key={product.id}
                      className="admin-card !p-4 flex justify-between items-center gap-4"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={() => onProductToggle(product.id)}
                          className="w-4 h-4 accent-[#CA8549] shrink-0"
                        />
                        <img
                          src={`${uploadUrl}/products/${product.images_path?.[0] || ""}`}
                          alt={product.name}
                          className="w-16 h-16 object-contain shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold truncate">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            قیمت: {Number(product.price).toLocaleString("fa-IR")} تومان
                          </p>
                          {hasDiscount && (
                            <p className="text-sm text-green-600">
                              قیمت با تخفیف:{" "}
                              {Number(product.totalPrice).toLocaleString("fa-IR")} تومان
                              {currentPercent !== null ? ` (${currentPercent}٪)` : ""}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyMessage text="محصولی برای این زیردسته یافت نشد." />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditSubcategoryDiscountModal;
