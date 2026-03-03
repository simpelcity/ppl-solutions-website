"use client";

import { useState, useEffect } from "react";
import axios from "axios";

interface topDistanceDriver {
  username: string;
  distance: number;
}

interface topThpDriver {
  username: string;
  thp: number;
}

interface topMassDriver {
  username: string;
  mass: number;
}

export function useLeaderboard() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [topDistanceDriver, setTopDistanceDriver] = useState<topDistanceDriver | null>(null);
  const [topThpDriver, setTopThpDriver] = useState<topThpDriver | null>(null);
  const [topMassDriver, setTopMassDriver] = useState<topMassDriver | null>(null);

  const fetchStatistics = async () => {
    const res = await axios.get("/api/statistics");
    if (res.status !== 200) {
      throw new Error("Failed to fetch statistics");
    }
    return res.data?.data;
  };

  const mostFrequent = (arr: string[]) => {
    const frequency: { [key: string]: number } = {};
    let maxFreq = 0;
    let mostFreqItem = "";
    arr.forEach((item) => {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
        mostFreqItem = item;
      }
    });
    return mostFreqItem + (maxFreq > 1 ? ` (${maxFreq})` : "");
  };

  const getTopDistanceDriver = (jobs: any[]) => {
    const totals = new Map<string, number>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const distance = job?.distanceDriven;

      if (!username || typeof distance !== "number") continue;
      totals.set(username, (totals.get(username) ?? 0) + distance);
    }

    if (totals.size === 0) return null;

    let bestUsername = "";
    let bestDistance = -Infinity;

    for (const [username, distance] of totals.entries()) {
      if (distance > bestDistance) {
        bestDistance = distance;
        bestUsername = username;
      }
    }

    return { username: bestUsername, distance: bestDistance };
  };

  const getTopThpDriver = (jobs: any[]) => {
    const totals = new Map<string, number>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const thp = job?.THP;

      if (!username || typeof thp !== "number") continue;
      totals.set(username, (totals.get(username) ?? 0) + thp);
    }

    if (totals.size === 0) return null;

    let bestUsername = "";
    let bestThp = -Infinity;

    for (const [username, thp] of totals.entries()) {
      if (thp > bestThp) {
        bestThp = thp;
        bestUsername = username;
      }
    }

    return { username: bestUsername, thp: bestThp };
  };

  const getTopMassDriver = (jobs: any[]) => {
    const totals = new Map<string, number>();

    for (const job of jobs) {
      const username = job?.driver?.username;
      const mass = job?.cargo?.mass;

      if (!username || typeof mass !== "number") continue;
      totals.set(username, (totals.get(username) ?? 0) + mass);
    }

    if (totals.size === 0) return null;

    let bestUsername = "";
    let bestMass = -Infinity;

    for (const [username, mass] of totals.entries()) {
      if (mass > bestMass) {
        bestMass = mass;
        bestUsername = username;
      }
    }

    return { username: bestUsername, mass: bestMass };
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const statistics = await fetchStatistics();
        // console.log(statistics);
        const topDistance = getTopDistanceDriver(statistics ?? []);
        setTopDistanceDriver(topDistance);
        // console.log(topDistance);
        const topThp = getTopThpDriver(statistics ?? []);
        setTopThpDriver(topThp);
        // console.log(topThp);
        const topMass = getTopMassDriver(statistics ?? []);
        setTopMassDriver(topMass);
        // console.log(topMass);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { loading, error, topDistanceDriver, topThpDriver, topMassDriver };
}
