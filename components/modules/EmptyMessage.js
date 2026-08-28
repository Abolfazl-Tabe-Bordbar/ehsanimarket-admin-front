import React from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function EmptyMessage({ text }) {
  return (
    <div className="admin-empty">
      <InboxOutlinedIcon className="text-gray-300 mb-3" sx={{ fontSize: 48 }} />
      <p className="admin-empty-text">{text}</p>
    </div>
  );
}

export default EmptyMessage;
