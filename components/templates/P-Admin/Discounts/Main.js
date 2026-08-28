'use client';

import { uploadUrl } from "@/data/variables";
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import getCookie from '@/funcs/cookies/getCookie';
import getDiscountSubcategories from '@/funcs/getDiscountSubcategories';
import getSubcategoryProducts from '@/funcs/getSubcategoryProducts';
import getSenfSubcategories from '@/funcs/getSenfSubcategories';
import removeDiscountSubcategory from '@/funcs/removeDiscountSubcategory';
import setDiscountForProducts from '@/funcs/setDiscountForProducts';
import EmptyMessage from '@/components/modules/EmptyMessage';
import Loader from '@/components/modules/Loader';
import AdminPageShell from "@/components/admin/ui/AdminPageShell";

function Main({ data }) {
  const [categories, setCategories] = useState(data);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [products, setProducts] = useState(null);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [discountPercent, setDiscountPercent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [isSubcategoriesLoading, setIsSubcategoriesLoading] = useState(false);
  const [discountSubcategories, setDiscountSubcategories] = useState(null);
  const [isDiscountSubcategoriesLoading, setIsDiscountSubcategoriesLoading] =
    useState(true);
  const [removingSubcategoryId, setRemovingSubcategoryId] = useState(null);

  const loadDiscountSubcategories = () => {
    setIsDiscountSubcategoriesLoading(true);
    getDiscountSubcategories()
      .then((res) => {
        console.log(res);
        setDiscountSubcategories(res);
        setIsDiscountSubcategoriesLoading(false);
      })
      .catch(() => {
        setIsDiscountSubcategoriesLoading(false);
      });
  };

  useEffect(() => {
    loadDiscountSubcategories();
  }, []);

  const resetProductSelection = () => {
    setProducts(null);
    setSelectedProductIds([]);
    setDiscountPercent('');
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setSelectedSubcategories([]);
    resetProductSelection();

    if (categoryId) {
      setIsSubcategoriesLoading(true);
      getSenfSubcategories(getCookie('ramian-pakhsh-admin'), categoryId)
        .then((res) => {
          setSubcategories(res);
          setIsSubcategoriesLoading(false);
        })
        .catch(() => {
          setIsSubcategoriesLoading(false);
        });
    } else {
      setSubcategories([]);
    }
  };

  const handleRemoveDiscountSubcategory = (subcategory) => {
    Swal.fire({
      title: 'حذف تخفیف',
      text: `آیا از حذف تخفیف محصولات زیردسته «${subcategory.name}» مطمئن هستید؟`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'لغو',
      confirmButtonText: 'حذف تخفیف',
      confirmButtonColor: '#F51313',
    }).then((result) => {
      if (result.isConfirmed) {
        setRemovingSubcategoryId(subcategory.id);
        removeDiscountSubcategory(subcategory.id)
          .then((res) => {
            if (res?.status) {
              loadDiscountSubcategories();
            }
          })
          .finally(() => {
            setRemovingSubcategoryId(null);
          });
      }
    });
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    resetProductSelection();
    setSelectedSubcategories((prev) =>
      prev.includes(subcategoryId)
        ? prev.filter((id) => id !== subcategoryId)
        : [...prev, subcategoryId]
    );
  };

  const handleShowProducts = () => {
    if (selectedSubcategories.length === 0) return;

    setIsLoading(true);
    getSubcategoryProducts(selectedSubcategories.join(','))
      .then((res) => {
        setProducts(res);
        setSelectedProductIds(
          res?.status && res?.body?.length > 0
            ? res.body.map((product) => product.id)
            : []
        );
        setDiscountPercent('');
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const handleProductToggle = (productId) => {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const allProductsSelected =
    products?.body?.length > 0 &&
    products.body.every((product) => selectedProductIds.includes(product.id));

  const handleSelectAllToggle = () => {
    if (!products?.body?.length) return;

    if (allProductsSelected) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(products.body.map((product) => product.id));
    }
  };

  const handleApplyDiscount = () => {
    if (selectedProductIds.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'توجه!',
        text: 'حداقل یک محصول را انتخاب کنید',
      });
      return;
    }

    const percent = Number(discountPercent);
    if (
      discountPercent === '' ||
      Number.isNaN(percent) ||
      percent < 0 ||
      percent > 100
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'توجه!',
        text: 'درصد تخفیف باید عددی بین ۰ تا ۱۰۰ باشد',
      });
      return;
    }

    const payload = products.body
      .filter((product) => selectedProductIds.includes(product.id))
      .map((product) => ({
        p_id: product.id,
        totalPrice: Math.round(product.price * (1 - percent / 100)),
      }));

    setIsApplyingDiscount(true);
    setDiscountForProducts(payload).finally(() => {
      setIsApplyingDiscount(false);
    });
  };

  return (
    <AdminPageShell title="تخفیف‌ها" description="مدیریت کدهای تخفیف">
      {(isLoading || isApplyingDiscount || removingSubcategoryId) && <Loader />}

      <div className="admin-section mb-6">
        <h2 className="admin-section-title">زیردسته‌های دارای تخفیف</h2>

        {isDiscountSubcategoriesLoading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">در حال دریافت زیردسته‌های دارای تخفیف...</p>
          </div>
        ) : discountSubcategories?.status &&
          discountSubcategories?.body?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {discountSubcategories.body.map((subcategory) => (
              <div
                key={subcategory.id}
                className="p-4 border rounded-lg flex flex-col gap-3"
              >
                <p className="text-sm font-medium text-center">
                  {subcategory.name}
                </p>
                <button
                  onClick={() => handleRemoveDiscountSubcategory(subcategory)}
                  disabled={removingSubcategoryId === subcategory.id}
                  className="text-sm bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  حذف تخفیف
                </button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyMessage text="هیچ زیردسته‌ای با تخفیف فعال وجود ندارد." />
        )}
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">انتخاب دسته بندی</h2>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CA8549]"
        >
          <option value="">انتخاب دسته بندی</option>
          {categories?.body?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div className="admin-section mb-6">
          <h2 className="admin-section-title">انتخاب زیر دسته‌ها</h2>

          {isSubcategoriesLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-500">در حال دریافت زیردسته‌ها...</p>
            </div>
          ) : subcategories?.body?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {subcategories.body.map((subcategory) => (
                <div
                  key={subcategory.id}
                  onClick={() => handleSubcategoryToggle(subcategory.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSubcategories.includes(subcategory.id)
                      ? 'bg-[#CA8549] text-white border-[#CA8549]'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-medium text-center">
                    {subcategory.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyMessage text="هیچ زیر دسته‌ای برای این دسته بندی وجود ندارد." />
          )}
        </div>
      )}

      {selectedSubcategories.length > 0 && (
        <div className="mb-6">
          <button
            onClick={handleShowProducts}
            className="admin-btn-accent"
          >
            نمایش محصولات انتخاب شده
          </button>
        </div>
      )}

      {products && (
        <div className="admin-section">
          <h2 className="admin-section-title">محصولات</h2>

          {products?.status && products?.body?.length > 0 ? (
            <>
              <div className="flex flex-wrap items-end gap-4 mb-6 p-4 border rounded-lg bg-gray-50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allProductsSelected}
                    onChange={handleSelectAllToggle}
                    className="w-4 h-4 accent-[#CA8549]"
                  />
                  <span className="text-sm font-medium">انتخاب همه</span>
                </label>

                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="discountPercent"
                    className="text-sm font-medium"
                  >
                    درصد تخفیف
                  </label>
                  <input
                    id="discountPercent"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    className="w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CA8549]"
                    placeholder="مثلاً ۲۰"
                  />
                </div>

                <button
                  onClick={handleApplyDiscount}
                  disabled={isApplyingDiscount || selectedProductIds.length === 0}
                  className="admin-btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  اعمال تخفیف
                </button>
              </div>

              <div className="space-y-4">
                {products.body.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedProductIds.includes(product.id)}
                        onChange={() => handleProductToggle(product.id)}
                        className="w-4 h-4 accent-[#CA8549]"
                      />
                      <img
                        src={`${uploadUrl}/products/${product.images_path[0]}`}
                        alt={product.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          قیمت: {product.price?.toLocaleString()} تومان
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyMessage text="هیچ محصولی یافت نشد." />
          )}
        </div>
      )}
    </AdminPageShell>
  );
}

export default Main;
