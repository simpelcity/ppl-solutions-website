"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";

type Job = any;

interface stats {
  hours: number;
  minutes: number;
  thp: thp;
  income: income;
  distance: distance;
  ets2: GameStats;
  ats: GameStats;
  total: GameStats;
}

interface thp {
  thp: number;
  avg: number;
  min: number;
  max: number;
}

interface income {
  income: number;
  avg: number;
  min: number;
  max: number;
}

interface distance {
  distance: number;
  avg: number;
  min: number;
  max: number;
}

interface source {
  city: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
}

interface destination {
  city: {
    id: string;
    name: string;
  };
  company: {
    id: string;
    name: string;
  };
}

interface job {
  jobID: number;
  game: {
    id: string;
  };
}

interface distanceStats {
  distance: number;
  // avg: number;
}

interface GameStats {
  jobs: number;
  // mass: number;
  distance: distanceStats;
  truck: string;
  cargo: string;
  // source: source;
  // destination: destination;
}

export function useUserStats() {
  const { session } = useAuth();
  const [steamID, setSteamID] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState();
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const driverUsername = session?.user?.user_metadata?.username || session?.user?.email;

  const fetchMembers = async () => {
    const res = await fetch("/api/members");
    if (!res.ok) throw new Error("Failed to fetch members");
    const data = await res.json();
    return data.data || data || [];
  };

  const ensureSteamID = async (): Promise<string> => {
    if (steamID) return steamID;
    const members = await fetchMembers();
    const driver = members.find((d: any) => d.username === driverUsername);
    if (!driver) throw new Error(`Driver ${driverUsername} not found`);
    setSteamID(driver.steamID);
    return driver.steamID;
  };

  const fetchScenarios = async () => {
    const sid = await ensureSteamID();
    const res = await fetch("/api/scenarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steamID: sid }),
    });
    if (!res.ok) throw new Error(`Failed to fetch ${driverUsername}'s scenarios`);
    const data = await res.json();
    return data;
  };

  const fetchStatistics = async () => {
    const sid = await ensureSteamID();
    const response = await fetch("/api/statistics/user", {
      method: "POST",
      body: JSON.stringify({ steamID: sid }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch statistics");
    }
    const data = await response.json();
    console.log("raw statistics data:", data);
    return data.data;
  };

  const convertTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / 60000);
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    };
  };

  const kmToMiles = (km: number) => {
    return km * 0.621371;
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

  const getStatistics = async () => {
    const jobs = await fetchStatistics();
    console.log(
      "most frequent item:",
      mostFrequent(jobs.map((job: any) => job.truck.name + " " + job.truck.model.name)),
    );

    let time = 0;
    let thp = 0;
    let thpArray: any = [];
    let income = 0;
    let incomeArray: any = [];
    let distance = 0;
    let distanceArray: any = [];

    let ets2Jobs = 0;
    let ets2mass = 0;
    let ets2Distance = 0;
    let ets2Truck: any = null;
    let ets2Cargo: any = null;
    let ets2Source: source | null = null;
    let ets2Destination: destination | null = null;

    let atsJobs = 0;
    let atsMass = 0;
    let atsDistance = 0;
    let atsTruck: any = null;
    let atsCargo: any = null;
    let atsSource: source | null = null;
    let atsDestination: destination | null = null;

    let totalJobs = 0;
    let totalMass = 0;
    let totalDistance = 0;
    let totalCargo: any = null;
    let totalTruck: any = null;
    let totalSource: source | null = null;
    let totalDestination: destination | null = null;

    for (const job of jobs) {
      if (job.realtime?.actualTimeDriven) {
        time += job.realtime.actualTimeDriven;
      }
      if (job.THP) {
        thp += job.THP;
        if (Array.isArray(thpArray)) {
          thpArray.push(job.THP);
        }
      }

      if (job.income) {
        income += job.income;
        if (Array.isArray(incomeArray)) {
          incomeArray.push(job.income);
        }
      }

      if (job.distanceDriven) {
        distance += job.distanceDriven;
        if (Array.isArray(distanceArray)) {
          distanceArray.push(job.distanceDriven);
        }
      }

      const isETS2 = job.game.id === "ets2";
      const isATS = job.game.id === "ats";

      if (job.jobID) {
        totalJobs += 1;
        if (isETS2) ets2Jobs += 1;
        if (isATS) atsJobs += 1;
      }

      if (job.distanceDriven) {
        totalDistance += job.distanceDriven;
        if (isETS2) ets2Distance += job.distanceDriven;
        if (isATS) atsDistance += job.distanceDriven;
      }

      if (job.truck.name && job.truck.model.name) {
        const truckName = mostFrequent(jobs.map((job: any) => job.truck.name + " " + job.truck.model.name));
        if (isETS2) ets2Truck = truckName;
        if (isATS) atsTruck = truckName;
        totalTruck = truckName;
      }

      if (job.cargo.name) {
        const cargoName = mostFrequent(jobs.map((job: any) => job.cargo.name));
        if (isETS2) ets2Cargo = cargoName;
        if (isATS) atsCargo = cargoName;
        totalCargo = cargoName;
      }
    }

    const avgThp = thp / jobs.length;
    const minThp = Math.min(...thpArray);
    const maxThp = Math.max(...thpArray);

    const avgIncome = income / jobs.length;
    const minIncome = Math.min(...incomeArray);
    const maxIncome = Math.max(...incomeArray);

    const avgDistance = distance / jobs.length;
    const minDistance = Math.min(...distanceArray);
    const maxDistance = Math.max(...distanceArray);

    const timeFormatted = convertTime(time);

    return {
      hours: timeFormatted.hours,
      minutes: timeFormatted.minutes,
      thp: {
        thp: thp,
        avg: avgThp,
        min: minThp,
        max: maxThp,
      },
      income: {
        income: income,
        avg: avgIncome,
        min: minIncome,
        max: maxIncome,
      },
      distance: {
        distance: distance,
        avg: avgDistance,
        min: minDistance,
        max: maxDistance,
      },
      ets2: {
        jobs: ets2Jobs,
        distance: {
          distance: ets2Distance,
        },
        truck: ets2Truck,
        cargo: ets2Cargo,
      },
      ats: {
        jobs: atsJobs,
        distance: {
          distance: kmToMiles(atsDistance),
        },
        truck: atsTruck,
        cargo: atsCargo,
      },
      total: {
        jobs: totalJobs,
        distance: {
          distance: totalDistance,
        },
        truck: totalTruck,
        cargo: totalCargo,
      },
    };
  };

  useEffect(() => {
    if (!session || !driverUsername) return;

    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const statistics = await getStatistics();
        setStats(statistics);
        console.log(statistics);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [session]);

  return { stats, loading, error };
}
