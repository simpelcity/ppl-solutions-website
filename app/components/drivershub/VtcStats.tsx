"use client"

import { Card, Row, Col, Placeholder } from "react-bootstrap"
import { RateLimitError } from "@/components"
import { useVtcStats } from "@/hooks/useVtcStats"
import type { Dictionary } from "@/app/i18n"

interface VtcStatsProps {
  dict: Dictionary;
}

type Unit = "km" | "mi" | "thp" | "euro" | "dollar" | "thorn";

export default function VtcStats({ dict }: VtcStatsProps) {
  const { stats, loading, error, isRateLimited, rateLimitSecondsRemaining, retryVtcStats } = useVtcStats(dict);

  const vtcDict = dict.drivershub.vtcStats;

  const currencySymbols: Partial<Record<Unit, string>> = {
    euro: "€",
    dollar: "$",
    thorn: "Ŧ",
  };

  const typeLabels: Partial<Record<Unit, string>> = {
    km: "km",
    mi: "mi",
    thp: "THP",
  };

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatValue(value: number, unit: Unit): string {
    const icon = currencySymbols[unit] ?? "";
    const type = typeLabels[unit] ?? "";

    const rounded = Math.round(value * 10) / 10;

    let formatted: string;

    if (rounded >= 1_000_000) {
      formatted = `${(rounded / 1_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}M`;
    } else {
      formatted = rounded.toLocaleString(undefined, {
        minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
        maximumFractionDigits: 1,
      });
    }

    return `${icon}${formatted}${type ? ` ${type}` : ""}`;
  }

  function formatTime(hours: number) {
    return `${hours} ${vtcDict.hour}`;
  }

  function StatCardSkeleton({ valueWidth = 8, labelWidth = 9 }: { valueWidth?: number; labelWidth?: number }) {
    return (
      <div className="border border-1 border-primary border-custom rounded-3 h-100 p-2 d-flex flex-column">
        <Placeholder as="span" animation="glow" className="fs-2 fw-bold">
          <Placeholder xs={valueWidth} className="rounded-1" />
        </Placeholder>
        <Placeholder as="span" animation="glow">
          <Placeholder xs={labelWidth} className="rounded-1" />
        </Placeholder>
      </div>
    );
  }

  const topCards = [
    { value: 10, label: 8 },
    { value: 4, label: 6 },
    { value: 5, label: 7 },
    { value: 10, label: 11 },
  ];

  const sectionCards = [
    { value: 10, label: 8 },
    { value: 4, label: 6 },
    { value: 8, label: 7 },
    { value: 10, label: 11 },
  ];

  if (loading) {
    return (
      <Card className="px-0 rounded-1 border-0 shadow-sm">
        <Placeholder as={Card.Title} animation="glow" className="fs-3 py-4 mb-0 border-bottom border-dark-darker">
          <Placeholder xs={5} md={3} xl={3} className="rounded-1" />
        </Placeholder>
        <Card.Body className="d-flex flex-column p-4 row-gap-4">
          <Row className="row-gap-3">
            {topCards.map((w, i) => (
              <Col key={i} xs={12} md={6} xl={3}>
                <StatCardSkeleton valueWidth={w.value} labelWidth={w.label} />
              </Col>
            ))}
          </Row>

          <Row className="row-gap-3">
            <Col xs={12} lg={6}>
              <Card className="rounded-1 border-0 shadow-sm h-100 bg-surface-lighter">
                <Placeholder as={Card.Title} animation="glow" className="fs-4 py-3 border-bottom border-dark-darker">
                  <Placeholder xs={6} md={6} xl={5} className="rounded-1" />
                </Placeholder>
                <Card.Body>
                  <Row className="row-gap-4">
                    {sectionCards.map((w, i) => (
                      <Col key={i} xs={12} md={6}>
                        <StatCardSkeleton valueWidth={w.value} labelWidth={w.label} />
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className="rounded-1 border-0 shadow-sm h-100 bg-surface-lighter">
                <Placeholder as={Card.Title} animation="glow" className="fs-4 py-3 border-bottom border-dark-darker">
                  <Placeholder xs={5} md={6} xl={4} className="rounded-1" />
                </Placeholder>
                <Card.Body>
                  <Row className="row-gap-4">
                    {sectionCards.map((w, i) => (
                      <Col key={i} xs={12} md={6}>
                        <StatCardSkeleton valueWidth={w.value} labelWidth={w.label} />
                      </Col>
                    ))}
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
    if (isRateLimited) {
      return <RateLimitError dict={dict} secondsRemaining={rateLimitSecondsRemaining ?? 0} onRetry={retryVtcStats} retryLoading={loading} />;
    }

    return (
      <div className="text-danger text-center d-flex align-items-center justify-content-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error}</div>
    )
  }

  if (!stats) {
    return (
      <Card className="px-0 rounded-1 border-0 shadow-sm">
        <Card.Body className="p-4">
          <p className="text-muted">{dict.errors.vtcStats.NO_STATS}</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <>
      <Card className="px-0 rounded-1 border-0 shadow-sm">
        <Card.Title className="fs-3 py-3 py-md-4 mb-0 border-bottom border-dark-darker">{dict.drivershub.vtcStats.vtc.title || "VTC Statistics"}</Card.Title>
        <Card.Body className="d-flex flex-column p-3 p-md-4 row-gap-3 row-gap-md-4">
          <Row className="row-gap-3 row-gap-md-4">
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                <span className="fs-2 fw-bold">{formatValue(stats.total.distance, "km") ?? 0}</span>
                <span className="fw-bold">{dict.drivershub.vtcStats.vtc.totalDistance || "Total Distance"}</span>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                <span className="fs-2 fw-bold">{numberWithCommas(stats.total.jobs) ?? 0}</span>
                <span className="fw-bold">{dict.drivershub.vtcStats.vtc.totalJobs || "Total Jobs"}</span>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                <span className="fs-2 fw-bold">{formatValue(stats.total.income, "euro") ?? 0}</span>
                <span className="fw-bold">{dict.drivershub.vtcStats.vtc.totalIncome || "Total Income"}</span>
              </div>
            </Col>
            <Col xs={12} md={6} xl={3}>
              <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                <span className="fs-2 fw-bold">{formatTime(stats.total.hours)}</span>
                <span className="fw-bold">{dict.drivershub.vtcStats.vtc.totalTimeDriven || "Total Time Driven"}</span>
              </div>
            </Col>
          </Row>

          <Row className="row-gap-3 row-gap-md-4">
            <Col xs={12} lg={6}>
              <Card className="rounded-1 border-0 shadow-sm h-100 bg-surface-lighter">
                <Card.Title className="fs-4 py-3 py-md-4 mb-0 border-bottom border-dark-darker">{dict.drivershub.vtcStats.ets2.title || "ETS2 Statistics"}</Card.Title>
                <Card.Body className="p-3 p-md-4">
                  <Row className="row-gap-3 row-gap-md-4">
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{formatValue(stats.ets2.distance, "km") ?? 0}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ets2.totalDistance || "Total Distance"}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{numberWithCommas(stats.ets2.jobs) ?? 0}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ets2.totalJobs || "Total Jobs"}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{formatValue(stats.ets2.income, "euro") ?? 0}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ets2.totalIncome || "Total Income"}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{formatTime(stats.ets2.hours)}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ets2.totalTimeDriven || "Total Time Driven"}</span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} lg={6}>
              <Card className="rounded-1 border-0 shadow-sm h-100 bg-surface-lighter">
                <Card.Title className="fs-4 py-3 py-md-4 mb-0 border-bottom border-dark-darker">{dict.drivershub.vtcStats.ats.title || "ATS Statistics"}</Card.Title>
                <Card.Body className="p-3 p-md-4">
                  <Row className="row-gap-3 row-gap-md-4">
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{formatValue(stats.ats.distance, "mi") ?? 0}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ats.totalDistance || "Total Distance"}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{numberWithCommas(stats.ats.jobs) ?? 0}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ats.totalJobs || "Total Jobs"}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{formatValue(stats.ats.income, "dollar") ?? 0}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ats.totalIncome || "Total Income"}</span>
                      </div>
                    </Col>
                    <Col xs={12} md={6}>
                      <div className="border border-1 border-primary border-custom rounded-1 h-100 p-2 d-flex flex-column">
                        <span className="fs-2 fw-bold">{formatTime(stats.ats.hours)}</span>
                        <span className="fw-bold">{dict.drivershub.vtcStats.ats.totalTimeDriven || "Total Time Driven"}</span>
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

