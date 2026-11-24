"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import Loader from "@/components/modules/Loader";
import ChangePasswordButton from "@/components/modules/ChangePasswordButton";
import { uploadUrl } from "@/data/variables";
import updateMyAdminProfile from "@/funcs/updateMyAdminProfile";
import uploadAdminAvatar from "@/funcs/uploadAdminAvatar";
import deleteAdminAvatar from "@/funcs/deleteAdminAvatar";
import {
  getPermissionActionLabel,
  groupPermissions,
} from "@/funcs/groupPermissions";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function getInitials(profile) {
  const first = profile?.first_name?.trim()?.[0] || "";
  const last = profile?.last_name?.trim()?.[0] || "";
  return (first + last || profile?.username?.[0] || "?").toUpperCase();
}

function avatarSrc(path) {
  if (!path) return null;
  const normalized = path.replace(/^\//, "");
  return `${uploadUrl}/${normalized}`;
}

function AdminProfileClient({ initialProfile }) {
  const [profile, setProfile] = useState(initialProfile || {});
  const [firstName, setFirstName] = useState(profile.first_name || "");
  const [lastName, setLastName] = useState(profile.last_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const permissionGroups = useMemo(
    () => groupPermissions(profile.permissions || []),
    [profile.permissions]
  );

  const handleSave = async () => {
    setIsLoading(true);
    const result = await updateMyAdminProfile({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    });
    setIsLoading(false);
    if (!result?.status) return;

    setProfile((prev) => ({
      ...prev,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
    }));
    router.refresh();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsLoading(true);
    const result = await uploadAdminAvatar(file);
    setIsLoading(false);
    if (!result?.status) return;

    setProfile((prev) => ({
      ...prev,
      avatar_path: result.data?.avatar_path || prev.avatar_path,
    }));
    router.refresh();
  };

  const handleAvatarDelete = async () => {
    setIsLoading(true);
    const result = await deleteAdminAvatar();
    setIsLoading(false);
    if (!result?.status) return;
    setProfile((prev) => ({ ...prev, avatar_path: null }));
    router.refresh();
  };

  const imageUrl = avatarSrc(profile.avatar_path);

  return (
    <>
      {isLoading && <Loader />}
      <AdminPageShell
        title="پروفایل من"
        description="مشاهده و ویرایش مشخصات، عکس پروفایل و رمز عبور"
        actions={<ChangePasswordButton />}
      >
        <div className="admin-section grid grid-cols-1 gap-5 lg:grid-cols-[320px_1fr]">
          <section className="admin-card p-6 space-y-5">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="عکس پروفایل"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#141c32]/8 text-2xl font-bold text-[#141c32]">
                    {getInitials(profile)}
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="mt-1 text-sm text-gray-500" dir="ltr">
                  {profile.username}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="flex w-full flex-col gap-2">
                <button
                  type="button"
                  className="admin-btn-primary inline-flex items-center justify-center gap-1.5"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PhotoCameraOutlinedIcon sx={{ fontSize: 18 }} />
                  {imageUrl ? "تغییر عکس" : "افزودن عکس"}
                </button>
                {imageUrl && (
                  <button
                    type="button"
                    className="admin-btn-secondary inline-flex items-center justify-center gap-1.5 text-red-600"
                    onClick={handleAvatarDelete}
                  >
                    <DeleteOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                    حذف عکس
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">
                فرمت‌های مجاز: jpg، png، webp — حداکثر ۳ مگابایت
              </p>
            </div>
          </section>

          <div className="space-y-5">
            <section className="admin-card p-6 space-y-4">
              <h3 className="font-semibold text-brand-navy">مشخصات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">نام</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={firstName}
                    maxLength={32}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1.5 block">نام خانوادگی</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={lastName}
                    maxLength={32}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-600 mb-1.5 block">نام کاربری (ورود)</label>
                  <input
                    type="text"
                    className="admin-input bg-gray-50 text-gray-500"
                    value={profile.username || ""}
                    readOnly
                    dir="ltr"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    نام کاربری فقط از بخش مدیریت ادمین‌ها قابل تغییر است.
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button type="button" className="admin-btn-accent" onClick={handleSave}>
                  ذخیره تغییرات
                </button>
              </div>
            </section>

            <section className="admin-card p-6 space-y-3">
              <h3 className="font-semibold text-brand-navy">واحدهای سازمان</h3>
              {!profile.orgUnits?.length ? (
                <p className="text-sm text-gray-500">به هیچ واحدی متصل نیستید.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {profile.orgUnits.map((unit) => (
                    <span key={unit.id} className="admin-permission-chip">
                      {unit.name}
                    </span>
                  ))}
                </div>
              )}
            </section>

            <section className="admin-card p-6 space-y-4">
              <h3 className="font-semibold text-brand-navy">دسترسی‌ها</h3>
              {!permissionGroups.length ? (
                <p className="text-sm text-gray-500">دسترسی فعالی ثبت نشده است.</p>
              ) : (
                <div className="space-y-3">
                  {permissionGroups.map((group) => (
                    <div
                      key={group.key}
                      className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2.5"
                    >
                      <p className="text-xs font-bold text-gray-700 mb-2">{group.label}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {group.items.map((permission) => (
                          <span
                            key={permission.id}
                            className="admin-permission-chip"
                            title={permission.description}
                          >
                            {getPermissionActionLabel(permission.description)}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </AdminPageShell>
    </>
  );
}

export default AdminProfileClient;