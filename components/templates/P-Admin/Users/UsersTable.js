import Link from "next/link";

function formatUserAddress(user) {
  if (user?.province && user?.city) {
    return `${user.province}، ${user.city}، ${user.address || ""}`.replace(/،\s*$/, "");
  }
  return user?.address || "—";
}

function UsersTable({ users, startIndex = 0 }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>نام و نام خانوادگی</th>
            <th>شماره تماس</th>
            <th>استان</th>
            <th>شهر</th>
            <th>آدرس</th>
            <th>کد پستی</th>
            <th>نام کاربری</th>
            <th className="w-1">تگ‌ها</th>
            <th>تاریخ ثبت‌نام</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="text-gray-400">{startIndex + index + 1}</td>
              <td className="font-medium whitespace-nowrap">
                {user.first_name} {user.last_name}
              </td>
              <td className="dir-ltr text-left whitespace-nowrap">{user.phone_number}</td>
              <td className="whitespace-nowrap">{user.province || "—"}</td>
              <td className="whitespace-nowrap">{user.city || "—"}</td>
              <td className="max-w-[220px] truncate" title={formatUserAddress(user)}>
                {formatUserAddress(user)}
              </td>
              <td className="whitespace-nowrap">{user.post_code || "—"}</td>
              <td className="dir-ltr text-left whitespace-nowrap">{user.username}</td>
              <td className="whitespace-nowrap">
                <div className="flex flex-wrap gap-1">
                  {(user.tags || []).length ? (
                    user.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] text-white whitespace-nowrap shrink-0"
                        style={{ backgroundColor: tag.color }}
                        title={tag.name}
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap">
                {new Date(user.createdAt).toLocaleDateString("fa-IR")}
              </td>
              <td className="whitespace-nowrap">
                <Link
                  href={`/p-admin/users/${user.id}`}
                  className="admin-btn-primary text-xs px-3 py-1.5 inline-flex"
                >
                  مشاهده جزئیات
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;
