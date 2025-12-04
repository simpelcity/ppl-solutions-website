// app/components/ProfilePictureUpload.tsx
"use client"

import React, { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function ProfilePictureUpload({ onUploaded }: { onUploaded?: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = async (file: File | null) => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const sess = await supabase.auth.getSession()
      const user = sess.data.session?.user
      if (!user) throw new Error("Not authenticated")

      const filePath = `avatars/${user.id}/${Date.now()}_${file.name}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { cacheControl: "3600", upsert: true })
      if (uploadError) throw uploadError

      // Call server to update profile with service role
      const token = sess.data.session?.access_token
      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ path: filePath }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Failed to save avatar")

      const avatarUrl = json.avatar_url

      // update auth user metadata for immediate client reflect (optional)
      try {
        await supabase.auth.updateUser({ data: { avatar_url: avatarUrl } })
      } catch (e) {
        // ignore
      }

      if (onUploaded) onUploaded(avatarUrl)
    } catch (e: any) {
      setError(e?.message ?? "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label htmlFor="avatar-upload" className="btn btn-outline-secondary">
        {uploading ? "Uploading..." : "Upload/Change avatar"}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        style={{ display: "none" }}
      />
      {error && <div className="text-danger mt-2">{error}</div>}
    </div>
  )
}
