"use client";

import React, { useEffect, useState } from "react";
import AddArticleButton from "./AddArticleButton";
import ArticlesList from "./ArticlesList";
import axios from "axios";
import { baseUrl } from "@/data/variables";
import getCookie from "@/funcs/cookies/getCookie";
import getArticles from "@/funcs/getArticles";
import getArticleMeta from "@/funcs/getArticleMeta";
import Swal from "sweetalert2";
import Loader from "@/components/modules/Loader";
import AdminPageShell from "@/components/admin/ui/AdminPageShell";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

function authHeaders() {
  return { cookies: getCookie("ramian-pakhsh-admin") };
}

function MetaItemActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={onEdit}
        className="p-1 text-[#004B8F] hover:bg-blue-50 rounded"
        title="ویرایش"
      >
        <EditOutlinedIcon sx={{ fontSize: 16 }} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        className="p-1 text-[#F51313] hover:bg-red-50 rounded"
        title="حذف"
      >
        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
      </button>
    </div>
  );
}

function MetaManager({ meta, onRefresh }) {
  const [categoryName, setCategoryName] = useState("");
  const [categoryColor, setCategoryColor] = useState("#CA8549");
  const [tagName, setTagName] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editCategoryForm, setEditCategoryForm] = useState({ name: "", color: "" });
  const [editTagForm, setEditTagForm] = useState({ name: "" });

  const addCategory = async () => {
    if (!categoryName.trim()) return;
    const { data } = await axios.post(
      `${baseUrl}/articles/categories`,
      { name: categoryName, color: categoryColor },
      { headers: authHeaders() }
    );
    Swal.fire({ icon: data.status ? "success" : "error", title: data.message });
    if (data.status) {
      onRefresh();
      setCategoryName("");
    }
  };

  const addTag = async () => {
    if (!tagName.trim()) return;
    const { data } = await axios.post(
      `${baseUrl}/articles/tags`,
      { name: tagName },
      { headers: authHeaders() }
    );
    Swal.fire({ icon: data.status ? "success" : "error", title: data.message });
    if (data.status) {
      onRefresh();
      setTagName("");
    }
  };

  const startEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setEditCategoryForm({ name: cat.name, color: cat.color || "#CA8549" });
    setEditingTagId(null);
  };

  const saveEditCategory = async (id) => {
    const { data } = await axios.put(
      `${baseUrl}/articles/categories/${id}`,
      editCategoryForm,
      { headers: authHeaders() }
    );
    Swal.fire({ icon: data.status ? "success" : "error", title: data.message });
    if (data.status) {
      setEditingCategoryId(null);
      onRefresh();
    }
  };

  const deleteCategory = async (cat) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `حذف دسته «${cat.name}»؟`,
      text: "مقالات این دسته بدون دسته می‌شوند.",
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    const { data } = await axios.delete(`${baseUrl}/articles/categories/${cat.id}`, {
      headers: authHeaders(),
    });
    Swal.fire({ icon: data.status ? "success" : "error", title: data.message });
    if (data.status) onRefresh();
  };

  const startEditTag = (tag) => {
    setEditingTagId(tag.id);
    setEditTagForm({ name: tag.name });
    setEditingCategoryId(null);
  };

  const saveEditTag = async (id) => {
    const { data } = await axios.put(
      `${baseUrl}/articles/tags/${id}`,
      editTagForm,
      { headers: authHeaders() }
    );
    Swal.fire({ icon: data.status ? "success" : "error", title: data.message });
    if (data.status) {
      setEditingTagId(null);
      onRefresh();
    }
  };

  const deleteTag = async (tag) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: `حذف برچسب «${tag.name}»؟`,
      text: "این برچسب از مقالات مرتبط حذف می‌شود.",
      showCancelButton: true,
      confirmButtonText: "حذف",
      cancelButtonText: "انصراف",
    });
    if (!confirm.isConfirmed) return;

    const { data } = await axios.delete(`${baseUrl}/articles/tags/${tag.id}`, {
      headers: authHeaders(),
    });
    Swal.fire({ icon: data.status ? "success" : "error", title: data.message });
    if (data.status) onRefresh();
  };

  return (
    <div className="grid md:grid-cols-2 gap-4 mb-6">
      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-bold text-sm mb-3">دسته‌های مقاله</h3>
        <div className="flex gap-2 mb-3">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="نام دسته جدید"
            className="border rounded-lg px-3 py-2 text-sm flex-1"
          />
          <input
            type="color"
            value={categoryColor}
            onChange={(e) => setCategoryColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border"
            title="رنگ دسته"
          />
          <button
            type="button"
            onClick={addCategory}
            className="bg-[#253c8a] text-white px-4 rounded-lg text-sm"
          >
            افزودن
          </button>
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {meta.categories.map((cat) =>
            editingCategoryId === cat.id ? (
              <div key={cat.id} className="flex gap-2 items-center border rounded-lg p-2">
                <input
                  value={editCategoryForm.name}
                  onChange={(e) =>
                    setEditCategoryForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border rounded px-2 py-1 text-sm flex-1"
                />
                <input
                  type="color"
                  value={editCategoryForm.color}
                  onChange={(e) =>
                    setEditCategoryForm((f) => ({ ...f, color: e.target.value }))
                  }
                  className="w-8 h-8 rounded cursor-pointer"
                />
                <button
                  type="button"
                  onClick={() => saveEditCategory(cat.id)}
                  className="text-xs bg-[#CA8549] text-white px-2 py-1 rounded"
                >
                  ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategoryId(null)}
                  className="text-xs text-gray-500 px-2"
                >
                  لغو
                </button>
              </div>
            ) : (
              <div
                key={cat.id}
                className="flex items-center justify-between gap-2 border rounded-lg px-3 py-2"
              >
                <span
                  className="text-xs px-2 py-1 rounded-lg text-white"
                  style={{ backgroundColor: cat.color }}
                >
                  {cat.name}
                </span>
                <MetaItemActions
                  onEdit={() => startEditCategory(cat)}
                  onDelete={() => deleteCategory(cat)}
                />
              </div>
            )
          )}
        </div>
      </div>

      <div className="border rounded-xl p-4 bg-white">
        <h3 className="font-bold text-sm mb-3">برچسب‌های مقاله</h3>
        <div className="flex gap-2 mb-3">
          <input
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="نام برچسب جدید"
            className="border rounded-lg px-3 py-2 text-sm flex-1"
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-[#253c8a] text-white px-4 rounded-lg text-sm"
          >
            افزودن
          </button>
        </div>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {meta.tags.map((tag) =>
            editingTagId === tag.id ? (
              <div key={tag.id} className="flex gap-2 items-center border rounded-lg p-2">
                <input
                  value={editTagForm.name}
                  onChange={(e) =>
                    setEditTagForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="border rounded px-2 py-1 text-sm flex-1"
                />
                <button
                  type="button"
                  onClick={() => saveEditTag(tag.id)}
                  className="text-xs bg-[#CA8549] text-white px-2 py-1 rounded"
                >
                  ذخیره
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTagId(null)}
                  className="text-xs text-gray-500 px-2"
                >
                  لغو
                </button>
              </div>
            ) : (
              <div
                key={tag.id}
                className="flex items-center justify-between gap-2 border rounded-lg px-3 py-2"
              >
                <span className="text-xs px-2 py-1 rounded-lg bg-gray-100 text-gray-700">
                  #{tag.name}
                </span>
                <MetaItemActions
                  onEdit={() => startEditTag(tag)}
                  onDelete={() => deleteTag(tag)}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function Main() {
  const [data, setData] = useState(null);
  const [meta, setMeta] = useState({ categories: [], tags: [] });
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const token = getCookie("ramian-pakhsh-admin");
    const [articlesRes, metaRes] = await Promise.all([
      getArticles(token),
      getArticleMeta(token),
    ]);
    setData(articlesRes || { status: false, data: [] });
    setMeta(metaRes || { categories: [], tags: [] });
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const refreshMeta = async () => {
    const token = getCookie("ramian-pakhsh-admin");
    const metaRes = await getArticleMeta(token);
    setMeta(metaRes || { categories: [], tags: [] });
    await loadAll();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <AdminPageShell
      title="مقالات"
      description="انتشار و ویرایش مقالات"
      actions={<AddArticleButton meta={meta} />}
    >
      <MetaManager meta={meta} onRefresh={refreshMeta} />
      <ArticlesList data={data} meta={meta} onRefresh={loadAll} />
    </AdminPageShell>
  );
}

export default Main;
