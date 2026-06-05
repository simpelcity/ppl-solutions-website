"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import type { Dictionary } from "@/app/i18n";
import { parseApiError, useRateLimitState } from "@/hooks/useRateLimitState";

export interface GalleryItem {
  id: number;
  title: string | null;
  image_url: string | null;
  image_path: string | null;
}

export function useGallery(dict: Dictionary) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isRateLimited, rateLimitSecondsRemaining, clearRateLimitCountdown, applyRateLimit } = useRateLimitState();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setError(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.get('/api/gallery');
      if (res.status !== 200) throw new Error(dict.errors.gallery.ERROR_LOADING_GALLERY, { cause: res.status });
      const data = res.data;
      setItems(data.gallery || []);
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.gallery.ERROR_LOADING_GALLERY);
      setError(parsed.message);
      setStatus(err.status || null);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  const createItem = async (title: string, file: File) => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("file", file);

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.post('/api/gallery', fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error(dict.errors.gallery.FAILED_TO_ADD_ITEM, { cause: res.status });
      setSuccess(dict.success.gallery.ITEM_ADDED);
      fetchItems();
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.gallery.FAILED_TO_ADD_ITEM);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
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
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.put('/api/gallery', fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error(dict.errors.gallery.FAILED_TO_UPDATE_ITEM, { cause: res.status });
      setSuccess(dict.success.gallery.ITEM_UPDATED);
      setEditingId(null);
      fetchItems();
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.gallery.FAILED_TO_UPDATE_ITEM);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (id: number) => {
    setError(null);
    setSuccess(null);
    clearRateLimitCountdown();

    try {
      const res = await axios.delete('/api/gallery', { data: { id } });
      if (res.status !== 200) throw new Error(dict.errors.gallery.FAILED_TO_DELETE_ITEM, { cause: res.status });
      setSuccess(dict.success.gallery.ITEM_DELETED);
      fetchItems();
    } catch (err: any) {
      const parsed = parseApiError(err, dict.errors.gallery.FAILED_TO_DELETE_ITEM);
      setError(parsed.message);
      applyRateLimit(parsed.rateLimit);
      throw new Error(parsed.message);
    }
  };

  return {
    items,
    loading,
    submitting,
    editingId,
    error,
    status,
    isRateLimited,
    rateLimitSecondsRemaining,
    success,
    setEditingId,
    createItem,
    updateItem,
    deleteItem,
    retryGallery: fetchItems,
  };
}
