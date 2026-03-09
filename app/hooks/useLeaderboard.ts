"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useIsAdmin } from "@/lib/useIsAdmin";

interface LeaderboardEntry {
  username: string;
  value: number;
  avatar?: string;
}

export function useLeaderboard(
  selectedPeriod: "all-time" | "monthly" = "all-time",
  selectedYear?: number,
  selectedMonth?: number,
) {
  const isAdmin = useIsAdmin();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimeDistanceLeaderboard, setAllTimeDistanceLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyDistanceLeaderboard, setMonthlyDistanceLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeThpLeaderboard, setAllTimeThpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyThpLeaderboard, setMonthlyThpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeMassLeaderboard, setAllTimeMassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyMassLeaderboard, setMonthlyMassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentLeaderboard, setCurrentLeaderboard] = useState<LeaderboardEntry[]>([]);

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const fetchStatistics = async (month?: number, year?: number) => {
    let url = "/api/statistics";
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;
    }
    const res = await axios.get(url);
    if (res.status !== 200) {
      throw new Error("Failed to fetch statistics");
    }
    return res.data?.data;
  };

  const getDistanceLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
    // Map username to total distance and optional avatar
    const totals = new Map<string, { value: number; avatar?: string }>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const distance = job?.distanceDriven;
      const avatar = job?.driver?.avatar;

      if (!username || typeof distance !== "number") continue;
      const entry = totals.get(username) || { value: 0, avatar };
      if (!entry.avatar && avatar) entry.avatar = avatar;
      entry.value += distance;
      totals.set(username, entry);
    }

    return Array.from(totals.entries())
      .map(([username, { value, avatar }]) => ({ username, value, avatar }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  const getThpLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
    const totals = new Map<string, { value: number; avatar?: string }>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const thp = job?.THP;
      const avatar = job?.driver?.avatar;

      if (!username || typeof thp !== "number") continue;
      const entry = totals.get(username) || { value: 0, avatar };
      if (!entry.avatar && avatar) entry.avatar = avatar;
      entry.value += thp;
      totals.set(username, entry);
    }

    return Array.from(totals.entries())
      .map(([username, { value, avatar }]) => ({ username, value, avatar }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  const getMassLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
    const totals = new Map<string, { value: number; avatar?: string }>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const mass = job?.cargo?.mass;
      const avatar = job?.driver?.avatar;

      if (!username || typeof mass !== "number") continue;
      const entry = totals.get(username) || { value: 0, avatar };
      if (!entry.avatar && avatar) entry.avatar = avatar;
      entry.value += mass;
      totals.set(username, entry);
    }

    return Array.from(totals.entries())
      .map(([username, { value, avatar }]) => ({ username, value, avatar }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  const filterJobsByMonth = (jobs: any[], year: number, month: number) => {
    return jobs.filter((job) => {
      const jobDate = new Date(job?.createdAt);
      adminLog("jobDate:", jobDate);
      return jobDate.getFullYear() === year && jobDate.getMonth() === month;
    });
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all-time data (always needed for the top drivers cards)
        const allTimeStatistics = await fetchStatistics();

        // All-time distance leaderboard
        const allTimeLeaderboard = getDistanceLeaderboard(allTimeStatistics ?? []);
        setAllTimeDistanceLeaderboard(allTimeLeaderboard);

        // All-time THP leaderboard
        const allTimeThpLeaderboard = getThpLeaderboard(allTimeStatistics ?? []);
        setAllTimeThpLeaderboard(allTimeThpLeaderboard);

        // All-time Mass leaderboard
        const allTimeMassLeaderboard = getMassLeaderboard(allTimeStatistics ?? []);
        setAllTimeMassLeaderboard(allTimeMassLeaderboard);

        // Fetch monthly data if monthly period is selected
        let monthlyStatistics = allTimeStatistics;
        if (selectedPeriod === "monthly" && selectedYear !== undefined && selectedMonth !== undefined) {
          monthlyStatistics = await fetchStatistics(selectedMonth, selectedYear);
        }

        // Monthly distance leaderboard
        const monthlyJobs =
          selectedPeriod === "monthly" && selectedYear !== undefined && selectedMonth !== undefined
            ? (monthlyStatistics ?? [])
            : filterJobsByMonth(
                allTimeStatistics ?? [],
                selectedYear ?? new Date().getFullYear(),
                selectedMonth ?? new Date().getMonth(),
              );
        const monthlyLeaderboard = getDistanceLeaderboard(monthlyJobs);
        setMonthlyDistanceLeaderboard(monthlyLeaderboard);

        // Monthly THP leaderboard
        const monthlyThpLeaderboard = getThpLeaderboard(monthlyJobs);
        setMonthlyThpLeaderboard(monthlyThpLeaderboard);

        // Monthly Mass leaderboard
        const monthlyMassLeaderboard = getMassLeaderboard(monthlyJobs);
        setMonthlyMassLeaderboard(monthlyMassLeaderboard);

        adminLog("monthly jobs:", monthlyJobs);

        // Set current leaderboard based on selected period
        if (selectedPeriod === "all-time") {
          setCurrentLeaderboard(allTimeLeaderboard);
        } else {
          setCurrentLeaderboard(monthlyLeaderboard);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedPeriod, selectedYear, selectedMonth]);

  return {
    loading,
    error,
    allTimeDistanceLeaderboard,
    monthlyDistanceLeaderboard,
    allTimeThpLeaderboard,
    monthlyThpLeaderboard,
    allTimeMassLeaderboard,
    monthlyMassLeaderboard,
    currentLeaderboard,
  };
}
