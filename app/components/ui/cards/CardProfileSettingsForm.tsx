"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from '@/lib'
import { type Locale } from "@/i18n"
import { useProfile } from "@/hooks/useProfile";

type Props = {
  params: Promise<{ lang: Locale; userId: string }>
}

export default function CardProfileSettingsForm({ params }: Props) {
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  // Get userId from params
  const [userId, setUserId] = useState<string | null>(null);

  // You may want to fetch user data here with useEffect if needed
  // For brevity, skipping initial fetch
  useEffect(() => {
    params.then(({ userId }) => setUserId(userId));
  }, [params]);

  const {
    profile,
    loading,
    error,
    success,
    submitting,
    updateProfile,
    createProfile
  } = useProfile(userId ?? "");
  // console.log(profile)

  useEffect(() => {
    if (profile) {
      setProfileUrl(profile.profile_url || null);
    }
  })

  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setFile(null);
    setUploading(false);
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    if (!file) {
      setUploading(false);
      return;
    }
    await updateProfile(file);
    resetForm();
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h1>Profile Settings</h1>
      <form onSubmit={handleUpload} style={{ marginBottom: 24 }}>
        <label htmlFor="profile-picture">Upload Profile Picture:</label>
        <input type="file" id="profile-picture" accept="image/*" onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {profileUrl && <img src={profileUrl} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%' }} />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
