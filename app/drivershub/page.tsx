"use client"

import { Card, CardBody, CardTitle } from "react-bootstrap"
import { StartBanner, TableJobs, Dashboard } from "@/components"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import { FaUserCircle } from "react-icons/fa"
import "@/styles/Drivershub.scss"

export default function DriversHubPage() {
  return (
    <>
      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard title="Home">
            <Card className="w-100 bg-dark rounded-0 border-0 shadow">
              <CardBody className="p-4">
                <CardTitle className="text-uppercase fs-2 text-light mb-3">user jobs</CardTitle>
                <TableJobs />
              </CardBody>
            </Card>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

{
  /* <Card className="w-100 bg-dark rounded-0 border-0 shadow">
  <CardBody className="p-4">
    <CardTitle className="text-uppercase fs-2 text-light mb-3">user jobs</CardTitle>
    <TableJobs />
  </CardBody>
</Card> */
}

