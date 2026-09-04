import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { getBrandLogoUrl } from "./brandHelpers";

function BrandsTable({ items = [], startIndex = 0, onEdit, onDelete }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table w-full">
        <thead>
          <tr>
            <th>#</th>
            <th className="whitespace-nowrap w-[90px]">لوگو</th>
            <th className="w-full">نام برند</th>
            <th className="whitespace-nowrap">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const logoUrl = getBrandLogoUrl(item);

            return (
              <tr key={item.id}>
                <td className="text-gray-400">{startIndex + index + 1}</td>
                <td className="whitespace-nowrap w-[90px]">
                  {logoUrl ? (
                    <img
                      src={logoUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="h-16 w-16 min-h-[64px] min-w-[64px] shrink-0 rounded-xl object-contain border border-gray-200 bg-gray-50"
                    />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="font-medium whitespace-nowrap w-full">{item.name}</td>
                <td className="whitespace-nowrap">
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

export default BrandsTable;
