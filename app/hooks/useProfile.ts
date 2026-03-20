"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib";
import { usePathname, useRouter } from "next/navigation";

export interface Profile {
  id: string;
  bio: string | null;
  profile_url?: string | null;
  banner_url?: string | null;
}

export interface TeamMember {
  id: number;
  name: string;
  profile_url?: string | null;
}

export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  code: string;
}

export interface MemberRole {
  team_member_id: number;
  department: Department;
  role: Role;
}

export function useProfile(userId: string) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #008cff; font-weight: bold;", ...args);
  };

  const { session, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [profile, setProfile] = useState<Profile | null>(null);
  const [fetchedProfile, setFetchedProfile] = useState<any | null>(null);
  const [steamID, setSteamID] = useState<string | null>(null);
  const [driver, setDriver] = useState<any | null>(null);
  const [countryData, setCountryData] = useState<any | null>(null);

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);

  const fetchProfile = async () => {
    setError(null);
    try {
      const res = await axios.get(`/api/profile-picture?id=${encodeURIComponent(userId)}`);
      const json = await res.data;
      if (res.status === 200) return json.profile;
      else throw new Error(json.error || "Failed to fetch profile");
    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
      console.error(err);
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

  const getDriverData = async () => {
    const drivers = await fetchDrivers();
    const fetchedProfileData = await fetchProfileById();
    const driverUsername = fetchedProfileData.user.user_metadata.username || fetchedProfileData.user.email;
    const driver = drivers.find((d: any) => d.username === driverUsername);
    return driver;
  };

  const ensureSteamID = async () => {
    if (steamID) return steamID;
    const driverData = await getDriverData();
    if (!driverData) {
      setSteamID(null);
      setError("Driver not found");
      throw new Error("Driver not found");
    }
    setSteamID(driverData.steamID);
  };

  const getCountryData = async (driver: any) => {
    setLoading(true);
    setError(null);
    if (!driver) {
      setCountryData(null);
      setError("Driver not found");
      return null;
    } else if (!driver.country) {
      setCountryData(null);
      setError("Driver country not specified");
      return null;
    }
    try {
      if (driver.country === "World") {
        return {
          flags: {
            alt: `The flag of the World is composed of the first stage to the flower of life (seven joined white rings of the same radius, with the six outer rings drawn around the first ring spaced exactly one radian apart). And is placed on a dark blue background, which represents water, the essential of the planet's life, and the oceans, which cover most of the surface of Earth.`,
            png: "/assets/images/flags/world.png",
            svg: "/assets/images/flags/world.svg",
          },
        };
      }
      const res = await axios.get(`https://restcountries.com/v3.1/name/${driver.country}`);
      if (res.status !== 200) throw new Error("Failed to fetch country data");
      const data = await res.data;
      if (!data || data.length === 0) throw new Error("Country not found");
      return data[0];
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/team/members");
      const json = await res.data;
      if (res.status === 200) setMembers(json.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    const res = await axios.get("/api/departments");
    const json = await res.data;
    if (res.status == 200) setDepartments(json.data || []);
  };

  const fetchRoles = async () => {
    const res = await axios.get("/api/roles");
    const json = await res.data;
    if (res.status === 200) setRoles(json.data || []);
  };

  const fetchMemberRoles = async (memberId: number) => {
    setLoadingRoles(true);
    try {
      const res = await axios.get(`/api/team/roles?memberId=${memberId}`);
      const json = await res.data;
      if (res.status === 200) setMemberRoles(json.data || []);
    } finally {
      setLoadingRoles(false);
    }
  };

  const updateProfile = async (displayName: string, file?: File | null) => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (file && !displayName) {
        const fd = new FormData();
        fd.append("userId", userId);
        fd.append("file", file);

        const res = await axios.put("/api/profile-picture", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status !== 200) throw new Error("Failed to update profile");
        setSuccess("Profile updated successfully");
        fetchProfile();
        fetchProfileById();
      } else {
        const fd = new FormData();
        fd.append("userId", userId);
        fd.append("displayName", displayName);

        const res = await axios.put("/api/profile", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status !== 200) throw new Error("Failed to update profile");
        setSuccess("Profile updated successfully");
        fetchProfile();
        fetchProfileById();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
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
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userId || userId.trim() === "") {
      return;
    }

    const init = async () => {
      if (isAdmin) adminLog("Init started for ID:", userId);
      setLoading(true);
      setError(null);
      try {
        const profileData = await fetchProfile();
        setProfile(profileData);
        const fetchedProfileData = await fetchProfileById();
        setFetchedProfile(fetchedProfileData);
        const driverData = await getDriverData();
        setDriver(driverData);
        const countryData = await getCountryData(driverData);
        setCountryData(countryData);
        await fetchMembers();
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();

    // eslint-disable-next-line
  }, [userId, isAdmin]);

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
    countryData,
    members,
    departments,
    roles,
    memberRoles,
    loadingRoles,
  };
}
