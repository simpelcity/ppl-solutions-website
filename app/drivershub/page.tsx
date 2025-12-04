"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import ProfilePictureUpload from "@/components/ProfilePictureUpload"

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

  return (
    <div className="p-4">
      <h1>Drivers Hub</h1>
      <p>Welcome, {username}</p>
      <ProfilePictureUpload onUploaded={(url) => console.log("uploaded", url)} />
    </div>
  )
}
