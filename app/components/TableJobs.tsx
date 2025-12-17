"use client";

import { Table } from "react-bootstrap";
import { PlaceholderTable } from "@/components";
import BSButton from "@/components/ui/Button";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { useUserJobs } from "@/hooks/useUserJobs";

export default function TableJobs() {
  const {
    jobs,
    loading,
    error,
    displayPage,
    lastPage,
    showAll,
    toggleShowAll,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useUserJobs();

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
    { title: "date" },
    { title: "username" },
    { title: "game" },
    { title: "from - to" },
    { title: "cargo" },
    { title: "truck" },
    { title: "distance" },
    { title: "income" },
  ];

  if (loading) return <PlaceholderTable columns={8} rows={10} />;
  if (error) return <div className="text-danger text-center py-3">Error: {error}</div>;
  if (jobs.length === 0) return <div className="text-center py-3">No jobs found.</div>;

  return (
    <>
      <div className="table-card-scroll">
        <Table variant="dark" className="table-nowrap table-minwidth text-start" borderless>
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
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between mt-4 row-gap-4 ms-0 ms-md-4">
        {!showAll && (
          <div className="text-primary border border-light border-opacity-25 px-3 py-2 rounded-1 small">
            Showing page {displayPage} of {lastPage}
          </div>
        )}

        <div className="pagination-div d-flex flex-column flex-md-row justify-content-center align-items-center row-gap-4 column-gap-3">
          <BSButton variant="primary" onClick={toggleShowAll}>
            {showAll ? "Show Paginated" : "show all jobs"}
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
                          className={`page-link rounded-3 py-1 d-flex align-items-center ${
                            displayPage === page
                              ? "bg-primary"
                              : "bg-transparent border-0 shadow-none text-light text-opacity-50"
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
    </>
  );
}

