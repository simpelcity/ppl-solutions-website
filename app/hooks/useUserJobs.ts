"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/AuthContext"

type Job = any

export function useUserJobs() {
  const { session } = useAuth()
  const [steamID, setSteamID] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState<boolean>(false)
  const [allJobs, setAllJobs] = useState<Job[]>([])

  const driverUsername = session?.user?.user_metadata?.username || session?.user?.email

  const fetchMembers = async () => {
    const res = await fetch("/api/members")
    if (!res.ok) throw new Error("Failed to fetch members")
    const data = await res.json()
    return data.data || data || []
  }

  const ensureSteamID = async (): Promise<string> => {
    if (steamID) return steamID
    const members = await fetchMembers()
    const driver = members.find((d: any) => d.username === driverUsername)
    if (!driver) throw new Error(`Driver ${driverUsername} not found`)
    setSteamID(driver.steamID)
    return driver.steamID
  }

  const fetchJobsPage = async (page: number) => {
    const sid = await ensureSteamID()
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ steamID: sid, page }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(`Failed to fetch jobs: ${text}`)
    }
    const data = await res.json()
    console.log(data)
    return data
  }

  const parseLastPage = (lastUrl: string | undefined): number => {
    if (!lastUrl) return 1
    const m = lastUrl.match(/[?&]page=(\d+)/)
    return m ? parseInt(m[1], 10) : 1
  }

  const fetchAllJobs = async (): Promise<Job[]> => {
    const sid = await ensureSteamID()
    const allJobs: Job[] = []
    for (let page = 1; page <= lastPage; page++) {
      const payload = await fetchJobsPage(page)
      if (Array.isArray(payload.data)) {
        allJobs.push(...payload.data)
      }
    }
    return allJobs.reverse()
  }

  const loadJobs = async (displayPage: number) => {
    setLoading(true)
    setError(null)
    try {
      const apiPage = lastPage - displayPage + 1
      const payload = await fetchJobsPage(apiPage)
      setJobs(Array.isArray(payload.data) ? payload.data.reverse() : [])
      setCurrentPage(apiPage)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleShowAll = async () => {
    if (!showAll) {
      setLoading(true)
      try {
        const all = await fetchAllJobs()
        setAllJobs(all)
        setShowAll(true)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    } else {
      setShowAll(false)
      await loadJobs(currentPage)
    }
  }

  useEffect(() => {
    if (!session || !driverUsername) return

    let cancelled = false

    const init = async () => {
      setLoading(true)
      setError(null)
      try {
        const page1 = await fetchJobsPage(1)
        console.log("page 1 payload:", page1)
        const lp = parseLastPage(page1.links?.last)
        
        if (!cancelled) {
          setLastPage(lp)
        }

        const lastPayload = await fetchJobsPage(lp)
        console.log("last payload:", lastPayload)
        if (!cancelled) {
          setJobs(Array.isArray(lastPayload.data) ? lastPayload.data.reverse() : [])
          setCurrentPage(lp)
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => { cancelled = true }
  }, [session, driverUsername])

  const displayPage = lastPage - currentPage + 1

  return {
    jobs: showAll ? allJobs : jobs,
    loading,
    error,
    currentPage,
    displayPage,
    lastPage,
    showAll,
    toggleShowAll,
    goToPage: (page: number) => loadJobs(page),
    goToNextPage: () => loadJobs(displayPage + 1),
    goToPreviousPage: () => loadJobs(displayPage - 1),
  }
}