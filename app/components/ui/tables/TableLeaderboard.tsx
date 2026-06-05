'use client'

import { Container, Table, Card, ButtonGroup, Row, Col, Button, Dropdown } from 'react-bootstrap'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { BSButton, Loader, RateLimitError } from '@/components'
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight, FaAngleDown, FaAngleUp } from "react-icons/fa6";
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    currentLeaderboard,
    isRateLimited,
    rateLimitSecondsRemaining,
    retryLeaderboard,
  } = useLeaderboard(dict, selectedPeriod, selectedYear, selectedMonth);

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
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.jan,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.feb,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.mar,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.apr,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.may,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.jun,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.jul,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.aug,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.sep,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.oct,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.nov,
    dict.drivershub.leaderboard.card.btnGroupNavigation.monthNames.dec
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

  if (error) {
    if (isRateLimited) {
      return (
        <RateLimitError
          dict={dict}
          secondsRemaining={rateLimitSecondsRemaining ?? 0}
          onRetry={retryLeaderboard}
          retryLoading={loading}
        />
      )
    }

    return (
      <div className="d-flex align-items-center text-danger fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error}</div>
    )
  }

  return (
    <>
      <Container className="p-3 p-md-4" fluid>
        <Card className="rounded-1 border-0 shadow-sm bg-surface text-theme">
          <Card.Header className="bg-surface d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom">
            <Card.Title className="m-0 fs-3">{dict.drivershub.leaderboard.card.title}</Card.Title>
            {selectedPeriod === 'monthly' ? (
              <ButtonGroup className="btn-group-leaderboard">
                <BSButton variant="primary" className="text-light rounded-start-1 d-flex align-items-center" onClick={handlePreviousMonth} disabled={selectedYear === 2020 && selectedMonth === 0}><FaAngleLeft /></BSButton>
                <Dropdown as={ButtonGroup} id="dropdown-leaderboard" onToggle={(nextShow) => setIsDropdownOpen(Boolean(nextShow))}>
                  <BSButton variant="primary" className="text-light fw-semibold">{monthNames[selectedMonth - 1]} {selectedYear}</BSButton>

                  <Dropdown.Toggle split variant="primary" className="px-2 d-flex align-items-center text-light" id="dropdown-split-basic">
                    <span className={`px-1 chevron-rotate-180 ${isDropdownOpen ? 'is-open' : ''}`}>
                      <FaAngleDown />
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="rounded-1 border-0 shadow-sm bg-surface-darker">
                    <Dropdown.Item className="text-theme fw-semibold" onClick={() => {
                      setSelectedPeriod('monthly');
                      router.push(`?month=${selectedMonth}&year=${selectedYear}`);
                    }}>{dict.drivershub.leaderboard.card.btnGroupNavigation.monthly}</Dropdown.Item>

                    <Dropdown.Item className="text-theme fw-semibold" onClick={() => {
                      setSelectedPeriod('all-time');
                      router.push(window.location.pathname);
                      window.history.replaceState(null, "", window.location.pathname);
                    }}>{dict.drivershub.leaderboard.card.btnGroupNavigation.allTime}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <BSButton variant="primary" className="text-light rounded-end-1 d-flex align-items-center" onClick={handleNextMonth}><FaAngleRight /></BSButton>
              </ButtonGroup>
            ) : (
              <Dropdown as={ButtonGroup} id="dropdown-leaderboard" className="btn-group-leaderboard" onToggle={(nextShow) => setIsDropdownOpen(Boolean(nextShow))}>
                <BSButton variant="primary" className="text-light rounded-start-1 fw-semibold">{dict.drivershub.leaderboard.card.btnGroupNavigation.allTime}</BSButton>

                <Dropdown.Toggle split variant="primary" className="text-light px-2 rounded-end-1 d-flex align-items-center" id="dropdown-split-basic">
                  <span className={`px-1 chevron-rotate-180 ${isDropdownOpen ? 'is-open' : ''}`}>
                    <FaAngleDown />
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item className="text-theme fw-semibold" onClick={() => {
                    setSelectedPeriod('monthly');
                    router.push(`?month=${selectedMonth}&year=${selectedYear}`);
                  }}>{dict.drivershub.leaderboard.card.btnGroupNavigation.monthly}</Dropdown.Item>

                  <Dropdown.Item className="text-theme fw-semibold" onClick={() => {
                    setSelectedPeriod('all-time');
                    router.push(window.location.pathname);
                    window.history.replaceState(null, "", window.location.pathname);
                  }}>{dict.drivershub.leaderboard.card.btnGroupNavigation.allTime}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </Card.Header>
          <Card.Body className="p-3 p-md-4">
            {loading ? (
              <Loader dict={dict} />
            ) : (
              <Row className="d-flex justify-content-center row-gap-3 row-gap-md-4">
                <Col xs={12} md={6} lg={4} className="m-0">
                  <h4 className="border-bottom pb-2 mb-3">{dict.drivershub.leaderboard.card.leaderboards.totalThp.title}</h4>
                  {thpLeaderboard.length === 0 && <p className="text-warning fw-semibold fs-4">{dict.errors.leaderboard.NO_DATA}</p>}
                  {thpLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-surface-darker shadow-sm-sm p-2 d-flex align-items-center gap-2 rounded-1" key={entry.username ?? "Guest"}>
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
                <Col xs={12} md={6} lg={4} className="m-0">
                  <h4 className="border-bottom pb-2 mb-3">{dict.drivershub.leaderboard.card.leaderboards.totalDistance.title}</h4>
                  {distanceLeaderboard.length === 0 && <p className="text-warning fw-semibold fs-4">{dict.errors.leaderboard.NO_DATA}</p>}
                  {distanceLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-surface-darker shadow-sm-sm p-2 d-flex align-items-center gap-2 rounded-1" key={entry.username ?? "Guest"}>
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
                <Col xs={12} md={6} lg={4} className="m-0">
                  <h4 className="border-bottom pb-2 mb-3">{dict.drivershub.leaderboard.card.leaderboards.totalWeight.title}</h4>
                  {massLeaderboard.length === 0 && <p className="text-warning fw-semibold fs-4">{dict.errors.leaderboard.NO_DATA}</p>}
                  {massLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-surface-darker shadow-sm-sm p-2 d-flex align-items-center gap-2 rounded-1" key={entry.username ?? "Guest"}>
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
                <Col xs={12} md={6} lg={4} className="m-0">
                  <h4 className="border-bottom pb-2 mb-3">{dict.drivershub.leaderboard.card.leaderboards.maxThp.title}</h4>
                  {maxThpLeaderboard.length === 0 && <p className="text-warning fw-semibold fs-4">{dict.errors.leaderboard.NO_DATA}</p>}
                  {maxThpLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-surface-darker shadow-sm-sm p-2 d-flex align-items-center gap-2 rounded-1" key={entry.username ?? "Guest"}>
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
                <Col xs={12} md={6} lg={4} className="m-0">
                  <h4 className="border-bottom pb-2 mb-3">{dict.drivershub.leaderboard.card.leaderboards.maxDistance.title}</h4>
                  {maxDistanceLeaderboard.length === 0 && <p className="text-warning fw-semibold fs-4">{dict.errors.leaderboard.NO_DATA}</p>}
                  {maxDistanceLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-surface-darker shadow-sm-sm p-2 d-flex align-items-center gap-2 rounded-1" key={entry.username ?? "Guest"}>
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
                <Col xs={12} md={6} lg={4} className="m-0">
                  <h4 className="border-bottom pb-2 mb-3">{dict.drivershub.leaderboard.card.leaderboards.maxWeight.title}</h4>
                  {maxMassLeaderboard.length === 0 && <p className="text-warning fw-semibold fs-4">{dict.errors.leaderboard.NO_DATA}</p>}
                  {maxMassLeaderboard.map((entry, index) => (
                    <div className="my-2 bg-surface-darker shadow-sm-sm p-2 d-flex align-items-center gap-2 rounded-1" key={entry.username ?? "Guest"}>
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
