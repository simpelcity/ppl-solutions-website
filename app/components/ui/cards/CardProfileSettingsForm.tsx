"use client";
import { useState, useEffect } from "react";
import type { Dictionary } from "@/app/i18n"
import { useProfile } from "@/hooks/useProfile";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib";
import { Container, Card, Image, Form, Modal, Row, Col } from 'react-bootstrap'
import { BSButton } from '@/components'

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
    driver,
    countryData,
    memberRoles,
  } = useProfile({ userId: userId ?? "", dict });

  // adminLog("Fetched profile data:", fetchedProfile)

  useEffect(() => {
    if (profile) setProfileUrl(profile.profile_url || null);
    if (profile) setBannerUrl(profile.banner_url || null);
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

  const pfpAlt = dict.drivershub.profile.profilePage.card.profilePictureAlt.replace("{driver}", fetchedProfile?.user.user_metadata.display_name);
  const bannerAlt = dict.drivershub.profile.profilePage.card.bannerAlt.replace("{driver}", fetchedProfile?.user.user_metadata.display_name);

  return (
    <>
      <Container className="p-3 d-flex flex-column row-gap-3" fluid>
        <Row>
          <Col xs={12} md={6}>
            <Card className="border-0 rounded-0 shadow-sm h-100" data-bs-theme="dark">
              <Card.Header>
                <h4 className="m-0 p-0">Profile Settings</h4>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleUpdate} className="d-flex flex-column row-gap-3">
                  <Form.Group controlId="displayName">
                    <Form.Label>Display Name:</Form.Label>
                    <Form.Control type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={`Your_display_name`} />
                  </Form.Group>
                  <Form.Group controlId="profilePicture">
                    <Form.Label>Upload Profile Picture:</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
                  </Form.Group>
                  <Form.Group controlId="profileBanner">
                    <Form.Label>Upload Banner:</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={(e) => setBannerFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
                  </Form.Group>
                  <BSButton type="submit" variant="primary" disabled={uploading} className="align-self-start">
                    {uploading ? "Uploading..." : "Update Profile"}
                  </BSButton>
                </Form>
              </Card.Body>
              {error && <p className="text-danger fw-bold">{error}</p>}
              {success && <p className="text-success fw-bold">{success}</p>}
            </Card>
          </Col>
          
          <Col xs={12} md={6}>
            <Card className="border-0 rounded-0 shadow-sm" data-bs-theme="dark">
              <Card.Header className="p-0">
                <Image src={bannerUrl ?? "https://placehold.co/900x160"} className={`${profile?.banner_url ? "object-fit-cover w-100" : "w-100 pfp-banner"}`} height={160} alt={profile?.banner_url ? bannerAlt : dict.drivershub.profile.profilePage.card.defaultBannerAlt} />
              </Card.Header>
              <Card.Body className="d-flex flex-column pb-3 pb-md-0">
                <div className="d-flex pb-3 pb-md-0">
                  <div className="pfp-position d-flex">
                    <Image src={profileUrl ?? "/assets/icons/profile-user.png"} className={`border border-5 border-dark pfp-img ${profile?.profile_url ? '' : 'bg-dark'}`} roundedCircle alt={`${profile?.profile_url ? pfpAlt : dict.drivershub.profile.profilePage.card.profilePictureAlt}`} />
                  </div>
                  <div className="ms-2 ms-md-4 d-flex flex-column flex-md-row text-start row-gap-4 column-gap-md-4">
                    <div className="m-0 p-0">
                      <div className="d-flex column-gap-2 align-items-center">
                        <h3 className="m-0 p-0">{fetchedProfile?.user.user_metadata.display_name}</h3>
                        {memberRoles[0] ? (
                          <>
                            <span className="text-muted">•</span>
                            <p className={`m-0 p-0 ${memberRoles[0]?.role.code}`}>{memberRoles[0]?.role.name}</p>
                          </>
                        ) : (
                          <span className="text-muted">• {dict.errors.profile.NO_ROLE}</span>
                        )}
                      </div>

                      {driver?.country && (
                        <div className="d-flex align-items-center column-gap-1 p-0">
                          <Image src={countryData?.flags.png} alt={countryData?.flags.alt} height={25} className="rounded-1" />
                          <span>{driver?.country}</span>
                        </div>
                      )}
                      <p className="m-0 p-0 text-muted">@{fetchedProfile?.user.user_metadata.username}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
              {error && <p className="text-danger fw-bold">{error}</p>}
            </Card >
          </Col>
        </Row>
      </Container>
      {/* <div className="">
        <Image src={profile?.profile_url ?? "/assets/icons/profile-user.png"} className={`border border-5 border-dark pfp-img ${profile?.profile_url ? '' : 'bg-dark'}`} roundedCircle alt={profile?.profile_url ? pfpAlt : dict.drivershub.profile.profilePage.card.profilePictureAlt} />
      </div>
      <div className="">
        <Image src={profile?.banner_url ?? "https://placehold.co/900x160"} className={`${profile?.banner_url ? "object-fit-cover w-100" : "w-100 pfp-banner"}`} height={160} alt={profile?.banner_url ? bannerAlt : dict.drivershub.profile.profilePage.card.defaultBannerAlt} />
      </div> */}
      {/* <div className="d-flex flex-column align-items-center">
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
        {profileUrl && <img src={profileUrl} alt="Profile" style={{ width: 120, height: 120, borderRadius: '50%' }} />}
        {bannerUrl && <img src={bannerUrl} alt="Banner" style={{ width: '100%', height: 200, objectFit: 'cover', marginTop: 16 }} />}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div> */}
    </>
  );
}
