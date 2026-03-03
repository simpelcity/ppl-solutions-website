'use client'

import { useLeaderboard } from '@/hooks/useLeaderboard'
import { Card, Row, Col, Spinner } from 'react-bootstrap'

export default function CardLeaderboard() {
  const { loading, error, topDistanceDriver, topThpDriver, topMassDriver } = useLeaderboard();
  console.log({ loading, error, topDistanceDriver, topThpDriver, topMassDriver });

  const rounded = (value: any) => {
    const valueNum = value.toFixed(1);
    const decimalValue = valueNum.toString().indexOf(".");
    const result = valueNum.toString().substring(decimalValue + 1);

    if (result > 0) {
      return value.toFixed(2)
    } else {
      return value.toFixed(0);
    }
  }

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  if (loading) {
    return (
      <>
        <div className="loader w-auto d-flex justify-content-center align-items-center vh-100 text-light px-3">
          <Spinner animation="border" className="me-2" />
          <span className="fs-2">Loading...</span>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="w-100">
        <Row>
          <Col xs={12} md={6} lg={4}>
            <Card className="rounded-0 border-0 shadow px-0 h-100" data-bs-theme="dark">
              <Card.Title className="fs-3 py-3 mb-0 border-bottom border-dark-subtle">Highest THP Earner</Card.Title>
              <Card.Body>
                <Card.Text>
                  <span>{topThpDriver?.username}</span>{" "}
                  <span>{numberWithCommas(rounded(topThpDriver?.thp))} THP</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={6} lg={4}></Col>
          <Col xs={12} md={6} lg={4}></Col>
        </Row>
      </div>
    </>
  )
}
