"use client";

import { useEffect, useState } from "react";

export interface GalleryItem {
  id: number;
  title: string | null;
  image_url: string | null;
  image_path: string | null;
}

export function useGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/gallery");
      const json = await res.json();
      if (res.ok) setItems(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (title: string, file: File) => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("file", file);

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/gallery", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed to add item");
      setSuccess("Gallery item added");
      fetchItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateItem = async (id: number, title: string, file?: File | null) => {
    const fd = new FormData();
    fd.append("id", id.toString());
    fd.append("title", title);
    if (file) fd.append("file", file);

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/gallery", { method: "PUT", body: fd });
      if (!res.ok) throw new Error("Failed to update");
      setSuccess("Gallery item updated");
      setEditingId(null);
      fetchItems();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (id: number) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setSuccess("Gallery item deleted");
      fetchItems();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return {
    items,
    loading,
    submitting,
    editingId,
    error,
    success,
    setEditingId,
    createItem,
    updateItem,
    deleteItem,
  };
}
