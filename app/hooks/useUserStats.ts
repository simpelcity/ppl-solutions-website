"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib";
import axios from "axios";
import { useIsAdmin } from "@/lib/useIsAdmin";
import type { Dictionary } from "@/app/i18n";
import { useLang } from '@/hooks/useLang'

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
  city: string;
  company: string;
}

interface destination {
  city: string;
  company: string;
}

interface distanceStats {
  distance: number;
  avg: number;
  max: number;
}

interface GameStats {
  jobs: number;
  mass: number;
  distance: distanceStats;
  truck: string;
  cargo: string;
  source?: source;
  destination?: destination;
}

export function useUserStats(dict: Dictionary) {
  const lang = useLang();
  const { session } = useAuth();
  const isAdmin = useIsAdmin();
  const [steamID, setSteamID] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState();
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<stats | null | undefined>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const driverUsername = session?.user?.user_metadata?.username || session?.user?.email;

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #9900ff; font-weight: bold;", ...args);
  };

  const fetchMembers = async () => {
    const res = await axios.get(`/api/members?lang=${lang}`);
    if (res.status !== 200) throw new Error(dict.errors.drivers.FAILED_TO_FETCH_DRIVERS, { cause: res.status });
    const data = res.data;
    return data.members || data || [];
  };

  const ensureSteamID = async (): Promise<string> => {
    if (steamID) return steamID;
    const members = await fetchMembers();
    const driver = members.find((d: any) => d.username === driverUsername);
    const DRIVER_NOT_FOUND = dict.errors.jobs.DRIVER_NOT_FOUND.replace("{driver}", driverUsername);
    if (!driver) throw new Error(DRIVER_NOT_FOUND, { cause: driver });
    setSteamID(driver.steamID);
    return driver.steamID;
  };

  const fetchScenarios = async () => {
    const sid = await ensureSteamID();
    const res = await axios.post(`/api/scenarios?lang=${lang}`, { steamID: sid });
    if (res.status !== 200) throw new Error(dict.errors.userStats.FAILED_TO_FETCH_SCENARIOS, { cause: res.status });
    return res.data;
  };

  const fetchStatistics = async () => {
    const sid = await ensureSteamID();
    try {
      const res = await axios.post(`/api/statistics/user?lang=${lang}`, { steamID: sid });
      if (res.status !== 200) throw new Error(dict.errors.userStats.FAILED_TO_FETCH_STATS, { cause: res.status });
      const data = res.data;
      return data.jobs;
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || dict.errors.userStats.FAILED_TO_FETCH_STATS;
      setError(message);
      throw new Error(message);
    }
  };

  const convertTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / 60000);
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    };
  };

  const kmToMiles = (km: number) => { return km * 0.621371 };

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

  const mostFrequentItem = <T>(arr: T[], keyFn: (item: T) => string): { item: T | null; count: number } => {
    const freq: { [key: string]: { item: T; count: number } } = {};
    arr.forEach((item) => {
      const key = keyFn(item);
      if (!freq[key]) freq[key] = { item, count: 0 };
      freq[key].count++;
    });
    let max = 0;
    let most: T | null = null;
    for (const k in freq) {
      if (freq[k].count > max) {
        max = freq[k].count;
        most = freq[k].item;
      }
    }

    return { item: most, count: max };
  };

  const getStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const jobs = await fetchStatistics();

      let time = 0;
      let thp = 0;
      let thpArray: any = [];
      let income = 0;
      let incomeArray: any = [];
      let distance = 0;
      let distanceArray: any = [];

      let ets2Jobs = 0;
      let ets2Mass = 0;
      let ets2Distance = 0;
      let ets2DistanceArray: any = [];
      let ets2Truck: any = null;
      let ets2Cargo: any = null;
      let ets2Source: source | undefined = undefined;
      let ets2Destination: destination | undefined = undefined;
      let ets2Sources: any[] = [];
      let ets2Destinations: any[] = [];

      let atsJobs = 0;
      let atsMass = 0;
      let atsDistance = 0;
      let atsDistanceArray: any = [];
      let atsTruck: any = null;
      let atsCargo: any = null;
      let atsSource: source | undefined = undefined;
      let atsDestination: destination | undefined = undefined;
      let atsSources: any[] = [];
      let atsDestinations: any[] = [];

      let totalJobs = 0;
      let totalMass = 0;
      let totalDistance = 0;
      let totalDistanceArray: any = [];
      let totalCargo: any = null;
      let totalTruck: any = null;
      let totalSource: source | undefined = undefined;
      let totalDestination: destination | undefined = undefined;
      let totalSources: any[] = [];
      let totalDestinations: any[] = [];

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

        if (job.distanceDriven) {
          if (Array.isArray(totalDistanceArray)) {
            totalDistanceArray.push(job.distanceDriven);
          }

          if (isETS2) {
            if (Array.isArray(ets2DistanceArray)) {
              ets2DistanceArray.push(job.distanceDriven);
            }
          }

          if (isATS) {
            if (Array.isArray(atsDistanceArray)) {
              atsDistanceArray.push(job.distanceDriven);
            }
          }
        }

        if (job.truck.name && job.truck.model.name) {
          const truckName = mostFrequent(jobs.map((job: any) => job.truck.name + " " + job.truck.model.name));
          if (isETS2) ets2Truck = truckName;
          if (isATS) atsTruck = truckName;
          totalTruck = truckName;
        }

        if (job.source) {
          if (Array.isArray(totalSources)) {
            totalSources.push(job.source);
          }

          if (Array.isArray(ets2Sources)) {
            if (isETS2) ets2Sources.push(job.source);
          }

          if (Array.isArray(atsSources)) {
            if (isATS) atsSources.push(job.source);
          }
        }

        if (job.destination) {
          if (Array.isArray(totalDestinations)) {
            totalDestinations.push(job.destination);
          }

          if (Array.isArray(ets2Destinations)) {
            if (isETS2) ets2Destinations.push(job.destination);
          }

          if (Array.isArray(atsDestinations)) {
            if (isATS) atsDestinations.push(job.destination);
          }
        }

        if (job.cargo.name) {
          const cargoName = mostFrequent(jobs.map((job: any) => job.cargo.name));
          if (isETS2) ets2Cargo = cargoName;
          if (isATS) atsCargo = cargoName;
          totalCargo = cargoName;
        }

        if (job.cargo.mass) {
          totalMass += job.cargo.mass;
          if (isETS2) ets2Mass += job.cargo.mass;
          if (isATS) atsMass += job.cargo.mass;
        }
      }

      const ets2StartCity = mostFrequent(ets2Sources.map((item: any) => item.city.name));
      const ets2StartCompany = mostFrequent(ets2Sources.map((item: any) => item.company.name));
      if (ets2StartCity && ets2StartCompany) {
        ets2Source = { city: ets2StartCity, company: ets2StartCompany };
      }

      const atsStartCity = mostFrequent(atsSources.map((item: any) => item.city.name));
      const atsStartCompany = mostFrequent(atsSources.map((item: any) => item.company.name));
      if (atsStartCity && atsStartCompany) {
        atsSource = { city: atsStartCity, company: atsStartCompany };
      }

      const totalStartCity = mostFrequent(totalSources.map((item: any) => item.city.name));
      const totalStartCompany = mostFrequent(totalSources.map((item: any) => item.company.name));
      if (totalStartCity && totalStartCompany) {
        totalSource = { city: totalStartCity, company: totalStartCompany };
      }

      const ets2DestinationCity = mostFrequent(ets2Destinations.map((s) => s.city.name));
      const ets2DestinationCompany = mostFrequent(ets2Destinations.map((s) => s.company.name));
      if (ets2DestinationCity && ets2DestinationCompany) {
        ets2Destination = { city: ets2DestinationCity, company: ets2DestinationCompany };
      }

      const atsDestinationCity = mostFrequent(atsDestinations.map((s) => s.city.name));
      const atsDestinationCompany = mostFrequent(atsDestinations.map((s) => s.company.name));
      if (atsDestinationCity && atsDestinationCompany) {
        atsDestination = { city: atsDestinationCity, company: atsDestinationCompany };
      }

      const totalDestinationCity = mostFrequent(totalDestinations.map((s) => s.city.name));
      const totalDestinationCompany = mostFrequent(totalDestinations.map((s) => s.company.name));
      if (totalDestinationCity && totalDestinationCompany) {
        totalDestination = { city: totalDestinationCity, company: totalDestinationCompany };
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

      const totalAvgDistance = totalDistance / jobs.length;
      const ets2AvgDistance = ets2Distance / jobs.length;
      const atsAvgDistance = atsDistance / jobs.length;

      let totalMaxDistance = Math.max(...totalDistanceArray);
      if (totalMaxDistance === -Infinity) {
        totalMaxDistance = 0;
      } else {
        totalMaxDistance;
      }

      let ets2MaxDistance = Math.max(...ets2DistanceArray);
      if (ets2MaxDistance === -Infinity) {
        ets2MaxDistance = 0;
      } else {
        ets2MaxDistance;
      }

      let atsMaxDistance = Math.max(...atsDistanceArray);
      if (atsMaxDistance === -Infinity) {
        atsMaxDistance = 0;
      } else {
        atsMaxDistance;
      }

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
            avg: ets2AvgDistance,
            max: ets2MaxDistance,
          },
          truck: ets2Truck,
          cargo: ets2Cargo,
          mass: ets2Mass,
          source: ets2Source,
          destination: ets2Destination,
        },
        ats: {
          jobs: atsJobs,
          distance: {
            distance: kmToMiles(atsDistance),
            avg: kmToMiles(atsAvgDistance),
            max: kmToMiles(atsMaxDistance),
          },
          truck: atsTruck,
          cargo: atsCargo,
          mass: atsMass,
          source: atsSource,
          destination: atsDestination,
        },
        total: {
          jobs: totalJobs,
          distance: {
            distance: totalDistance,
            avg: totalAvgDistance,
            max: totalMaxDistance,
          },
          truck: totalTruck,
          cargo: totalCargo,
          mass: totalMass,
          source: totalSource,
          destination: totalDestination,
        },
      };
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !driverUsername) return;

    const loadStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const statistics = await getStatistics();
        setStats(statistics);
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
