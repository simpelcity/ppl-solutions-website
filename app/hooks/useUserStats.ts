'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/AuthContext'

type Job = any

interface stats {
  hours: number;
  minutes: number;
  thp: thp;
  income: income;
  distance: distance;
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

export function useUserStats() {
  const { session } = useAuth();
  const [steamID, setSteamID] = useState<string | null>(null);
  const [scenarios, setScenarios] = useState();
  const [lastPage, setLastPage] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<stats | null>(null)
  

  const driverUsername = session?.user?.user_metadata?.username || session?.user?.email;

  const fetchMembers = async () => {
    const res = await fetch('/api/members');
    if (!res.ok) throw new Error('Failed to fetch members');
    const data = await res.json();
    return data.data || data || [];
  }

  const ensureSteamID = async (): Promise<string> => {
    if (steamID) return steamID;
    const members = await fetchMembers();
    console.log(driverUsername)
    const driver = members.find((d: any) => d.username === driverUsername);
    console.log(driver)
    if (!driver) throw new Error(`Driver ${driverUsername} not found`);
    setSteamID(driver.steamID);
    return driver.steamID;
  }

  const fetchScenarios = async () => {
    const sid = await ensureSteamID();
    const res = await fetch('/api/scenarios', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steamID: sid }),
    });
    if (!res.ok) throw new Error(`Failed to fetch ${driverUsername}'s scenarios`);
    const data = await res.json();
    return data;
  }

  const fetchStatistics = async () => {
    const sid = await ensureSteamID();
    const response = await fetch("/api/statistics/user", {
      method: 'POST',
      body: JSON.stringify({ steamID: sid })
    }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch statistics")
    }
    const data = await response.json()
    console.log(data)
    return data.data
  }

  const convertTime = (ms: number) => {
    const totalMinutes = Math.floor(ms / 60000)
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    }
  }

  const getStatistics = async () => {
    const jobs = await fetchStatistics()
    
    let time = 0;
    let thp = 0;
    let thpArray: any = [];
    let income = 0;
    let incomeArray: any = [];
    let distance = 0;
    let distanceArray: any = [];

    for (const job of jobs) {
      if (job.realtime?.actualTimeDriven) {
        time += job.realtime.actualTimeDriven
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
        max: maxThp
      },
      income: {
        income: income,
        avg: avgIncome,
        min: minIncome,
        max: maxIncome
      },
      distance: {
        distance: distance,
        avg: avgDistance,
        min: minDistance,
        max: maxDistance
      }
    }
  }

  useEffect(() => {
    if (!session || !driverUsername) return

    const loadStats = async () => {
      try {
        const statistics = await getStatistics()
        setStats(statistics)
        console.log(statistics)
      } catch (err: any) {
        throw new Error(err.message)
      }
    }

    loadStats()
  }, [session])

  return {
    stats
  }
}
