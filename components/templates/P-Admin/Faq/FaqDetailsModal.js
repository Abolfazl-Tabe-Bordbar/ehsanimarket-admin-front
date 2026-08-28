import React from "react";
import CloseIcon from "@mui/icons-material/Close";

function FaqDetailsModal({ setIsFaqDetailsModalShow, faqData }) {
  return (
    <div className="fixed w-full h-[100vh] flex justify-center items-center top-0 left-0 bg-black bg-opacity-30 z-50">
      <div
        id="addProductModal"
        className="bg-white w-[700px] max-h-fit rounded-xl my-4 mx-2 px-8 py-14 overflow-auto relative"
      >
        <div
          className="admin-modal-close"
          onClick={() => setIsFaqDetailsModalShow(false)}
        >
          <span>
            <CloseIcon />
          </span>
        </div>
        <div className="space-y-2">
          <h2 className="text-sm lg:text-base font-bold">{faqData.question}</h2>
          <p className="text-sm lg:text-base text-gray-700">{faqData.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FaqDetailsModal;
