"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from '@/lib'
import { type Locale } from "@/i18n"
import { useProfile } from "@/hooks/useProfile";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib";

type Props = {
  params: Promise<{ lang: Locale; userId: string }>
}

export default function CardProfileSettingsForm({ params }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #1900ff; font-weight: bold;", ...args);
  };

  const { user, session, refreshSession } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

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
    createProfile,
    fetchedProfile,
  } = useProfile(userId ?? "");

  // adminLog("Fetched profile data:", fetchedProfile)

  useEffect(() => {
    if (profile) setProfileUrl(profile.profile_url || null);
    if (fetchedProfile?.user.user_metadata.display_name) setDisplayName(fetchedProfile?.user.user_metadata.display_name);
  }, [profile, fetchedProfile]);

  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setFile(null);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await updateProfile(displayName, file ?? null);
    resetForm();
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await updateProfile(displayName, file ?? null);
    if (typeof refreshSession === "function") {
      refreshSession();
    }
    resetForm();
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <h1>Profile Settings</h1>
      <form onSubmit={handleUpdate} style={{ marginBottom: 24 }}>
        <label htmlFor="profile-picture">Upload Profile Picture:</label>
        <input type="file" id="profile-picture" accept="image/*" onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      <form onSubmit={handleUpdate}>
        <label htmlFor="display-name">Display Name:</label>
        <input type="text" id="display-name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? "Updating..." : "Update Display Name"}
        </button>
      </form>
      {profileUrl && <img src={profileUrl} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%' }} />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
