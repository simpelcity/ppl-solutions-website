"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib";
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/app/i18n";
import { useLang } from "@/hooks/useLang";
import { type Locale } from "@/i18n";

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

type Props = {
  userId: string;
  dict: Dictionary;
};

export function useProfile({ userId, dict }: Props) {
  const lang = useLang();
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #008cff; font-weight: bold;", ...args);
  };

  const { session, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
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
  const [items, setItems] = useState<any[] | null>(null);

  async function fetchProfile() {
    setError(null);
    try {
      const res = await axios.get(`/api/profile-picture?id=${encodeURIComponent(userId)}&lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE, { cause: res.status });
      const data = res.data;
      return data.profile;
    } catch (err: any) {
      const message =
          err?.response?.data?.message || err?.message || dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchProfileById() {
    setError(null);
    try {
      const res = await axios.get(`/api/profile?id=${encodeURIComponent(userId)}&lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE_BY_ID, { cause: res.status });
      const data = res.data;
      return data.data;
    } catch (err: any) {
      const message =
          err?.response?.data?.message || err?.message || dict.errors.profile.profile.FAILED_TO_FETCH_PROFILE_BY_ID;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchDrivers() {
    try {
      const res = await axios.get(`/api/members?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.drivers.FAILED_TO_FETCH_DRIVERS, { cause: res.status });
      const data = res.data;
      return data.data || data || [];
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.drivers.FAILED_TO_FETCH_DRIVERS;
      setError(message);
      throw new Error(message);
    }
  };

  async function getDriverData() {
    try {
      const drivers = await fetchDrivers();
      const fetchedProfileData = await fetchProfileById();
      if (fetchedProfileData) {
        const driverUsername = fetchedProfileData.user.user_metadata.username || fetchedProfileData.user.email || "User";
        const driver = drivers.find((d: any) => d.username === driverUsername);
        return driver;
      } else {
        setError(dict.errors.drivers.DRIVER_NOT_FOUND);
        return null;
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.drivers.FAILED_TO_GET_DRIVER_DATA;
      setError(message);
      throw new Error(message);
    }
  };

  async function ensureSteamID() {
    try {
      if (steamID) return steamID;
      const driverData = await getDriverData();
      if (!driverData) {
        setSteamID(null);
        setError(dict.errors.drivers.DRIVER_NOT_FOUND);
        throw new Error(dict.errors.drivers.DRIVER_NOT_FOUND);
      }
      setSteamID(driverData.steamID);
      return driverData.steamID;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.profile.FAILED_TO_ENSURE_STEAMID;
      setError(message);
      throw new Error(message);
    }
  };

  async function getCountryData(driver: any) {
    try {
      setError(null);
      if (!driver) {
        setCountryData(null);
        setError(dict.errors.drivers.DRIVER_NOT_FOUND);
        return null;
      } else if (!driver.country) {
        setCountryData(null);
        setError(dict.errors.drivers.DRIVER_COUNTRY_NOT_SPECIFIED);
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
        if (res.status !== 200) throw new Error(dict.errors.country.FAILED_TO_FETCH_COUNTRY_DATA, { cause: res.status });
        const data = await res.data;
        if (!data || data.length === 0) throw new Error(dict.errors.country.COUNTRY_NOT_FOUND);
        return data[0];
      } catch (err: any) {
        console.error(err);
        setError(err.message);
        return null;
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.country.FAILED_TO_FETCH_COUNTRY_DATA;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchTeam(memberId: number) {
    try {
      const res = await axios.get(`/api/team?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_FETCH_TEAM, { cause: res.status });
      const data = res.data;
      const memberData = data.find((m: any) => m.team_member.id === memberId) || null;
      setItems(data ?? []);
      setMemberRoles([memberData]);
      return data || [];
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.team.FAILED_TO_FETCH_TEAM;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchMembers() {
    try {
      const res = await axios.get(`/api/team/members?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.members.FAILED_TO_FETCH_MEMBERS, { cause: res.status });
      const data = res.data;
      setMembers(data.data || []);
      return data.data || [];
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.members.FAILED_TO_FETCH_MEMBERS;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchDepartments() {
    try {
      const res = await axios.get(`/api/departments?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS, { cause: res.status });
      const data = res.data;
      setDepartments(data.data || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.team.FAILED_TO_FETCH_DEPARTMENTS;
      setError(message);
      throw new Error(message);
    }
  };

  async function fetchRoles() {
    try {
      const res = await axios.get(`/api/roles?lang=${lang}`);
      if (res.status !== 200) throw new Error(dict.errors.roles.FAILED_TO_FETCH_ROLES, { cause: res.status });
      const data = res.data;
      setRoles(data.data || []);
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.roles.FAILED_TO_FETCH_ROLES;
      setError(message);
      throw new Error(message);
    }
  };

  async function getMemberId() {
    try {
      const members = await fetchMembers();
      const fetchedProfileRes = await fetchProfileById();
      if (fetchedProfileRes) {
        const member = members.find((m: any) => m.name === fetchedProfileRes.user.user_metadata.username);
        if (member) {
          return member.id;
        } else {
          return null;
        }
      } else {
        setError(dict.errors.profile.profile.PROFILE_NOT_FOUND);
        return null;
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.members.FAILED_TO_GET_MEMBER_ID;
      setError(message);
      throw new Error(message);
    }
  };

  async function updateProfile(displayName: string, file?: File | null) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (file && !displayName) {
        const fd = new FormData();
        fd.append("userId", userId);
        fd.append("file", file);

        const res = await axios.put(`/api/profile-picture?lang=${lang}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status !== 200) throw new Error(dict.errors.profile.profile.FAILED_TO_UPDATE_PROFILE, { cause: res.status });
        setSuccess(dict.success.profile.PROFILE_UPDATED);
        fetchProfile();
        fetchProfileById();
      } else {
        const fd = new FormData();
        fd.append("userId", userId);
        fd.append("displayName", displayName);

        const res = await axios.put(`/api/profile?lang=${lang}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status !== 200) throw new Error(dict.errors.profile.profile.FAILED_TO_UPDATE_PROFILE, { cause: res.status });
        setSuccess(dict.success.profile.PROFILE_UPDATED);
        fetchProfile();
        fetchProfileById();
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.profile.profile.FAILED_TO_UPDATE_PROFILE;
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  async function createProfile(file?: File | null) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const fd = new FormData();
      fd.append("userId", userId);
      if (file) fd.append("file", file);
      const res = await axios.post(`/api/profile-picture?lang=${lang}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status !== 200) throw new Error(dict.errors.profile.profile.FAILED_TO_CREATE_PROFILE, { cause: res.status });
      setSuccess(dict.success.profile.PROFILE_CREATED);
      fetchProfile();
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.profile.profile.FAILED_TO_CREATE_PROFILE;
      setError(message);
      throw new Error(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!userId || userId.trim() === "") {
      return;
    }

    async function init() {
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
        await fetchDepartments();
        await fetchRoles();
        const id = await getMemberId();
        await fetchTeam(id);
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || dict.errors.UNEXPECTED;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    };

    init();
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
  };
}
