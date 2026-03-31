'use client'

import { useUserStats } from '@/hooks/useUserStats'
import { Card, Row, Col, Alert } from 'react-bootstrap'
import { TableStats, LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function UserStats({ dict }: Props) {
  const { stats, loading, error } = useUserStats(dict);

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
  if (error) return <div className="d-flex align-items-center text-danger fw-bold">{dict.errors.GENERAL_ERROR}: {error}</div>
  if (!stats) return null;

  return (
    <>
      <div className="w-100 d-flex flex-column p-3 row-gap-4">
        <Row className="row-gap-3">
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-0 border-0 shadow-sm-sm px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">{dict.drivershub.userStats.cards.thp.title}</Card.Title>
              <Card.Body className="">
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
            <Card className="rounded-0 border-0 shadow-sm-sm px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">{dict.drivershub.userStats.cards.income.title}</Card.Title>
              <Card.Body className="">
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
            <Card className="rounded-0 border-0 shadow-sm-sm px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">{dict.drivershub.userStats.cards.distance.title}</Card.Title>
              <Card.Body className="">
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
            <Card className="rounded-0 border-0 shadow-sm-sm px-0" data-bs-theme="dark">
              <Card.Header className="bg-dark rounded-0">
                <Card.Title className="text-uppercase fs-2 text-light my-1">{dict.drivershub.userStats.table.title}</Card.Title>
              </Card.Header>
              <Card.Body className="p-4">
                <TableStats dict={dict} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
