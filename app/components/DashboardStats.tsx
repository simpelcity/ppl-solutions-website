"use client"

import { useEffect, useState } from "react"
import { Card, Spinner, Row, Col } from "react-bootstrap"
import { Loader } from "@/components"

export default function DashboardStats() {
  // ETS2 stats
  const [ets2Distance, setEts2Distance] = useState<number>(0)
  const [ets2Jobs, setEts2Jobs] = useState<number>(0)
  const [ets2Revenue, setEts2Revenue] = useState<number>(0)
  const [ets2Days, setEts2Days] = useState<number>(0)
  const [ets2Hours, setEts2Hours] = useState<number>(0)
  const [ets2Minutes, setEts2Minutes] = useState<number>(0)

  // ATS stats
  const [atsDistance, setAtsDistance] = useState<number>(0)
  const [atsJobs, setAtsJobs] = useState<number>(0)
  const [atsRevenue, setAtsRevenue] = useState<number>(0)
  const [atsDays, setAtsDays] = useState<number>(0)
  const [atsHours, setAtsHours] = useState<number>(0)
  const [atsMinutes, setAtsMinutes] = useState<number>(0)

  // Combined stats
  const [totalDistance, setTotalDistance] = useState<number>(0)
  const [totalJobs, setTotalJobs] = useState<number>(0)
  const [totalRevenue, setTotalRevenue] = useState<number>(0)
  const [totalDays, setTotalDays] = useState<number>(0)
  const [totalHours, setTotalHours] = useState<number>(0)
  const [totalMinutes, setTotalMinutes] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const formatDistance = (distance: number): string => {
    const kmValue = distance / 1000
    return `${kmValue.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`
  }

  const fetchStatistics = async () => {
    const response = await fetch("/api/statistics")

    if (!response.ok) {
      throw new Error("Failed to fetch statistics")
    }
    const data = await response.json()
    const allJobs = data.data
    console.log(allJobs)
    return allJobs
  }

  const getStatistics = async () => {
    const statistics: any = []
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

    // Collect ATS jobs in array
    const atsJobsArray: any[] = []

    for (const job of jobs) {
      const isETS2 = job.game.id === "ets2" || job.game.id === "ets2"
      const isATS = job.game.id === "ats" || job.game.id === "ats"

      // Add ATS jobs to array
      if (isATS) {
        atsJobsArray.push(job)
      }

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

    // Log ATS jobs
    console.log("ATS Jobs:", atsJobsArray)
    console.log("Total ATS Jobs:", atsJobsArray.length)

    // Convert milliseconds to days, hours, minutes for each game
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

    const ets2TimeFormatted = convertTime(ets2Time)
    const atsTimeFormatted = convertTime(atsTime)
    const totalTimeFormatted = convertTime(totalTime)

    const atsDistanceMiles = kmToMiles(atsDistance)

    if (Array.isArray(statistics)) {
      statistics.push({
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
      })
    }

    console.log("Statistics:", statistics)
    console.log("ETS2 Stats:", statistics[0].ets2)
    console.log("ATS Stats:", statistics[0].ats)
    return statistics[0]
  }

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const statistics = await getStatistics()

        // Set ETS2 stats
        setEts2Distance(statistics.ets2.distance)
        setEts2Jobs(statistics.ets2.jobs)
        setEts2Revenue(statistics.ets2.revenue)
        setEts2Days(statistics.ets2.days)
        setEts2Hours(statistics.ets2.hours)
        setEts2Minutes(statistics.ets2.minutes)

        // Set ATS stats
        setAtsDistance(statistics.ats.distance)
        setAtsJobs(statistics.ats.jobs)
        setAtsRevenue(statistics.ats.revenue)
        setAtsDays(statistics.ats.days)
        setAtsHours(statistics.ats.hours)
        setAtsMinutes(statistics.ats.minutes)

        // Set total stats
        setTotalDistance(statistics.total.distance)
        setTotalJobs(statistics.total.jobs)
        setTotalRevenue(statistics.total.revenue)
        setTotalDays(statistics.total.days)
        setTotalHours(statistics.total.hours)
        setTotalMinutes(statistics.total.minutes)
      } catch (err: any) {
        setError(err.message || "Failed to load statistics")
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
        <Card.Body className="d-flex justify-content-center">
          <Loader>
            <span className="word">Jobs</span>
            <span className="word">Distance</span>
            <span className="word">Revenue</span>
            <span className="word">Time</span>
            <span className="word">Jobs</span>
          </Loader>
        </Card.Body>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
        <Card.Body>
          <p className="text-danger">{error}</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="my-3 px-0 rounded-0 border-0 shadow" data-bs-theme="dark">
        <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">VTC Statistics</Card.Title>
        <Card.Body className="d-flex flex-column align-items-center p-4">
          <Row className="w-100">
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">{formatDistance(totalDistance)} km</p>
                <h5>Total Distance</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">{totalJobs.toLocaleString()}</p>
                <h5>Total Jobs</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">€{totalRevenue.toLocaleString()}</p>
                <h5>Total Revenue</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">
                  {totalDays} d, {totalHours} h, {totalMinutes} m
                </p>
                <h5>Total Time Driven</h5>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col xs={6}>
              <Card className="rounded-0 border-0 shadow h-100">
                <Card.Title className="fs-4 py-3 border-bottom border-dark-subtle">ETS2 Statistics</Card.Title>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{formatDistance(ets2Distance)} km</p>
                        <h5>Total Distance</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{ets2Jobs.toLocaleString()}</p>
                        <h5>Total Jobs</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">€{ets2Revenue.toLocaleString()}</p>
                        <h5>Total Revenue</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">
                          {ets2Days} d, {ets2Hours} h, {ets2Minutes} m
                        </p>
                        <h5>Total Time Driven</h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={6}>
              <Card className="rounded-0 border-0 shadow h-100">
                <Card.Title className="fs-4 py-3 border-bottom border-dark-subtle">ATS Statistics</Card.Title>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{formatDistance(atsDistance)} km</p>
                        <h5>Total Distance</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{atsJobs.toLocaleString()}</p>
                        <h5>Total Jobs</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">€{atsRevenue.toLocaleString()}</p>
                        <h5>Total Revenue</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">
                          {atsDays} d, {atsHours} h, {atsMinutes} m
                        </p>
                        <h5>Total Time Driven</h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  )
}

