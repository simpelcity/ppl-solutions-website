"use client"

import { useEffect, useState } from "react"
import { Table, Button } from "react-bootstrap"
import { PlaceholderTable, ButtonPrimary } from "@/components"
import { useAuth } from "@/lib/AuthContext"
import { MdNavigateBefore } from "react-icons/md"
import { MdNavigateNext } from "react-icons/md"
import { useRouter } from "next/navigation"

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
  const router = useRouter()

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
    console.log(payload)
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

  const goToDisplayPage = async (displayPageNum: number) => {
    const targetApiPage = lastPage - displayPageNum + 1
    if (targetApiPage < 1 || targetApiPage > lastPage) return

    setLoading(true)
    setError(null)

    try {
      const payload = await fetchJobsPage(targetApiPage)
      setJobs(Array.isArray(payload.data) ? payload.data.slice().reverse() : [])
      setCurrentPage(targetApiPage)
    } catch (err: any) {
      console.error(err)
      setError(err.message ?? "Failed to load page")
    } finally {
      setLoading(false)
    }
  }

  const getDisplayPages = (): (number | "ellipsis")[] => {
    const total = lastPage
    const currentDisplay = lastPage - currentPage + 1
    if (total <= 9) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }

    const pages: (number | "ellipsis")[] = []
    const left = Math.max(1, currentDisplay - 2)
    const right = Math.min(total, currentDisplay + 2)

    pages.push(1)
    if (left > 2) pages.push("ellipsis")
    for (let p = left; p <= right; p++) {
      if (p !== 1 && p !== total) pages.push(p)
    }
    if (right < total - 1) pages.push("ellipsis")
    if (total !== 1) pages.push(total)

    return pages
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
        console.log("Fetched all jobs:", all)
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
    { title: "date" },
    { title: "username" },
    { title: "game" },
    { title: "from - to" },
    { title: "cargo" },
    { title: "truck" },
    { title: "distance" },
    { title: "income" },
  ]

  return (
    <>
      <div className="table-card-scroll">
        {loading ? (
          <PlaceholderTable columns={8} rows={10} />
        ) : error ? (
          <div className="text-danger text-center py-3">{error}</div>
        ) : (
          <>
            <Table variant="dark" className="table-nowrap table-minwidth text-start" borderless>
              <thead className="">
                <tr className="text-uppercase">
                  {tableItems.map((item) => (
                    <th key={item.title} className="bg-primary px-4 py-2">
                      {item.title}
                    </th>
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
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between mt-4 gap-2 ms-0 ms-md-4">
        {!showAll && (
          <div className="text-primary border border-light border-opacity-25 px-3 py-2 rounded-1 small">
            Showing page {displayPage} of {lastPage}
          </div>
        )}

        <div className="pagination-div d-flex flex-column flex-md-row justify-content-center align-items-center row-gap-3 column-gap-3">
          <ButtonPrimary classes="py-1" onClick={handleToggleShowAll}>
            {showAll ? "Show Paginated" : "show all jobs"}
          </ButtonPrimary>
          {!showAll && (
            <>
              <div className="d-flex justify-content-center align-items-center column-gap-1">
                <Button
                  className="p-1 btn-pagination d-flex align-items-center text-light border-0 rounded-3 bg-light bg-opacity-25"
                  onClick={() => {
                    if (currentPage < lastPage) goToDisplayPage(displayPage - 1)
                  }}
                  disabled={currentPage >= lastPage}>
                  <MdNavigateBefore className="fs-4" />
                </Button>

                <nav aria-label="Job pages" className="">
                  <ul className="pagination mb-0 column-gap-1">
                    {getDisplayPages().map((p, idx) =>
                      p === "ellipsis" ? (
                        <li key={`el-${idx}`} className="page-item disabled">
                          <span className="page-link">…</span>
                        </li>
                      ) : (
                        <li
                          key={`p-${p}`}
                          className={`page-item d-flex align-items-center ${displayPage === p ? "active" : ""}`}>
                          <button
                            className={`page-link rounded-3 py-1 d-flex align-items-center ${
                              displayPage === p
                                ? "bg-primary"
                                : "bg-transparent border-0 shadow-none text-light text-opacity-50"
                            }`}
                            onClick={() => goToDisplayPage(p as number)}
                            aria-current={displayPage === p ? "page" : undefined}
                            disabled={displayPage === p}>
                            {p}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </nav>

                <Button
                  className="p-1 btn-pagination d-flex align-items-center text-light border-0 rounded-3 bg-light bg-opacity-25"
                  onClick={() => {
                    if (currentPage > 1) goToDisplayPage(displayPage + 1)
                  }}
                  disabled={currentPage <= 1}>
                  <MdNavigateNext className="fs-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

