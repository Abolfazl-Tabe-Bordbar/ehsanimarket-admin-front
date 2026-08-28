import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { getTestimonialImageUrl, getTestimonialTypeLabel } from "./testimonialHelpers";

function TestimonialsTable({ items = [], startIndex = 0, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>تصویر</th>
            <th>نام</th>
            <th>نوع</th>
            <th>عنوان / حوزه</th>
            <th>متن نظر</th>
            <th>ترتیب</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const imageUrl = getTestimonialImageUrl(item);

            return (
              <tr key={item.id}>
                <td className="text-gray-400">{startIndex + index + 1}</td>
                <td>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="h-10 w-10 rounded-xl object-cover border border-gray-200"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="font-medium whitespace-nowrap">{item.name}</td>
                <td className="whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      item.type === "business"
                        ? "bg-[#253c8a]/10 text-[#253c8a]"
                        : "bg-[#CA8549]/10 text-[#CA8549]"
                    }`}
                  >
                    {getTestimonialTypeLabel(item.type)}
                  </span>
                </td>
                <td className="max-w-[160px] truncate whitespace-nowrap" title={item.subtitle || ""}>
                  {item.subtitle || "—"}
                </td>
                <td className="max-w-[280px] truncate" title={item.text}>
                  {item.text}
                </td>
                <td className="whitespace-nowrap">{item.sort_order ?? 0}</td>
                <td className="whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      item.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {item.is_active ? "فعال" : "غیرفعال"}
                  </span>
                </td>
                <td>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button
                      type="button"
                      className="admin-action-edit"
                      onClick={() => onEdit(item)}
                    >
                      <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
                      ویرایش
                    </button>
                    <button
                      type="button"
                      className="admin-action-delete"
                      onClick={() => onDelete(item.id)}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TestimonialsTable;
