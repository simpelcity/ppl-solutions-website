'use client'

import { Container, Table, Card, ButtonGroup, Row, Col, Button, Dropdown } from 'react-bootstrap'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BSButton, LoaderSpinner } from '@/components'
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Dictionary } from "@/app/i18n"

type Props = {
  dict: Dictionary;
}

export default function TableLeaderboard({ dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const adminError = (...args: any[]) => {
    { isAdmin && console.error(...args) };
  }

  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedPeriod, setSelectedPeriod] = useState<'all-time' | 'monthly'>('all-time');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const {
    loading,
    error,
    allTimeDistanceLeaderboard,
    monthlyDistanceLeaderboard,
    allTimeThpLeaderboard,
    monthlyThpLeaderboard,
    allTimeMassLeaderboard,
    monthlyMassLeaderboard,
    allTimeMaxThpLeaderboard,
    monthlyMaxThpLeaderboard,
    allTimeMaxDistanceLeaderboard,
    monthlyMaxDistanceLeaderboard,
    allTimeMaxMassLeaderboard,
    monthlyMaxMassLeaderboard,
    currentLeaderboard
  } = useLeaderboard(selectedPeriod, selectedYear, selectedMonth);

  adminLog(`%cCurrent Leaderboard = ${currentLeaderboard.name}:`, 'color: white;', currentLeaderboard.entries)

  const distanceLeaderboard = selectedPeriod === 'all-time' ? allTimeDistanceLeaderboard : monthlyDistanceLeaderboard;
  const thpLeaderboard = selectedPeriod === 'all-time' ? allTimeThpLeaderboard : monthlyThpLeaderboard;
  const massLeaderboard = selectedPeriod === 'all-time' ? allTimeMassLeaderboard : monthlyMassLeaderboard;

  const maxDistanceLeaderboard = selectedPeriod === 'all-time' ? allTimeMaxDistanceLeaderboard : monthlyMaxDistanceLeaderboard;
  const maxThpLeaderboard = selectedPeriod === 'all-time' ? allTimeMaxThpLeaderboard : monthlyMaxThpLeaderboard;
  const maxMassLeaderboard = selectedPeriod === 'all-time' ? allTimeMaxMassLeaderboard : monthlyMaxMassLeaderboard;

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
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;

    if (newMonth === 0) {
      newMonth = 12;
      newYear = selectedYear - 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    router.push(`?month=${newMonth}&year=${newYear}`);
  };

  const handleNextMonth = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;

    if (newMonth === 13) {
      newMonth = 1;
      newYear = selectedYear + 1;
    }

    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    router.push(`?month=${newMonth}&year=${newYear}`);
  };

  const getDateTitle = (selectedPeriod: string) => {
    if (selectedPeriod === 'monthly') {
      return `${selectedMonth} - ${selectedYear}`;
    } else {
      return 'All Time';
    }
  };

  useEffect(() => {
    const monthParam = searchParams.get('month');
    const yearParam = searchParams.get('year');

    if (monthParam && yearParam) {
      const month = parseInt(monthParam, 10);
      const year = parseInt(yearParam, 10);

      if (month >= 1 && month <= 12 && year > 0) {
        setSelectedMonth(month);
        setSelectedYear(year);
        setSelectedPeriod('monthly');
      }
    }
  }, [searchParams]);

  return (
    <>
      <Container className="my-3 p-0" fluid>
        <Card className="border-0 rounded-0 shadow" data-bs-theme="dark">
          <Card.Header className="bg-dark d-flex justify-content-between align-items-center px-4 py-3">
            <Card.Title className="m-0">Company Leaderboard</Card.Title>
            {selectedPeriod === 'monthly' ? (
              <ButtonGroup className="btn-group-leaderboard">
                <Button variant="primary" className="text-light" onClick={handlePreviousMonth} disabled={selectedYear === 2020 && selectedMonth === 0}><FaChevronLeft /></Button>
                <Dropdown as={ButtonGroup} data-bs-theme="dark">
                  <Button variant="primary" className="text-light">{monthNames[selectedMonth - 1]} {selectedYear}</Button>

                  <Dropdown.Toggle split variant="primary" className="text-light px-3" id="dropdown-split-basic" />

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => {
                      setSelectedPeriod('monthly');
                      router.push(`?month=${selectedMonth}&year=${selectedYear}`);
                    }}>Monthly</Dropdown.Item>

                    <Dropdown.Item onClick={() => {
                      setSelectedPeriod('all-time');
                      router.push(window.location.pathname);
                      window.history.replaceState(null, "", window.location.pathname);
                    }}>All Time</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="primary" className="text-light" onClick={handleNextMonth}><FaChevronRight /></Button>
              </ButtonGroup>
            ) : (
              <Dropdown as={ButtonGroup} className="btn-group-leaderboard" data-bs-theme="dark">
                <Button variant="primary" className="text-light">{getDateTitle('all-time')}</Button>

                <Dropdown.Toggle split variant="primary" className="text-light px-3" id="dropdown-split-basic" />

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => {
                    setSelectedPeriod('monthly');
                    router.push(`?month=${selectedMonth}&year=${selectedYear}`);
                  }}>Monthly</Dropdown.Item>

                  <Dropdown.Item onClick={() => {
                    setSelectedPeriod('all-time');
                    // navigate to same path without query parameters
                    router.push(window.location.pathname);
                    window.history.replaceState(null, "", window.location.pathname);
                  }}>All Time</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Card.Header>
          <Card.Body className="p-4">
            {error ? (
              <div className="text-danger text-center fw-bold py-3">{error}</div>
            ) : loading ? (
              <LoaderSpinner dict={dict} />
            ) : (
              <Row className="d-flex justify-content-center">
                <Col xs={12} md={6} lg={4} className="my-3 mt-lg-0">
                  <h4 className="border-bottom pb-2 mb-3">Total THP Earned</h4>
                  {thpLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-dark-subtle shadow-sm p-2 d-flex align-items-center gap-2" key={entry.username ?? "Guest"}>
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
                        <span className="me-auto">{entry.username ?? "Guest"}</span>
                        <span className="text-success fs-6">{numberWithCommas(rounded(entry.value ?? 0))} THP</span>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col xs={12} md={6} lg={4} className="my-3 mt-lg-0">
                  <h4 className="border-bottom pb-2 mb-3">Total Distance Driven</h4>
                  {distanceLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-dark-subtle shadow-sm p-2 d-flex align-items-center gap-2" key={entry.username ?? "Guest"}>
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
                        <span className="me-auto">{entry.username ?? "Guest"}</span>
                        <span className="text-success fs-6">{numberWithCommas(rounded(entry.value ?? 0))} km</span>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col xs={12} md={6} lg={4} className="my-3 mt-lg-0">
                  <h4 className="border-bottom pb-2 mb-3">Total Weight Transported</h4>
                  {massLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-dark-subtle shadow-sm p-2 d-flex align-items-center gap-2" key={entry.username ?? "Guest"}>
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
                        <span className="me-auto">{entry.username ?? "Guest"}</span>
                        <span className="text-success fs-6">{numberWithCommas(rounded(Math.floor((entry.value ?? 0) / 1000)))} t</span>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col xs={12} md={6} lg={4} className="my-3 mb-lg-0">
                  <h4 className="border-bottom pb-2 mb-3">Highest THP Earned</h4>
                  {maxThpLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-dark-subtle shadow-sm p-2 d-flex align-items-center gap-2" key={entry.username ?? "Guest"}>
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
                        <span className="me-auto">{entry.username ?? "Guest"}</span>
                        <span className="text-success fs-6">{numberWithCommas(rounded(entry.value ?? 0))} THP</span>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col xs={12} md={6} lg={4} className="my-3 mb-lg-0">
                  <h4 className="border-bottom pb-2 mb-3">Highest Distance Driven</h4>
                  {maxDistanceLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-dark-subtle shadow-sm p-2 d-flex align-items-center gap-2" key={entry.username ?? "Guest"}>
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
                        <span className="me-auto">{entry.username ?? "Guest"}</span>
                        <span className="text-success fs-6">{numberWithCommas(rounded(entry.value ?? 0))} km</span>
                      </div>
                    </div>
                  ))}
                </Col>
                <Col xs={12} md={6} lg={4} className="my-3 mb-lg-0">
                  <h4 className="border-bottom pb-2 mb-3">Highest Weight Transported</h4>
                  {maxMassLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-dark-subtle shadow-sm p-2 d-flex align-items-center gap-2" key={entry.username ?? "Guest"}>
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
                        <span className="me-auto">{entry.username ?? "Guest"}</span>
                        <span className="text-success fs-6">{numberWithCommas(rounded(Math.floor((entry.value ?? 0) / 1000)))} t</span>
                      </div>
                    </div>
                  ))}
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
