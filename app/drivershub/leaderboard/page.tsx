import { Dashboard } from "@/components/"
import "@/styles/Drivershub.scss"

export default function ProfilePage() {
  return (
    <>
      <title>Leaderboard | PPL Solutions</title>
      <meta
        name="description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Leaderboard | PPL Solutions" />
      <meta
        property="og:description"
        content="PPL Solutions was founded on 7 September 2024, by Wietsegaming and MaleklecoCZE with the goal to make a
              succesful and friendly VTC where people from all over the world can hangout and drive with eachother."
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/drivershub/leaderboard" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/drivershub/leaderboard" />

      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard>
            <h1>Leaderboard</h1>
          </Dashboard>
        </section>
      </main>
    </>
  )
}

