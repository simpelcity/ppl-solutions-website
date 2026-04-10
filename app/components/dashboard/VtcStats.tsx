"use client"

import { Card, Row, Col, Placeholder } from "react-bootstrap"
import { Loader } from "@/components"
import { useVtcStats } from "@/hooks/useVtcStats"
import type { Dictionary } from "@/app/i18n"

interface VtcStatsProps {
  dict: Dictionary;
}

export default function VtcStats({ dict }: VtcStatsProps) {
  const { stats, loading, error } = useVtcStats(dict);

  const formatDistance = (distance: number, unit: string = "km"): string => {
    const value = distance / 1000
    return `${value.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${unit}`
  }

  if (loading) {
    return (
      <Card className="px-0 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
        <Placeholder as={Card.Title} animation="glow" className="fs-3 py-4 mb-0 border-bottom border-dark-subtle">
          <Placeholder xs={3} className="rounded-1" />
        </Placeholder>
        <Card.Body className="d-flex flex-column p-4 row-gap-4">
          <Row className="row-gap-3">
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                  <Placeholder xs={9} className="rounded-1" />
                </Placeholder>
                <Placeholder as="h5" animation="glow">
                  <Placeholder xs={9} className="rounded-1" />
                </Placeholder>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                  <Placeholder xs={5} className="rounded-1" />
                </Placeholder>
                <Placeholder as="h5" animation="glow">
                  <Placeholder xs={7} className="rounded-1" />
                </Placeholder>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                  <Placeholder xs={8} className="rounded-1" />
                </Placeholder>
                <Placeholder as="h5" animation="glow">
                  <Placeholder xs={9} className="rounded-1" />
                </Placeholder>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                  <Placeholder xs={12} className="rounded-1" />
                </Placeholder>
                <Placeholder as="h5" animation="glow">
                  <Placeholder xs={11} className="rounded-1" />
                </Placeholder>
              </div>
            </Col>
          </Row>

          <Row className="row-gap-3">
            <Col xs={12} md={6}>
              <Card className="rounded-0 border-0 shadow-sm h-100 bg-dark-lighter">
                <Placeholder as={Card.Title} animation="glow" className="fs-4 py-3 border-bottom border-dark-subtle">
                  <Placeholder xs={5} className="rounded-1" />
                </Placeholder>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={10} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={9} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={5} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={7} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={7} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={9} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={12} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={11} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="rounded-0 border-0 shadow-sm h-100 bg-dark-lighter">
                <Placeholder as={Card.Title} animation="glow" className="fs-4 py-3 border-bottom border-dark-subtle">
                  <Placeholder xs={5} className="rounded-1" />
                </Placeholder>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={8} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={9} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={5} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={7} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={7} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={9} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <Placeholder as="p" animation="glow" className="fs-2 fw-bold">
                          <Placeholder xs={12} className="rounded-1" />
                        </Placeholder>
                        <Placeholder as="h5" animation="glow">
                          <Placeholder xs={11} className="rounded-1" />
                        </Placeholder>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="px-0 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
        <Card.Body className="p-4">
          <p className="text-danger">{error}</p>
        </Card.Body>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className="px-0 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
        <Card.Body className="p-4">
          <p className="text-muted">{dict.errors.vtcStats.NO_STATS}</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="px-0 rounded-0 border-0 shadow-sm" data-bs-theme="dark">
        <Card.Title className="fs-3 py-4 mb-0 border-bottom border-dark-subtle">{dict.drivershub.vtcStats.vtc.title || "VTC Statistics"}</Card.Title>
        <Card.Body className="d-flex flex-column p-4 row-gap-4">
          <Row className="row-gap-3">
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">{formatDistance(stats.total.distance, "km")}</p>
                <h5>{dict.drivershub.vtcStats.vtc.totalDistance || "Total Distance"}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">{stats.total.jobs.toLocaleString()}</p>
                <h5>{dict.drivershub.vtcStats.vtc.totalJobs || "Total Jobs"}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">€{stats.total.revenue.toLocaleString()},-</p>
                <h5>{dict.drivershub.vtcStats.vtc.totalIncome || "Total Revenue"}</h5>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2">
                <p className="fs-2 fw-bold">
                  {stats.total.days} d, {stats.total.hours} h, {stats.total.minutes} m
                </p>
                <h5>{dict.drivershub.vtcStats.vtc.totalTimeDriven || "Total Time Driven"}</h5>
              </div>
            </Col>
          </Row>

          <Row className="row-gap-3">
            <Col xs={12} md={6}>
              <Card className="rounded-0 border-0 shadow-sm h-100 bg-dark-lighter">
                <Card.Title className="fs-4 py-3 border-bottom border-dark-subtle">{dict.drivershub.vtcStats.ets2.title || "ETS2 Statistics"}</Card.Title>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{formatDistance(stats.ets2.distance, "km")}</p>
                        <h5>{dict.drivershub.vtcStats.ets2.totalDistance || "Total Distance"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{stats.ets2.jobs.toLocaleString()}</p>
                        <h5>{dict.drivershub.vtcStats.ets2.totalJobs || "Total Jobs"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">€{stats.ets2.revenue.toLocaleString()}</p>
                        <h5>{dict.drivershub.vtcStats.ets2.totalIncome || "Total Revenue"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">
                          {stats.ets2.days} d, {stats.ets2.hours} h, {stats.ets2.minutes} m
                        </p>
                        <h5>{dict.drivershub.vtcStats.ets2.totalTimeDriven || "Total Time Driven"}</h5>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="rounded-0 border-0 shadow-sm h-100 bg-dark-lighter">
                <Card.Title className="fs-4 py-3 border-bottom border-dark-subtle">{dict.drivershub.vtcStats.ats.title || "ATS Statistics"}</Card.Title>
                <Card.Body>
                  <Row className="row-gap-4">
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{formatDistance(stats.ats.distance, "mi")}</p>
                        <h5>{dict.drivershub.vtcStats.ats.totalDistance || "Total Distance"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">{stats.ats.jobs.toLocaleString()}</p>
                        <h5>{dict.drivershub.vtcStats.ats.totalJobs || "Total Jobs"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">€{stats.ats.revenue.toLocaleString()}</p>
                        <h5>{dict.drivershub.vtcStats.ats.totalIncome || "Total Revenue"}</h5>
                      </div>
                    </Col>
                    <Col xs={6}>
                      <div className="border border-1 border-primary border-custom rounded-3 p-2">
                        <p className="fs-2 fw-bold">
                          {stats.ats.days} d, {stats.ats.hours} h, {stats.ats.minutes} m
                        </p>
                        <h5>{dict.drivershub.vtcStats.ats.totalTimeDriven || "Total Time Driven"}</h5>
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

