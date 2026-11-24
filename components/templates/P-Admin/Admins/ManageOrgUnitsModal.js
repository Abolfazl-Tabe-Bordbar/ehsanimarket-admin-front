"use client";

import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import getCookie from "@/funcs/cookies/getCookie";
import getOrgUnits from "@/funcs/getOrgUnits";
import setAdminOrgUnits from "@/funcs/setAdminOrgUnits";

function ManageOrgUnitsModal({
  setIsOrgUnitsModalShow,
  admin,
  refreshDataHandler,
  setIsLoading,
}) {
  const [units, setUnits] = useState([]);
  const [selectedIds, setSelectedIds] = useState(
    (admin?.orgUnits || []).map((unit) => unit.id)
  );
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    let active = true;
    getOrgUnits(getCookie("ramian-pakhsh-admin")).then((data) => {
      if (!active) return;
      setUnits(data?.body || []);
      setLoadingList(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleUnit = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const saveHandler = () => {
    setIsLoading(true);
    setAdminOrgUnits(admin.id, selectedIds).then((res) => {
      setIsLoading(false);
      if (res?.status) {
        refreshDataHandler();
        setIsOrgUnitsModalShow(false);
      }
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-panel max-h-[90vh] overflow-auto">
        <button
          type="button"
          className="admin-modal-close"
          onClick={() => setIsOrgUnitsModalShow(false)}
          aria-label="بستن"
        >
          <CloseIcon />
        </button>

        <div className="mb-6">
          <h2 className="text-base font-bold text-gray-900 lg:text-lg">
            واحدهای {admin.first_name} {admin.last_name}
          </h2>
          <p className="mt-1 text-xs text-gray-500 lg:text-sm">
            این مدیر می‌تواند هم‌زمان عضو یک یا چند واحد سازمان باشد.
          </p>
        </div>

        {loadingList ? (
          <p className="text-sm text-gray-500">در حال دریافت واحدها...</p>
        ) : !units.length ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            هنوز واحدی تعریف نشده است. ابتدا از بخش «واحدهای سازمان» یک واحد بسازید.
          </p>
        ) : (
          <div className="space-y-2">
            {units.map((unit) => {
              const checked = selectedIds.includes(unit.id);
              return (
                <label
                  key={unit.id}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-100 px-4 py-3 hover:bg-gray-50"
                >
                  <span className="text-sm font-medium text-gray-800">{unit.name}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleUnit(unit.id)}
                  />
                </label>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="admin-btn-secondary"
            onClick={() => setIsOrgUnitsModalShow(false)}
          >
            انصراف
          </button>
          <button
            type="button"
            className="admin-btn-accent"
            onClick={saveHandler}
            disabled={loadingList || !units.length}
          >
            ذخیره واحدها
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageOrgUnitsModal;
