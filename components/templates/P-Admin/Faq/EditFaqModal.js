"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import Loader from "@/components/modules/Loader";
import editFaq from "@/funcs/editFaq";

function EditFaqModal({ setIsEditFaqModalShow, faqData }) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    setIsLoading(true);
    editFaq(data, faqData.id).then((res) => {
      setIsLoading(false);
      faqData.getFaqsHandler();
      setIsEditFaqModalShow(false);
    });
  };

  useEffect(() => {
    setValue("question", faqData.question);
    setValue("answer", faqData.answer);
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="admin-modal-overlay">
        <div
          id="addFaqModal"
          className="admin-modal-panel max-h-[90vh] overflow-auto"
        >
          <div
            className="admin-modal-close"
            onClick={() => setIsEditFaqModalShow(false)}
          >
            <span>
              <CloseIcon />
            </span>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mt-6 space-y-2">
                <label htmlFor="question" className="block text-sm font-bold">
                  سوال
                </label>
                <input
                  type="text"
                  className="border rounded-full px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="question"
                  {...register("question", { required: true })}
                />
                {errors.question?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">سوال اجباری است</p>
                )}
              </div>
              <div className="mt-6 space-y-2">
                <label htmlFor="answer" className="block text-sm font-bold">
                  جواب
                </label>
                <textarea
                  type="text"
                  className="border rounded-3xl px-3 py-3 w-full text-sm text-gray-700 outline-gray-300"
                  id="answer"
                  rows={3}
                  {...register("answer", { required: true })}
                />
                {errors.answer?.type === "required" && (
                  <p className="text-red-500 text-xs mr-2">جواب اجباری است</p>
                )}
              </div>
              <div>
                <button className="bg-[#CA8549] text-white rounded-full py-2 w-2/3 block mx-auto mt-16 text-sm md:text-base">
                  ویرایش اطلاعات
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditFaqModal;
