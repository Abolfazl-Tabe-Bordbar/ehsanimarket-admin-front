"use client";

import React, { useEffect, useState } from "react";
import ArticleBox from "./ArticleBox";
import getArticles from "@/funcs/getArticles";
import getCookie from "@/funcs/cookies/getCookie";
import EmptyMessage from "@/components/modules/EmptyMessage";
import AdminSearchBar from "@/components/admin/ui/AdminSearchBar";

function ArticlesList({ data, meta, onRefresh }) {
  const [shownData, setShownData] = useState(data);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    if (!searchValue.trim()) {
      setShownData(data);
    }
  }, [data, searchValue]);

  const searchArticlesHandler = (value = searchValue) => {
    const term = value.trim();
    const query = term ? `q=${encodeURIComponent(term)}` : "";
    getArticles(getCookie("ramian-pakhsh-admin"), query).then((res) =>
      setShownData(res)
    );
  };

  const getArticlesHandler = () => {
    if (searchValue.trim()) {
      searchArticlesHandler(searchValue);
      return;
    }
    if (onRefresh) {
      onRefresh();
      return;
    }
    getArticles(getCookie("ramian-pakhsh-admin")).then((res) => setShownData(res));
  };

  const articles = shownData?.data || [];
  const apiError =
    shownData?.status === false ? shownData?.message : null;
  const isSearching = Boolean(searchValue.trim());

  return (
    <div className="admin-list mt-6">
      <AdminSearchBar
        className="mb-2"
        value={searchValue}
        onChange={setSearchValue}
        onSearch={searchArticlesHandler}
        onClear={() => {
          setSearchValue("");
          searchArticlesHandler("");
        }}
        placeholder="جستجو در عنوان، خلاصه، نویسنده یا اسلاگ..."
      />
      {apiError && (
        <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 rounded-xl py-3 px-4">
          {apiError}
        </p>
      )}
      {!articles.length ? (
        <EmptyMessage
          text={
            isSearching
              ? "مقاله‌ای با این عبارت یافت نشد."
              : "هنوز مقاله‌ای ثبت نشده است."
          }
        />
      ) : (
        articles.map((article) => (
          <ArticleBox
            key={article.id}
            {...article}
            meta={meta}
            getArticlesHandler={getArticlesHandler}
          />
        ))
      )}
    </div>
  );
}

export default ArticlesList;
