"use client"

import { Card, Row, Col } from "react-bootstrap"
import { Loader } from "@/components/"
import { useVtcStats } from "@/hooks/useVtcStats"

interface DashboardStatsProps {
  dict?: {
    vtc: {
      title: string;
      totalDistance: string;
      totalJobs: string;
      totalIncome: string;
      totalTimeDriven: string;
    };
    ets2: {
      title: string;
      totalDistance: string;
      totalJobs: string;
      totalIncome: string;
      totalTimeDriven: string;
    };
    ats: {
      title: string;
      totalDistance: string;
      totalJobs: string;
      totalIncome: string;
      totalTimeDriven: string;
    },
    error: {
      noStats: string;
    }
  };
}

export default function DashboardStats({ dict }: DashboardStatsProps) {
  const { stats, loading, error } = useVtcStats()

  const formatDistance = (distance: number, unit: string = "km"): string => {
    const value = distance / 1000
    return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${unit}`
  }

  if (loading) {
    return (
      <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
        <Card.Body className="d-flex justify-content-center">
          <Loader>
            <span className="word">{dict?.vtc?.totalJobs}</span>
            <span className="word">{dict?.vtc?.totalDistance}</span>
            <span className="word">{dict?.vtc?.totalIncome}</span>
            <span className="word">{dict?.vtc?.totalTimeDriven}</span>
            <span className="word">{dict?.vtc?.totalJobs}</span>
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

  if (!stats) {
    return (
      <Card className="p-3 my-3 rounded-0 border-0 shadow" data-bs-theme="dark">
        <Card.Body>
          <p className="text-muted">{dict?.error.noStats}</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="my-3 px-0 rounded-0 border-0 shadow" data-bs-theme="dark">
        <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">{dict?.vtc?.title || "VTC Statistics"}</Card.Title>
        <Card.Body className="d-flex flex-column align-items-center p-4">
          <Row className="w-100 row-gap-3">
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">{formatDistance(stats.total.distance, "km")}</p>
                <h5>{dict?.vtc?.totalDistance || "Total Distance"}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">{stats.total.jobs.toLocaleString()}</p>
                <h5>{dict?.vtc?.totalJobs || "Total Jobs"}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">€{stats.total.revenue.toLocaleString()},-</p>
                <h5>{dict?.vtc?.totalIncome || "Total Revenue"}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">
                  {stats.total.days} d, {stats.total.hours} h, {stats.total.minutes} m
                </p>
                <h5>{dict?.vtc?.totalTimeDriven || "Total Time Driven"}</h5>
              </div>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col xs={12} md={6}>
              <Card className="rounded-0 border-0 shadow h-100 bg-dark-lighter">
                <Card.Title className="fs-4 py-3 border-bottom border-dark-subtle">{dict?.ets2?.title || "ETS2 Statistics"}</Card.Title>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{formatDistance(stats.ets2.distance, "km")}</p>
                        <h5>{dict?.ets2?.totalDistance || "Total Distance"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{stats.ets2.jobs.toLocaleString()}</p>
                        <h5>{dict?.ets2?.totalJobs || "Total Jobs"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">€{stats.ets2.revenue.toLocaleString()}</p>
                        <h5>{dict?.ets2?.totalIncome || "Total Revenue"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">
                          {stats.ets2.days} d, {stats.ets2.hours} h, {stats.ets2.minutes} m
                        </p>
                        <h5>{dict?.ets2?.totalTimeDriven || "Total Time Driven"}</h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="rounded-0 border-0 shadow h-100 bg-dark-lighter">
                <Card.Title className="fs-4 py-3 border-bottom border-dark-subtle">{dict?.ats?.title || "ATS Statistics"}</Card.Title>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{formatDistance(stats.ats.distance, "mi")}</p>
                        <h5>{dict?.ats?.totalDistance || "Total Distance"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{stats.ats.jobs.toLocaleString()}</p>
                        <h5>{dict?.ats?.totalJobs || "Total Jobs"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">€{stats.ats.revenue.toLocaleString()}</p>
                        <h5>{dict?.ats?.totalIncome || "Total Revenue"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">
                          {stats.ats.days} d, {stats.ats.hours} h, {stats.ats.minutes} m
                        </p>
                        <h5>{dict?.ats?.totalTimeDriven || "Total Time Driven"}</h5>
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

