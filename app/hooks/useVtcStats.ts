"use client"

import { useEffect, useState } from "react"

interface GameStats {
  distance: number
  jobs: number
  revenue: number
  days: number
  hours: number
  minutes: number
}

interface VtcStats {
  ets2: GameStats
  ats: GameStats
  total: GameStats
}

export function useVtcStats() {
  const [stats, setStats] = useState<VtcStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatistics = async () => {
    const response = await fetch("/api/statistics")

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
      days: Math.floor(totalMinutes / 1440),
      hours: Math.floor((totalMinutes % 1440) / 60),
      minutes: totalMinutes % 60,
    }
  }

  const kmToMiles = (km: number) => {
    return km * 0.621371
  }

  const getStatistics = async () => {
    const jobs = await fetchStatistics()

    let ets2Distance = 0
    let ets2Jobs = 0
    let ets2Revenue = 0
    let ets2Time = 0

    let atsDistance = 0
    let atsJobs = 0
    let atsRevenue = 0
    let atsTime = 0

    let totalDistance = 0
    let totalJobs = 0
    let totalRevenue = 0
    let totalTime = 0

    for (const job of jobs) {
      const isETS2 = job.game.id === "ets2"
      const isATS = job.game.id === "ats"

      if (job.distanceDriven) {
        totalDistance += job.distanceDriven
        if (isETS2) ets2Distance += job.distanceDriven
        if (isATS) atsDistance += job.distanceDriven
      }

      if (job.jobID) {
        totalJobs += 1
        if (isETS2) ets2Jobs += 1
        if (isATS) atsJobs += 1
      }

      if (job.revenue) {
        totalRevenue += job.revenue
        if (isETS2) ets2Revenue += job.revenue
        if (isATS) atsRevenue += job.revenue
      }

      if (job.realtime?.actualTimeDriven) {
        totalTime += job.realtime.actualTimeDriven
        if (isETS2) ets2Time += job.realtime.actualTimeDriven
        if (isATS) atsTime += job.realtime.actualTimeDriven
      }
    }

    const ets2TimeFormatted = convertTime(ets2Time)
    const atsTimeFormatted = convertTime(atsTime)
    const totalTimeFormatted = convertTime(totalTime)

    const atsDistanceMiles = kmToMiles(atsDistance)

    return {
      ets2: {
        distance: ets2Distance,
        jobs: ets2Jobs,
        revenue: ets2Revenue,
        days: ets2TimeFormatted.days,
        hours: ets2TimeFormatted.hours,
        minutes: ets2TimeFormatted.minutes,
      },
      ats: {
        distance: atsDistanceMiles,
        jobs: atsJobs,
        revenue: atsRevenue,
        days: atsTimeFormatted.days,
        hours: atsTimeFormatted.hours,
        minutes: atsTimeFormatted.minutes,
      },
      total: {
        distance: totalDistance,
        jobs: totalJobs,
        revenue: totalRevenue,
        days: totalTimeFormatted.days,
        hours: totalTimeFormatted.hours,
        minutes: totalTimeFormatted.minutes,
      },
    }
  }

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const statistics = await getStatistics()
        setStats(statistics)
        console.log(statistics)
      } catch (err: any) {
        setError(err.message || "Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  return { stats, loading, error }
}
