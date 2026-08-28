"use client";

import React, { useState } from "react";
import AddArticleModal from "./AddArticleModal";

function AddArticleButton({ meta }) {
  const [isAddArticleModalShow, setIsAddArticleModalShow] = useState(false);

  return (
    <>
      {isAddArticleModalShow && (
        <AddArticleModal
          setIsAddArticleModalShow={setIsAddArticleModalShow}
          meta={meta}
        />
      )}
      <button
        type="button"
        onClick={() => setIsAddArticleModalShow(true)}
        className="bg-[#CA8549] text-white rounded-full px-6 py-2 text-sm font-bold"
      >
        افزودن مقاله
      </button>
    </>
  );
}

export default AddArticleButton;
