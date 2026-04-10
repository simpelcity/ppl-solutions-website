"use client";
import { useState, useRef, useEffect } from "react";
import { supabase } from '@/lib'
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { useProfile } from "@/hooks/useProfile";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib";

type Props = {
  params: Promise<{ userId: string }>
  dict: Dictionary;
}

export default function CardProfileSettingsForm({ params, dict }: Props) {
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
  } = useProfile({ userId: userId ?? "", dict });
  adminLog(profile)

  // adminLog("Fetched profile data:", fetchedProfile)

  useEffect(() => {
    // if (profile) setProfileUrl(profile.profile_url || null);
    // if (profile) setBannerUrl(profile.banner_url || null);
    if (fetchedProfile?.user.user_metadata.display_name) setDisplayName(fetchedProfile?.user.user_metadata.display_name);
  }, [profile, fetchedProfile, profileUrl, bannerUrl]);

  const [file, setFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const resetForm = () => {
    setFile(null);
    setBannerFile(null);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await updateProfile(displayName, file ?? null, bannerFile ?? null);
    if (typeof refreshSession === "function") {
      refreshSession();
    }
    resetForm();
  }


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    await updateProfile(displayName, file ?? null, bannerFile ?? null);
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
      <form onSubmit={handleUpdate} style={{ marginTop: 24 }}>
        <label htmlFor="profile-banner">Upload Banner:</label>
        <input type="file" id="profile-banner" accept="image/*" onChange={(e) => setBannerFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <button type="submit" disabled={uploading} style={{ marginLeft: 8 }}>
          {uploading ? "Uploading..." : "Upload Banner"}
        </button>
      </form>
      {displayName && <p>Current Display Name: {displayName}</p>}
      {profileUrl && <img src={profileUrl} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%' }} />}
      {bannerUrl && <img src={bannerUrl} alt="Banner" style={{ width: '100%', height: 200, objectFit: 'cover', marginTop: 16 }} />}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
