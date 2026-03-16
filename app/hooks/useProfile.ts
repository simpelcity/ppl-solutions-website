"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface Profile {
  id: string;
  name: string;
  profile_url?: string | null;
  banner?: string | null;
}

export function useProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetchedProfile, setFetchedProfile] = useState<any | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setError("No userId provided");
      setLoading(false);
      return;
    }
    fetchProfileById();
    fetchProfile();
    // eslint-disable-next-line
  }, [userId]);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/profile-picture?id=${encodeURIComponent(userId)}`);
      const json = await res.data;
      if (res.status === 200) setProfile(json.profile || null);
      else throw new Error(json.error || "Failed to fetch profile");
    } catch (e: any) {
      setError(e.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileById = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await axios.get(`/api/profile?id=${encodeURIComponent(userId)}`);
      const json = await data.data;
      if (data.status === 200) setFetchedProfile(json.data || null);
      console.log("fetchedProfile", json);
    } catch (err: any) {
      setError(err.message);
      setFetchedProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (file?: File | null) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("userId", userId);
      if (file) fd.append("file", file);

      const res = await axios.put("/api/profile-picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error("Failed to update profile");
      setSuccess("Profile updated successfully");
      fetchProfile();
    } catch (e: any) {
      setError("Failed to update profile");
    } finally {
      setSubmitting(false);
    }
  };

  const createProfile = async (file?: File | null) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("userId", userId);
      if (file) fd.append("file", file);
      const res = await axios.post("/api/profile-picture", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error(res.data?.error || "Failed to create profile");
      setSuccess("Profile created successfully");
      fetchProfile();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    profile,
    loading,
    error,
    success,
    submitting,
    updateProfile,
    createProfile,
    fetchedProfile,
  };
}
