"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib";
import axios from "axios";
import { useIsAdmin } from "@/lib/useIsAdmin";
import type { Dictionary } from "@/app/i18n";

type Job = any;
type RateLimitPayload = {
  retryAfterSeconds?: number;
  resetAt?: number;
  serverTime?: number;
};

export function useUserJobs(dict: Dictionary) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #00ffdd; font-weight: bold;", ...args);
  };

  const { session } = useAuth();
  const [steamID, setSteamID] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [driver, setDriver] = useState<string | null>(null);
  const [driverName, setDriverName] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [rateLimitSecondsRemaining, setRateLimitSecondsRemaining] = useState<number | null>(null);

  const driverUsername = session?.user?.user_metadata?.username || session?.user?.email;
  const displayPage = lastPage - currentPage + 1;

  const fetchMembers = async () => {
    const res = await axios.get('/api/members');
    if (res.status !== 200) throw new Error(dict.errors.members.FAILED_TO_FETCH_MEMBERS);
    const data = res.data;
    return data.members || data || [];
  };

  const ensureSteamID = async (): Promise<string> => {
    if (steamID) return steamID;
    const members = await fetchMembers();
    const driver = members.find((d: any) => d.username === driverUsername);
    const DRIVER_NOT_FOUND = dict.errors.jobs.DRIVER_NOT_FOUND.replace("{driver}", driverUsername);
    if (!driver) {
      setError(DRIVER_NOT_FOUND);
      throw new Error(DRIVER_NOT_FOUND);
    }
    setDriver(driver);
    setSteamID(driver.steamID);
    return driver.steamID;
  };

  const fetchJobsPage = async (page: number) => {
    const sid = await ensureSteamID();
    try {
      const res = await axios.post('/api/jobs', { steamID: sid, page });
      if (res.status !== 200) throw new Error(dict.errors.jobs.FAILED_TO_FETCH_JOBS, { cause: res.status });
      const data = res.data;
      return data;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.jobs.FAILED_TO_FETCH_JOBS;
      const rateLimit = err?.response?.data?.rateLimit as RateLimitPayload | undefined;

      throw {
        message,
        rateLimit,
      };
    }
  };

  const clearRateLimitCountdown = () => {
    setIsRateLimited(false);
    setRateLimitResetAt(null);
    setRateLimitSecondsRemaining(null);
  };

  const handleJobsError = (err: any) => {
    const message = err?.response?.data?.message || err?.message || dict.errors.jobs.FAILED_TO_FETCH_JOBS;
    setError(message);

    const rateLimit = err?.rateLimit as RateLimitPayload | undefined;
    if (rateLimit?.resetAt) {
      const initialSeconds = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));
      setIsRateLimited(true);
      setRateLimitResetAt(rateLimit.resetAt);
      setRateLimitSecondsRemaining(initialSeconds);
      return;
    }

    clearRateLimitCountdown();
  };

  const parseLastPage = (lastUrl: string | undefined): number => {
    if (!lastUrl) return 1;
    const m = lastUrl.match(/[?&]page=(\d+)/);
    return m ? parseInt(m[1], 10) : 1;
  };

  const fetchAllJobs = async (): Promise<Job[]> => {
    const sid = await ensureSteamID();
    const allJobs: Job[] = [];
    for (let page = 1; page <= lastPage; page++) {
      const payload = await fetchJobsPage(page);
      if (Array.isArray(payload.jobs.data)) {
        allJobs.push(...payload.jobs.data);
      }
    }
    return allJobs.reverse();
  };

  const loadJobs = async (displayPage: number) => {
    setLoading(true);
    setError(null);
    clearRateLimitCountdown();
    try {
      const apiPage = lastPage - displayPage + 1;
      const payload = await fetchJobsPage(apiPage);
      setJobs(Array.isArray(payload.jobs.data) ? payload.jobs.data.reverse() : []);
      setCurrentPage(apiPage);
    } catch (err: any) {
      handleJobsError(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowAll = async () => {
    if (!showAll) {
      setLoading(true);
      try {
        const all = await fetchAllJobs();
        setAllJobs(all);
        setShowAll(true);
      } catch (err: any) {
        handleJobsError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setShowAll(false);
      await loadJobs(1);
    }
  };

  useEffect(() => {
    if (!session || !driverUsername) return;

    let cancelled = false;

    const init = async () => {
      setLoading(true);
      setError(null);
      clearRateLimitCountdown();
      try {
        const page1 = await fetchJobsPage(1);
        const lp = parseLastPage(page1.jobs.links?.last);

        if (!cancelled) {
          setLastPage(lp);
          const lastPayload = lp === 1 ? page1 : await fetchJobsPage(lp);
          setJobs(Array.isArray(lastPayload.jobs.data) ? lastPayload.jobs.data.reverse() : []);
          setCurrentPage(lp);
        }
      } catch (err: any) {
        if (!cancelled) handleJobsError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [session, driverUsername]);

  useEffect(() => {
    if (!rateLimitResetAt) return;

    let intervalId: number;

    const tick = () => {
      const seconds = Math.max(0, Math.ceil((rateLimitResetAt - Date.now()) / 1000));
      setRateLimitSecondsRemaining(seconds);

      if (seconds <= 0) {
        window.clearInterval(intervalId);
      }
    };

    tick();
    intervalId = window.setInterval(tick, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [rateLimitResetAt]);

  const retryJobs = () => {
    loadJobs(displayPage);
  };

  return {
    jobs: showAll ? allJobs : jobs,
    driver,
    driverName,
    loading,
    error,
    isRateLimited,
    rateLimitSecondsRemaining,
    currentPage,
    displayPage,
    lastPage,
    showAll,
    toggleShowAll,
    goToPage: (page: number) => loadJobs(page),
    goToNextPage: () => loadJobs(displayPage + 1),
    goToPreviousPage: () => loadJobs(displayPage - 1),
    retryJobs,
  };
}
