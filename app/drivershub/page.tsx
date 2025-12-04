"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { Container, Row, Col, Card, CardImg, CardBody, CardTitle } from "react-bootstrap"
import { StartBanner, TableJobs } from "@/components"
import "@/styles/Drivershub.scss"

export default function DriversHubPage() {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push("/login")
    }
  }, [session, loading, router])

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  if (!session) {
    return null
  }

  const username = (session as any).user?.user_metadata?.username || session.user.email
  const email = (session as any).user?.email || session.user.email

  return (
    <>
      <main className="fs-5">
        <StartBanner>drivershub</StartBanner>
        <section className="d-flex w-100 bg-dark-subtle text-center text-light">
          <Container className="d-flex flex-column align-items-center justify-content-center my-5 scroll" fluid>
            <div>
              <h2>Welcome back, {username}</h2>
              <p>Email: {email}</p>
            </div>
            <Card className="w-100 bg-dark rounded-0 border-0 shadow">
              <CardBody>
                <CardTitle className="text-uppercase fs-2">user jobs</CardTitle>
                <TableJobs />
              </CardBody>
            </Card>
          </Container>
        </section>
      </main>
    </>
  )
}

