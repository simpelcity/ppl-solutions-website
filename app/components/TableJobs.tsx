"use client"

import { useEffect, useState } from "react"
import { Table } from "react-bootstrap"
import { PlaceholderTable } from "@/components"
import { useAuth } from "@/lib/AuthContext"
import { ButtonOutline } from "@/components"

type Job = any

export default function TableJobs() {
  const { session } = useAuth()
  const [steamID, setSteamID] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [lastPage, setLastPage] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState<boolean>(false)
  const [allJobs, setAllJobs] = useState<Job[]>([])

  if (!session) return null
  const driverUsername = (session as any).user?.user_metadata?.username || session.user.email

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
      throw new Error(`Failed to fetch jobs (status ${res.status}): ${text}`)
    }
    const payload = await res.json()
    return payload
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
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steamID: sid, page }),
      })
      if (!res.ok) {
        const text = await res.text().catch(() => "")
        throw new Error(`Failed to fetch jobs page ${page} (status ${res.status}): ${text}`)
      }
      const payload = await res.json()
      if (Array.isArray(payload.data)) {
        allJobs.push(...payload.data)
      }
    }
    return allJobs.reverse()
  }

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      setLoading(true)
      setError(null)
      try {
        const page1 = await fetchJobsPage(1)
        const lp = parseLastPage(page1.links?.last)
        if (!cancelled) {
          setLastPage(lp)
        }

        const lastPayload = await fetchJobsPage(lp)
        if (!cancelled) {
          setJobs(Array.isArray(lastPayload.data) ? lastPayload.data.slice().reverse() : [])
          setCurrentPage(lp)
        }
      } catch (err: any) {
        console.error(err)
        if (!cancelled) setError(err.message ?? "Failed to load jobs")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [driverUsername])

  const handleNext = async () => {
    if (currentPage <= 1) return
    const nextPage = currentPage - 1
    setLoading(true)
    setError(null)
    try {
      const payload = await fetchJobsPage(nextPage)
      setJobs(Array.isArray(payload.data) ? payload.data.slice().reverse() : [])
      setCurrentPage(nextPage)
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? "Failed to load next page")
    } finally {
      setLoading(false)
    }
  }

  const handlePrevious = async () => {
    if (currentPage >= lastPage) return
    const prevPage = currentPage + 1
    setLoading(true)
    setError(null)
    try {
      const payload = await fetchJobsPage(prevPage)
      setJobs(Array.isArray(payload.data) ? payload.data.slice().reverse() : [])
      setCurrentPage(prevPage)
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? "Failed to load previous page")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleShowAll = async () => {
    if (showAll) {
      setShowAll(false)
      setAllJobs([])
      setLoading(true)
      setError(null)
      try {
        const lastPayload = await fetchJobsPage(lastPage)
        setJobs(Array.isArray(lastPayload.data) ? lastPayload.data.slice().reverse() : [])
        setCurrentPage(lastPage)
      } catch (err: any) {
        console.error(err)
        setError(err.message ?? "Failed to load jobs")
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(true)
      setError(null)
      try {
        const all = await fetchAllJobs()
        setAllJobs(all)
        setShowAll(true)
      } catch (err: any) {
        console.error(err)
        setError(err.message ?? "Failed to load all jobs")
      } finally {
        setLoading(false)
      }
    }
  }

  const displayPage = lastPage - currentPage + 1

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" })

  const tableItems = [
    { title: "username" },
    { title: "game" },
    { title: "from - to" },
    { title: "cargo" },
    { title: "date" },
    { title: "truck" },
    { title: "distance" },
    { title: "income" },
  ]

  return (
    <>
      <div className="table-card-scroll">
        {loading ? (
          <PlaceholderTable columns={8} rows={6} />
        ) : error ? (
          <div className="text-danger text-center py-3">{error}</div>
        ) : (
          <>
            <Table variant="dark" className="table-nowrap table-minwidth text-start" borderless>
              <thead className="">
                <tr className="text-uppercase">
                  {tableItems.map((item) => (
                    <th className="bg-primary px-4 py-2">{item.title}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {(showAll ? allJobs : jobs).length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center">
                      No jobs found
                    </td>
                  </tr>
                ) : (
                  (showAll ? allJobs : jobs).map((job: any) => (
                    <tr key={job.jobID} className="border-0">
                      <td className="px-4 py-2">{formatDate(job.realtime?.end ?? Date.now())}</td>
                      <td className="px-4 py-2">{job.driver?.username ?? "—"}</td>
                      <td className="text-uppercase px-4 py-2">{job.game?.id ?? "—"}</td>
                      <td className="px-4 py-2">
                        {job.source?.city?.name ?? "—"} - {job.destination?.city?.name ?? "—"}
                      </td>
                      <td className="px-4 py-2">
                        {job.cargo?.name ?? "—"} ({Math.floor((job.cargo?.mass ?? 0) / 1000)}t)
                      </td>
                      <td className="px-4 py-2">
                        {job.truck?.name ?? "—"} {job.truck?.model?.name ?? ""}
                      </td>
                      <td className="px-4 py-2">{job.distanceDriven ?? "—"} km</td>
                      <td className="px-4 py-2">€ {job.income ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-between mt-3 gap-2">
        {!showAll && (
          <div className="text-light">
            Page {displayPage} of {lastPage}
          </div>
        )}

        <div className="d-flex justify-content-center align-items-center column-gap-2">
          {!showAll && (
            <>
              <ButtonOutline onClick={handlePrevious} disabled={currentPage >= lastPage}>
                previous
              </ButtonOutline>
              <ButtonOutline onClick={handleNext} disabled={currentPage <= 1}>
                next
              </ButtonOutline>
            </>
          )}
          <ButtonOutline onClick={handleToggleShowAll}>{showAll ? "Show Paginated" : "Show All Jobs"}</ButtonOutline>
        </div>
      </div>
    </>
  )
}

