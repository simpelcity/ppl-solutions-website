"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { useIsAdmin } from "@/lib/useIsAdmin";

export interface Profile {
  id: string;
  name: string;
  profile_url?: string | null;
  banner?: string | null;
}

export function useProfile(userId: string) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetchedProfile, setFetchedProfile] = useState<any | null>(null);
  const [steamID, setSteamID] = useState<string | null>(null);
  const [driver, setDriver] = useState<string | null>(null);
  const [driverName, setDriverName] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/profile-picture?id=${encodeURIComponent(userId)}`);
      const json = await res.data;
      if (res.status === 200) setProfile(json.profile);
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
      if (data.status === 200) return json.data;
    } catch (err: any) {
      setError(err.message);
      setFetchedProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    const res = await axios.get("/api/members");
    if (res.status !== 200) throw new Error("Failed to fetch drivers");
    const data = await res.data;
    return data.data || data || [];
  };

  const ensureSteamID = async (): Promise<string> => {
    if (steamID) return steamID;
    const drivers = await fetchDrivers();
    const fetchedProfile = await fetchProfileById();
    setFetchedProfile(fetchedProfile);
    const driverUsername = fetchedProfile.user.user_metadata.username || fetchedProfile.user.email;
    setDriverName(driverUsername);
    const driver = drivers.find((d: any) => d.username === driverUsername);
    setDriver(driver);
    if (!driver) {
      setDriver(null);
      setError(`Driver ${driverUsername} not found`);
      throw new Error(`Driver ${driverUsername} not found`);
    }
    return driver.steamID;
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

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setError("No userId provided");
      setLoading(false);
      return;
    }

    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchProfile();
        await fetchProfileById();
        const sid = await ensureSteamID();
        setSteamID(sid);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    // eslint-disable-next-line
  }, [userId]);

  return {
    profile,
    loading,
    error,
    success,
    submitting,
    updateProfile,
    createProfile,
    fetchedProfile,
    steamID,
    driver,
    driverName,
  };
}
