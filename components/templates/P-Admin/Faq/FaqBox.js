"use client";
import React, { useState } from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Loader from "@/components/modules/Loader";
import deleteFaq from "@/funcs/deleteFaq";
import EditFaqModal from "./EditFaqModal";
import FaqDetailsModal from "./FaqDetailsModal";

function FaqBox(props) {
  const [isEditFaqModalShow, setIsEditFaqModalShow] = useState(false);
  const [isFaqDetailsModalShow, setIsFaqDetailsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const deleteFaqHandler = () => {
    setIsLoading(true);
    deleteFaq(props.id).then(() => {
      setIsLoading(false);
      props.getFaqsHandler();
    });
  };

  return (
    <div>
      {isLoading && <Loader />}
      {isEditFaqModalShow && (
        <EditFaqModal
          setIsEditFaqModalShow={setIsEditFaqModalShow}
          faqData={props}
        />
      )}
      {isFaqDetailsModalShow && (
        <FaqDetailsModal
          setIsFaqDetailsModalShow={setIsFaqDetailsModalShow}
          faqData={props}
        />
      )}
      <div className="admin-card relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0 flex-1 pt-8 lg:pt-0">
          <h2 className="text-sm lg:text-base font-bold line-clamp-2 text-brand-navy">
            {props.question}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-2">{props.answer}</p>
        </div>
        <div className="admin-card-actions absolute top-3 left-3 lg:static">
          <button
            type="button"
            className="admin-action-view"
            onClick={() => setIsFaqDetailsModalShow(true)}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
            نمایش
          </button>
          <button
            type="button"
            className="admin-action-edit"
            onClick={() => setIsEditFaqModalShow(true)}
          >
            <BorderColorOutlinedIcon sx={{ fontSize: 16 }} />
            ویرایش
          </button>
          <button
            type="button"
            className="admin-action-delete"
            onClick={deleteFaqHandler}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}

export default FaqBox;
