'use client'

import { useUserStats } from '@/hooks/useUserStats'
import { Card, Row, Col, Placeholder } from 'react-bootstrap'
import { TableUserStats, Loader, RateLimitError } from '@/components'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

type Unit = "km" | "mi" | "thp" | "euro" | "dollar" | "thorn";

export default function UserStats({ dict }: Props) {
  const { stats, loading, error, isRateLimited, rateLimitSecondsRemaining, retryStats } = useUserStats(dict);

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

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  function StatCardSkeleton({ labelWidth = 6, valueWidth = 11 }: { labelWidth?: number, valueWidth?: number }) {
    return (
      <Col xs={6}>
        <div className="d-flex flex-column">
          <Placeholder as="span" animation="glow" className="fw-bold">
            <Placeholder xs={labelWidth} className="rounded-1" />
          </Placeholder>
          <Placeholder as="span" animation="glow" className="fw-bold">
            <Placeholder xs={valueWidth} className="rounded-1" />
          </Placeholder>
        </div>
      </Col>
    );
  }

  const topStats1 = [
    { label: 6, value: 11 },
    { label: 8, value: 9 },
    { label: 7, value: 8 },
    { label: 8, value: 10 },
  ];

  const topStats2 = [
    { label: 6, value: 7 },
    { label: 8, value: 7 },
    { label: 7, value: 5 },
    { label: 8, value: 9 },
  ];

  const topStats3 = [
    { label: 6, value: 10 },
    { label: 8, value: 9 },
    { label: 7, value: 5 },
    { label: 8, value: 9 },
  ];

  if (loading) {
    return (
      <div className="w-100 d-flex flex-column p-3 p-md-4 row-gap-3 row-gap-md-4">
        <Row className="row-gap-3 row-gap-md-4 d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100 bg-surface">
              <Placeholder as={Card.Title} animation="glow" className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">
                <Placeholder xs={8} md={9} xl={12} className="rounded-1" />
              </Placeholder>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  {topStats1.map((w, i) => (
                    <StatCardSkeleton key={i} labelWidth={w.label} valueWidth={w.value} />
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100 bg-surface">
              <Placeholder as={Card.Title} animation="glow" className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">
                <Placeholder xs={6} md={7} xl={9} className="rounded-1" />
              </Placeholder>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  {topStats2.map((w, i) => (
                    <StatCardSkeleton key={i} labelWidth={w.label} valueWidth={w.value} />
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100 bg-surface">
              <Placeholder as={Card.Title} animation="glow" className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">
                <Placeholder xs={7} md={8} xl={11} className="rounded-1" />
              </Placeholder>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  {topStats3.map((w, i) => (
                    <StatCardSkeleton key={i} labelWidth={w.label} valueWidth={w.value} />
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="rounded-1 border-0 shadow-sm bg-surface text-theme">
              <Card.Header className="bg-surface p-3 p-md-4 border-bottom">
                <Placeholder as={Card.Title} animation="glow" className="m-0 fs-3">
                  <Placeholder xs={4} md={2} xl={2} className="rounded-1" />
                </Placeholder>
              </Card.Header>
              <Card.Body className="p-3 p-md-4">
                <TableUserStats dict={dict} isLoading={loading} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

  if (error) {
    if (isRateLimited) {
      return (
        <RateLimitError
          dict={dict}
          secondsRemaining={rateLimitSecondsRemaining ?? 0}
          onRetry={retryStats}
          retryLoading={loading}
        />
      );
    }

    return <div className="d-flex align-items-center text-danger fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error}</div>
  }
  if (!stats) return null;

  return (
    <>
      <div className="w-100 d-flex flex-column p-3 p-md-4 row-gap-3 row-gap-md-4">
        <Row className="row-gap-3 row-gap-md-4 d-flex justify-content-center">
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100 bg-surface">
              <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">{dict.drivershub.userStats.cards.thp.title}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.thp.total}</span>
                      <span>{formatValue(stats.thp.thp, "thp")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.thp.avg}</span>
                      <span>{formatValue(stats.thp.avg, "thp")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.thp.min}</span>
                      <span>{formatValue(stats.thp.min, "thp")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.thp.max}</span>
                      <span>{formatValue(stats.thp.max, "thp")}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100 bg-surface">
              <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">{dict.drivershub.userStats.cards.income.title}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.income.total}</span>
                      <span>{formatValue(stats.income.income, "euro")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.income.avg}</span>
                      <span>{formatValue(stats.income.avg, "euro")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.income.min}</span>
                      <span>{formatValue(stats.income.min, "euro")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.income.max}</span>
                      <span>{formatValue(stats.income.max, "euro")}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100 bg-surface">
              <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-darker">{dict.drivershub.userStats.cards.distance.title}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.distance.total}</span>
                      <span>{formatValue(stats.distance.distance, "km")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.distance.avg}</span>
                      <span>{formatValue(stats.distance.avg, "km")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.distance.min}</span>
                      <span>{formatValue(stats.distance.min, "km")}</span>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="d-flex flex-column">
                      <span className="fw-bold">{dict.drivershub.userStats.cards.distance.max}</span>
                      <span>{formatValue(stats.distance.max, "km")}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="rounded-1 border-0 shadow-sm bg-surface text-theme">
              <Card.Header className="bg-surface p-3 p-md-4 border-bottom">
                <Card.Title className="m-0 fs-3">{dict.drivershub.userStats.table.title}</Card.Title>
              </Card.Header>
              <Card.Body className="p-3 p-md-4">
                <TableUserStats dict={dict} isLoading={loading} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
