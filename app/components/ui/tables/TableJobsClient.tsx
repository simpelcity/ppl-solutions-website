"use client";

import { Table, Card, CardBody, CardTitle, Container } from "react-bootstrap";
import { PlaceholderTable, BSButton } from "@/components";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useUserJobs } from "@/hooks/useUserJobs";
import { useIsAdmin } from "@/lib/useIsAdmin";
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type Props = {
  dict: Dictionary;
  lang: Locale;
}

export default function TableJobsClient({ lang, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const {
    jobs,
    driver,
    driverName,
    loading,
    error,
    displayPage,
    lastPage,
    showAll,
    toggleShowAll,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useUserJobs(dict);

  const split = dict.drivershub.jobs.table.navigation.showing.split(" ");

  let showingText = '';
  if (lang === 'en') {
    showingText = `${split[0]} ${split[1]} ${displayPage} ${split[3]} ${lastPage}`;
  } else if (lang === 'nl') {
    showingText = `${split[0]} ${displayPage} ${split[2]} ${lastPage} ${split[4]} ${split[5]}`;
  } else if (lang === 'cs') {
    showingText = `${split[0]} ${split[1]} ${split[2]} ${displayPage} ${split[4]} ${lastPage}`;
  } else if (lang === 'sk') {
    showingText = `${split[0]} ${split[1]} ${split[2]} ${displayPage} ${split[4]} ${lastPage}`;
  }


  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) pages.push(i);
    } else {
      if (displayPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(lastPage);
      } else if (displayPage >= lastPage - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = lastPage - 3; i <= lastPage; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(displayPage - 1);
        pages.push(displayPage);
        pages.push(displayPage + 1);
        pages.push("...");
        pages.push(lastPage);
      }
    }
    return pages;
  };

  const formatDate = (date: number) => {
    return new Date(date).toLocaleDateString("nl-NL", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const tableItems = [
    { title: dict.drivershub.jobs.table.date },
    { title: dict.drivershub.jobs.table.username },
    { title: dict.drivershub.jobs.table.game },
    { title: dict.drivershub.jobs.table.fromTo },
    { title: dict.drivershub.jobs.table.cargo },
    { title: dict.drivershub.jobs.table.truck },
    { title: dict.drivershub.jobs.table.distance },
    { title: dict.drivershub.jobs.table.income },
  ];

  if (!loading) {
    if (error) return <div className="d-flex align-items-center text-danger fw-bold">{dict.errors.GENERAL_ERROR}: {error}</div>;
    if (jobs.length === 0) return <div className="text-danger text-center py-3">{dict.errors.jobs.NO_JOBS}</div>;
  }

  return (
    <>
      <Container className="p-3" fluid>
        <Card className="bg-dark rounded-0 border-0 shadow-sm">
          <CardBody className="p-4">
            <CardTitle className="text-uppercase fs-2 text-light mb-3">{dict.drivershub.jobs.title}</CardTitle>
            {loading ? (
              <PlaceholderTable columns={8} rows={10} />
            ) : (
              <div className="table-card-scroll">
                <Table variant="dark" className="text-start table-jobs" borderless>
                  <thead className="">
                    <tr className="text-uppercase">
                      {tableItems.map((item) => (
                        <th key={item.title} className="bg-primary px-4 py-2">
                          {item.title}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job.jobID} className="border-0">
                        <td className="px-4 py-2">{formatDate(job.realtime?.end ?? Date.now())}</td>
                        <td className="px-4 py-2">{job.driver?.username ?? "—"}</td>
                        <td className="text-uppercase px-4 py-2">{job.game?.id ?? "—"}</td>
                        <td className="px-4 py-2">
                          {job.source?.city?.name ?? "—"} - {job.destination?.city?.name ?? "—"}
                        </td>
                        <td className="px-4 py-2">
                          {job.cargo?.name ?? "—"} ({Math.floor((job.cargo?.mass ?? 0) / 1000)}t)
                        </td>
                        <td className="px-4 py-2">
                          {job.truck?.name ?? "—"} {job.truck?.model?.name ?? ""}
                        </td>
                        <td className="px-4 py-2">{job.distanceDriven ?? "—"} km</td>
                        <td className="px-4 py-2">€ {job.income ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between mt-4 row-gap-4 ms-0 ms-md-4">
              {!showAll && (
                <div className="text-primary border border-light border-opacity-25 px-3 py-2 rounded-1 small">
                  {showingText}
                </div>
              )}

              <div className="pagination-div d-flex flex-column flex-md-row justify-content-center align-items-center row-gap-4 column-gap-3">
                <BSButton variant="primary" onClick={toggleShowAll}>
                  {showAll ? `${dict.drivershub.jobs.table.navigation.paginated}` : `${dict.drivershub.jobs.table.navigation.allJobs}`}
                </BSButton>
                {!showAll && lastPage > 1 && (
                  <div className="d-flex justify-content-center align-items-center column-gap-1">
                    <button
                      className="p-1 btn btn-pagination d-flex align-items-center text-light border-0 rounded-3 bg-light bg-opacity-25"
                      onClick={goToPreviousPage}
                      disabled={displayPage === 1}>
                      <MdNavigateBefore className="fs-4" />
                    </button>

                    <nav aria-label="Job pages">
                      <ul className="pagination mb-0 column-gap-1">
                        {getPageNumbers().map((page, idx) =>
                          page === "..." ? (
                            <li key={`ellipsis-${idx}`} className="page-item disabled">
                              <span className="page-link bg-transparent py-1 d-flex align-items-center border-0 text-light text-opacity-50">
                                …
                              </span>
                            </li>
                          ) : (
                            <li
                              key={`page-${page}`}
                              className={`page-item d-flex align-items-center ${displayPage === page ? "active" : ""}`}>
                              <button
                                className={`page-link rounded-3 py-1 d-flex align-items-center ${displayPage === page
                                  ? "bg-primary"
                                  : "bg-transparent border-0 shadow-sm-none text-light text-opacity-50"
                                  }`}
                                onClick={() => goToPage(page as number)}
                                disabled={displayPage === page}>
                                {page}
                              </button>
                            </li>
                          )
                        )}
                      </ul>
                    </nav>

                    <button
                      className="p-1 btn btn-pagination d-flex align-items-center text-light border-0 rounded-3 bg-light bg-opacity-25"
                      onClick={goToNextPage}
                      disabled={displayPage === lastPage}>
                      <MdNavigateNext className="fs-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
      </Container>
    </>
  );
}