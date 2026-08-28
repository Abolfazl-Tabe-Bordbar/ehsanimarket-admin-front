'use client';
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined';
import ToggleOffOutlinedIcon from '@mui/icons-material/ToggleOffOutlined';
import setAdminPermission from '@/funcs/setAdminPermission';

function ManagePermissionsModal({
  setIsPermissionsModalShow,
  admin,
  permissions,
  refreshDataHandler,
  setIsLoading,
}) {
  const adminPermissionIds = (admin?.permissions || []).map((p) => p.id);

  const getPermissionLabel = (permission) => {
    return (
      permission?.name ||
      permission?.title ||
      permission?.permission_name ||
      `دسترسی ${permission?.id}`
    );
  };

  const togglePermissionHandler = (permissionId, hasPermission) => {
    setIsLoading(true);
    setAdminPermission({
      admin_id: admin.id,
      permission_id: permissionId,
      status: hasPermission ? 0 : 1,
    }).then((res) => {
      setIsLoading(false);
      if (res?.status) {
        refreshDataHandler();
      }
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div
        id="managePermissionsModal"
        className="bg-white w-[900px] max-h-[90vh] rounded-xl my-4 mx-2 px-8 py-14 overflow-auto relative"
      >
        <div
          className="admin-modal-close"
          onClick={() => setIsPermissionsModalShow(false)}
        >
          <span>
            <CloseIcon />
          </span>
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-bold mb-2">
            مدیریت دسترسی های {admin.first_name} {admin.last_name}
          </h2>
          <p className="text-xs lg:text-sm text-gray-600 mb-6">
            برای افزودن یا حذف دسترسی، روی هر مورد کلیک کنید.
          </p>
          {!permissions?.length ? (
            <p className="text-sm text-gray-500">هیچ دسترسی تعریف نشده است.</p>
          ) : (
            <div className="space-y-3">
              {permissions.map((permission) => {
                const hasPermission = adminPermissionIds.includes(
                  permission.id
                );

                return (
                  <div
                    key={permission.id}
                    className="border rounded-xl py-3 px-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      togglePermissionHandler(permission.id, hasPermission)
                    }
                  >
                    <div>
                      <p className="text-sm lg:text-base font-bold">
                        {permission.name}
                      </p>
                      <p className="text-xs lg:text-sm text-gray-600">
                        {permission.description}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs lg:text-base ${
                        hasPermission ? 'text-[#119E30]' : 'text-gray-400'
                      }`}
                    >
                      {hasPermission ? (
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagePermissionsModal;
