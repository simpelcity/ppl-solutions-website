'use client'

import { Container, Table, Card, ButtonGroup, Row, Col, Button, Dropdown } from 'react-bootstrap'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useState, useEffect } from 'react';
import { BSButton, LoaderSpinner } from '@/components'
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TableLeaderboard() {
  const isAdmin = useIsAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState<'all-time' | 'monthly'>('all-time');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const { loading, error, allTimeDistanceLeaderboard, monthlyDistanceLeaderboard, allTimeThpLeaderboard, monthlyThpLeaderboard, allTimeMassLeaderboard, monthlyMassLeaderboard } = useLeaderboard(selectedPeriod, selectedYear, selectedMonth);

  const distanceLeaderboard = selectedPeriod === 'all-time' ? allTimeDistanceLeaderboard : monthlyDistanceLeaderboard;
  const thpLeaderboard = selectedPeriod === 'all-time' ? allTimeThpLeaderboard : monthlyThpLeaderboard;
  const massLeaderboard = selectedPeriod === 'all-time' ? allTimeMassLeaderboard : monthlyMassLeaderboard;

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

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

  const monthNames = [
    1, 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const getDateTitle = (selectedPeriod: string) => {
    if (selectedPeriod === 'monthly') {
      return `${selectedMonth} - ${selectedYear}`;
    } else {
      return 'All Time';
    }
  };

  return (
    <>
      <Container className="my-3 p-0" fluid>
        <Card className="border-0 rounded-0" data-bs-theme="dark">
          <Card.Header className="bg-dark d-flex justify-content-between align-items-center px-4 py-3">
            <Card.Title className="m-0">Company Leaderboard</Card.Title>
            {selectedPeriod === 'monthly' ? (
              <ButtonGroup className="btn-group-leaderboard">
                <Button variant="primary" className="text-light" onClick={handlePreviousMonth} disabled={selectedYear === 2020 && selectedMonth === 0}><FaChevronLeft /></Button>
                <Dropdown as={ButtonGroup} data-bs-theme="dark">
                  <Button variant="primary" className="text-light">{getDateTitle('monthly')}</Button>

                  <Dropdown.Toggle split variant="primary" className="text-light px-3" id="dropdown-split-basic" />

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSelectedPeriod('all-time')}>All Time</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedPeriod('monthly')}>Monthly</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="primary" className="text-light" onClick={handleNextMonth}><FaChevronRight /></Button>
              </ButtonGroup>
            ) : (
              <Dropdown as={ButtonGroup} className="btn-group-leaderboard" data-bs-theme="dark">
                <Button variant="primary" className="text-light">{getDateTitle('all-time')}</Button>

                <Dropdown.Toggle split variant="primary" className="text-light px-3" id="dropdown-split-basic" />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSelectedPeriod('all-time')}>All Time</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSelectedPeriod('monthly')}>Monthly</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Card.Header>
          <Card.Body className="p-4">
            {loading && <LoaderSpinner />}
            <Row>
              <Col xs={12} md={6} lg={4}>
                <h4 className="border-bottom pb-2 mb-3">Total THP Earned</h4>
                {thpLeaderboard.map((entry, index) => (
                  <div className="my-2 bg-dark-subtle p-2 d-flex align-items-center gap-2" key={entry.username}>
                    <span>{index + 1}</span>
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt="avatar"
                        className="rounded-circle"
                        width={40}
                        height={40}
                      />
                    ) : null}
                    <div className="d-flex flex-wrap flex-grow-1 column-gap-1 align-items-baseline">
                      <span className="me-auto">{entry.username}</span>
                      <span className="text-success fs-6">{numberWithCommas(rounded(entry.value))} THP</span>
                    </div>
                  </div>
                ))}
              </Col>
              <Col xs={12} md={6} lg={4}>
                <h4 className="border-bottom pb-2 mb-3">Total Distance Driven</h4>
                {distanceLeaderboard.map((entry, index) => (
                  <div className="my-2 bg-dark-subtle p-2 d-flex align-items-center gap-2" key={entry.username}>
                    <span className="me-2">{index + 1}</span>
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt="avatar"
                        className="rounded-circle me-2"
                        width={40}
                        height={40}
                      />
                    ) : null}
                    <div className="d-flex flex-wrap flex-grow-1 column-gap-1 align-items-baseline">
                      <span className="me-auto">{entry.username}</span>
                      <span className="text-success fs-6">{numberWithCommas(rounded(entry.value))} km</span>
                    </div>
                  </div>
                ))}
              </Col>
              <Col xs={12} md={6} lg={4}>
                <h4 className="border-bottom pb-2 mb-3">Total Mass Transported</h4>
                {massLeaderboard.map((entry, index) => (
                  <div className="my-2 bg-dark-subtle p-2 d-flex align-items-center gap-2" key={entry.username}>
                    <span className="me-2">{index + 1}</span>
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt="avatar"
                        className="rounded-circle me-2"
                        width={40}
                        height={40}
                      />
                    ) : null}
                    <div className="d-flex flex-wrap flex-grow-1 column-gap-1 align-items-baseline">
                      <span className="me-auto">{entry.username}</span>
                      <span className="text-success fs-6">{numberWithCommas(rounded(entry.value))} t</span>
                    </div>
                  </div>
                ))}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
