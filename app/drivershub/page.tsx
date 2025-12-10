import { Card, CardBody, CardTitle } from "react-bootstrap"
import { StartBanner, TableJobs, Dashboard } from "@/components"
import { HiOutlineSwitchHorizontal } from "react-icons/hi"
import { FaUserCircle } from "react-icons/fa"
import "@/styles/Drivershub.scss"

export default function DriversHubPage() {
  return (
    <>
      <title>Drivershub | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Drivershub | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/drivershub" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/drivershub" />

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
