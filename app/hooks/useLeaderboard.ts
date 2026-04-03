"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useLang } from "@/hooks/useLang";
import type { Dictionary } from "@/app/i18n";

interface LeaderboardEntry {
  username: string;
  value: number;
  avatar?: string;
}

interface CurrentLeaderboard {
  name: string;
  entries: LeaderboardEntry[];
}

export function useLeaderboard(
  dict: Dictionary,
  selectedPeriod: "all-time" | "monthly" = "all-time",
  selectedYear?: number,
  selectedMonth?: number
) {
  const lang = useLang();
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allTimeDistanceLeaderboard, setAllTimeDistanceLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyDistanceLeaderboard, setMonthlyDistanceLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeThpLeaderboard, setAllTimeThpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyThpLeaderboard, setMonthlyThpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeMassLeaderboard, setAllTimeMassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyMassLeaderboard, setMonthlyMassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeMaxThpLeaderboard, setAllTimeMaxThpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyMaxThpLeaderboard, setMonthlyMaxThpLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeMaxDistanceLeaderboard, setAllTimeMaxDistanceLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyMaxDistanceLeaderboard, setMonthlyMaxDistanceLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [allTimeMaxMassLeaderboard, setAllTimeMaxMassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyMaxMassLeaderboard, setMonthlyMaxMassLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentLeaderboard, setCurrentLeaderboard] = useState<CurrentLeaderboard>({
    name: "allTimeDistanceLeaderboard",
    entries: [],
  });
  const [allTimeDataLoaded, setAllTimeDataLoaded] = useState<boolean>(false);

  const fetchStatistics = async (month?: number, year?: number) => {
    let url = `/api/statistics`;
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}&lang=${lang}`;
    }
    const res = await axios.get(url);
    if (res.status !== 200) throw new Error(dict.errors.userStats.FAILED_TO_FETCH_STATS, { cause: res.status });
    return res.data?.jobs || res.data || [];
  };

  const getDistanceLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
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

  const getMaxThpLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
    const maxes = new Map<string, { value: number; avatar?: string }>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const thp = job?.THP;
      const avatar = job?.driver?.avatar;

      if (!username || typeof thp !== "number") continue;
      const entry = maxes.get(username) || { value: 0, avatar };
      if (!entry.avatar && avatar) entry.avatar = avatar;
      if (thp > entry.value) entry.value = thp;
      maxes.set(username, entry);
    }

    return Array.from(maxes.entries())
      .map(([username, { value, avatar }]) => ({ username, value, avatar }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  const getMaxDistanceLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
    const maxes = new Map<string, { value: number; avatar?: string }>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const distance = job?.distanceDriven;
      const avatar = job?.driver?.avatar;

      if (!username || typeof distance !== "number") continue;
      const entry = maxes.get(username) || { value: 0, avatar };
      if (!entry.avatar && avatar) entry.avatar = avatar;
      if (distance > entry.value) entry.value = distance;
      maxes.set(username, entry);
    }

    return Array.from(maxes.entries())
      .map(([username, { value, avatar }]) => ({ username, value, avatar }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  const getMaxMassLeaderboard = (jobs: any[], limit: number = 10): LeaderboardEntry[] => {
    const maxes = new Map<string, { value: number; avatar?: string }>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const mass = job?.cargo?.mass;
      const avatar = job?.driver?.avatar;

      if (!username || typeof mass !== "number") continue;
      const entry = maxes.get(username) || { value: 0, avatar };
      if (!entry.avatar && avatar) entry.avatar = avatar;
      if (mass > entry.value) entry.value = mass;
      maxes.set(username, entry);
    }

    return Array.from(maxes.entries())
      .map(([username, { value, avatar }]) => ({ username, value, avatar }))
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  };

  useEffect(() => {
    if (allTimeDataLoaded) return;

    const loadAllTimeData = async () => {
      setLoading(true);
      setError(null);

      try {
        const allTimeStatistics = await fetchStatistics();

        const allTimeLeaderboard = getDistanceLeaderboard(allTimeStatistics ?? []);
        setAllTimeDistanceLeaderboard(allTimeLeaderboard);

        const allTimeThpLeaderboard = getThpLeaderboard(allTimeStatistics ?? []);
        setAllTimeThpLeaderboard(allTimeThpLeaderboard);

        const allTimeMassLeaderboard = getMassLeaderboard(allTimeStatistics ?? []);
        setAllTimeMassLeaderboard(allTimeMassLeaderboard);

        const allTimeMaxThpLeaderboard = getMaxThpLeaderboard(allTimeStatistics ?? []);
        setAllTimeMaxThpLeaderboard(allTimeMaxThpLeaderboard);

        const allTimeMaxDistanceLeaderboard = getMaxDistanceLeaderboard(allTimeStatistics ?? []);
        setAllTimeMaxDistanceLeaderboard(allTimeMaxDistanceLeaderboard);

        const allTimeMaxMassLeaderboard = getMaxMassLeaderboard(allTimeStatistics ?? []);
        setAllTimeMaxMassLeaderboard(allTimeMaxMassLeaderboard);

        setCurrentLeaderboard({ name: "allTimeDistanceLeaderboard", entries: allTimeLeaderboard });
        setAllTimeDataLoaded(true);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadAllTimeData();
  }, [allTimeDataLoaded]);

  useEffect(() => {
    if (!allTimeDataLoaded) return;

    const loadMonthlyData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (selectedPeriod === "monthly" && selectedYear !== undefined && selectedMonth !== undefined) {
          const monthlyStatistics = await fetchStatistics(selectedMonth, selectedYear);

          const monthlyLeaderboard = getDistanceLeaderboard(monthlyStatistics ?? []);
          setMonthlyDistanceLeaderboard(monthlyLeaderboard);

          const monthlyThpLeaderboard = getThpLeaderboard(monthlyStatistics ?? []);
          setMonthlyThpLeaderboard(monthlyThpLeaderboard);

          const monthlyMassLeaderboard = getMassLeaderboard(monthlyStatistics ?? []);
          setMonthlyMassLeaderboard(monthlyMassLeaderboard);

          const monthlyMaxThpLeaderboard = getMaxThpLeaderboard(monthlyStatistics ?? []);
          setMonthlyMaxThpLeaderboard(monthlyMaxThpLeaderboard);

          const monthlyMaxDistanceLeaderboard = getMaxDistanceLeaderboard(monthlyStatistics ?? []);
          setMonthlyMaxDistanceLeaderboard(monthlyMaxDistanceLeaderboard);

          const monthlyMaxMassLeaderboard = getMaxMassLeaderboard(monthlyStatistics ?? []);
          setMonthlyMaxMassLeaderboard(monthlyMaxMassLeaderboard);

          setCurrentLeaderboard({ name: "monthlyDistanceLeaderboard", entries: monthlyLeaderboard });
        } else if (selectedPeriod === "all-time") {
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMonthlyData();
  }, [selectedPeriod, selectedYear, selectedMonth, allTimeDataLoaded]);

  useEffect(() => {
    if (selectedPeriod === "all-time") {
      setCurrentLeaderboard({
        name: "allTimeDistanceLeaderboard",
        entries: allTimeDistanceLeaderboard,
      });
    } else {
      setCurrentLeaderboard({
        name: "monthlyDistanceLeaderboard",
        entries: monthlyDistanceLeaderboard,
      });
    }
  }, [selectedPeriod, allTimeDistanceLeaderboard, monthlyDistanceLeaderboard]);

  return {
    loading,
    error,
    allTimeDistanceLeaderboard,
    monthlyDistanceLeaderboard,
    allTimeThpLeaderboard,
    monthlyThpLeaderboard,
    allTimeMassLeaderboard,
    monthlyMassLeaderboard,
    allTimeMaxThpLeaderboard,
    monthlyMaxThpLeaderboard,
    allTimeMaxDistanceLeaderboard,
    monthlyMaxDistanceLeaderboard,
    allTimeMaxMassLeaderboard,
    monthlyMaxMassLeaderboard,
    currentLeaderboard,
  };
}
