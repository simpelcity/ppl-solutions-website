'use client'

import { useUserStats } from '@/hooks/useUserStats'
import { Card, Row, Col } from 'react-bootstrap'
import { TableStats } from '@/components/'

export default function UserStats() {
  const { stats } = useUserStats();

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

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="w-100 d-flex flex-column">
        <Row>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-0 border-0 shadow my-3 px-0" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">TruckersHub Points</Card.Title>
              <Card.Body className="">
                <Row>
                  <Col xs={6}>
                    <div>
                      <h5>Total</h5>
                      <p>{numberWithCommas(rounded(stats.thp.thp))} THP</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Average</h5>
                      <p>{rounded(stats.thp.avg)} THP</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Minimum</h5>
                      <p>{rounded(stats.thp.min)} THP</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Maximum</h5>
                      <p>{rounded(stats.thp.max)} THP</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-0 border-0 shadow my-3 px-0" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">Income Earned</Card.Title>
              <Card.Body className="">
                <Row>
                  <Col xs={6}>
                    <div>
                      <h5>Total</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.income))}</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Average</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.avg))}</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Minimum</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.min))}</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Maximum</h5>
                      <p>€ {numberWithCommas(rounded(stats.income.max))}</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-0 border-0 shadow my-3 px-0" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">Delivery Distance</Card.Title>
              <Card.Body className="">
                <Row>
                  <Col xs={6}>
                    <div>
                      <h5>Total</h5>
                      <p>{numberWithCommas(rounded(stats.distance.distance))} km</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Average</h5>
                      <p>{rounded(stats.distance.avg)} km</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Minimum</h5>
                      <p>{rounded(stats.distance.min)} km</p>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div>
                      <h5>Maximum</h5>
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
            <Card className="rounded-0 border-0 shadow my-3 px-0" data-bs-theme="dark">
              <Card.Header className="bg-dark rounded-0">
                <Card.Title className="text-uppercase fs-2 text-light my-1">Statistics</Card.Title>
              </Card.Header>
              <Card.Body className="p-4">
                <TableStats />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  )
}
