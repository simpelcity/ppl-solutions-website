'use client'

import { useUserStats } from '@/hooks/useUserStats'
import { Card, Row, Col } from 'react-bootstrap'
import { TableStats, LoaderSpinner, RateLimitError } from '@/components'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function UserStats({ dict }: Props) {
  const { stats, loading, error, isRateLimited, rateLimitSecondsRemaining, retryStats } = useUserStats(dict);

  const rounded = (value: any) => {
    const valueNum = value.toFixed(1);
    const decimalValue = valueNum.toString().indexOf(".");
    const result = valueNum.toString().substring(decimalValue + 1);

    if (result > 0) {
      return value.toFixed(1)
    } else {
      return value.toFixed(0);
    }
  }

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  if (loading) return <LoaderSpinner dict={dict} />
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
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-subtle">{dict.drivershub.userStats.cards.thp.title}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.thp.total}</h5>
                      <p>{numberWithCommas(rounded(stats.thp.thp))} THP</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.thp.avg}</h5>
                      <p>{rounded(stats.thp.avg)} THP</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.thp.min}</h5>
                      <p>{rounded(stats.thp.min)} THP</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.thp.max}</h5>
                      <p>{rounded(stats.thp.max)} THP</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-subtle">{dict.drivershub.userStats.cards.income.title}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.income.total}</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.income))}</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.income.avg}</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.avg))}</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.income.min}</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.min))}</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.income.max}</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.max))}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-1 border-0 shadow-sm-sm px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 p-3 p-md-4 mb-0 border-bottom border-dark-subtle">{dict.drivershub.userStats.cards.distance.title}</Card.Title>
              <Card.Body className="p-3 p-md-4">
                <Row>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.distance.total}</h5>
                      <p>{numberWithCommas(rounded(stats.distance.distance))} km</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.distance.avg}</h5>
                      <p>{rounded(stats.distance.avg)} km</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.distance.min}</h5>
                      <p>{rounded(stats.distance.min)} km</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>{dict.drivershub.userStats.cards.distance.max}</h5>
                      <p>{rounded(stats.distance.max)} km</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card className="rounded-1 border-0 shadow-sm" data-bs-theme="dark">
              <Card.Header className="bg-dark p-3 p-md-4 border-bottom">
                <Card.Title className="m-0 fs-3">{dict.drivershub.userStats.table.title}</Card.Title>
              </Card.Header>
              <Card.Body className="p-3 p-md-4">
                <TableStats dict={dict} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
