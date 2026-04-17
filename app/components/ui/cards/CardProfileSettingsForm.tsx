"use client";
import { useState, useEffect, type ChangeEvent } from "react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

export default function CardProfileSettingsForm({ params, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #1900ff; font-weight: bold;", ...args);
  };

  const { user, session, refreshSession } = useAuth();


  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePictureFileError, setProfilePictureFileError] = useState<string | null>(null);
  const [bannerInputError, setBannerInputError] = useState<string | null>(null);
  const [profileFileName, setProfileFileName] = useState<string>("");
  const [bannerFileName, setBannerFileName] = useState<string>("");

  const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);

  const [pfpPreviewUrl, setPfpPreviewUrl] = useState<string | null>(null);
  const [bannerPreviewUrl, setBannerPreviewUrl] = useState<string | null>(null);

  const handleCloseProfilePictureModal = () => setShowProfilePictureModal(false);
  const handleShowProfilePictureModal = () => setShowProfilePictureModal(true);
  
  const handleCloseBannerModal = () => setShowBannerModal(false);
  const handleShowBannerModal = () => setShowBannerModal(true);

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
    if (fetchedProfile?.user.user_metadata.username) setUsername(fetchedProfile?.user.user_metadata.username);
    if (fetchedProfile?.user.email) setEmail(fetchedProfile?.user.email);
    if (fetchedProfile?.bio) setBio(fetchedProfile?.bio);
  }, [profile, fetchedProfile, profileUrl, bannerUrl]);

  function validateImageFile(file: File) {
    if (file.size > MAX_FILE_SIZE) {
      return dict.errors.files.FILE_TOO_LARGE;
    }
  
    if (!ALLOWED_TYPES.includes(file.type)) {
      return dict.errors.files.INVALID_FILE_TYPE;
    }
  
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return dict.errors.files.INVALID_FILE_EXTENSION;
    }
  
    return null;
  }

  function handleProfilePictureChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setFile(null);
      setProfilePictureFileError(null);
      return;
    }

    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      setFile(null);
      setProfilePictureFileError(validationError);
      return;
    }

    const preview = URL.createObjectURL(selectedFile);
    setPfpPreviewUrl(preview);

    setProfilePictureFileError(null);
    setFile(selectedFile);
    setProfileFileName(selectedFile.name);
  };

  function handleBannerChange(e: ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] ?? null;

    if (!selectedFile) {
      setBannerFile(null);
      setBannerInputError(null);
      return;
    }

    const validationError = validateImageFile(selectedFile);
    if (validationError) {
      setBannerFile(null);
      setBannerInputError(validationError);
      return;
    }

    const preview = URL.createObjectURL(selectedFile);
    setBannerPreviewUrl(preview);

    setBannerInputError(null);
    setBannerFile(selectedFile);
    setBannerFileName(selectedFile.name);
  };

  function resetForm() {
    setFile(null);
    setBannerFile(null);
    setProfileFileName("");
    setBannerFileName("");
    setProfilePictureFileError(null);
    setBannerInputError(null);
    setUploading(false);
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    setProfilePictureFileError(null);
    setBannerInputError(null);

    try {
      await updateProfile(displayName, file ?? null, bannerFile ?? null);
      if (typeof refreshSession === "function") {
        refreshSession();
      }

      handleCloseProfilePictureModal();
      handleCloseBannerModal();
      resetForm();
    } catch (err: any) {
      const message = err?.message || dict.errors.UNEXPECTED;

      if (bannerFile) {
        setBannerInputError(message);
      } else if (file) {
        setProfilePictureFileError(message);
      }
    } finally {
      setUploading(false);
    }
  }

  const pfpAlt = dict.drivershub.profile.profilePage.card.profilePictureAlt.replace("{driver}", fetchedProfile?.user.user_metadata.display_name);
  const bannerAlt = dict.drivershub.profile.profilePage.card.bannerAlt.replace("{driver}", fetchedProfile?.user.user_metadata.display_name);

  return (
    <>
      <Container className="p-3" fluid>
        <Card className="border-0 rounded-0 shadow-sm p-4" data-bs-theme="dark">
          <Card.Header className="bg-dark border-0 p-0 pb-3">
            <h4 className="m-0 p-0">Account Info</h4>
          </Card.Header>
          <Card.Body className="p-0">
            <Form onSubmit={handleUpdate} className="d-flex flex-column row-gap-3">
              <Row>
                {/* <Form.Group as={Col} controlId="profilePicture">
                  <Form.Label>Profile Picture</Form.Label>
                  <Form.Control type="file" className="border-0 rounded-0 bg-dark-subtle shadow-sm" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfilePictureChange} isInvalid={!!profilePictureFileError} />
                  {profilePictureFileError && <p className="text-danger fw-bold m-0 fs-6">{profilePictureFileError}</p>}
                </Form.Group>
                <Form.Group as={Col} controlId="profileBanner">
                  <Form.Label>Profile Banner</Form.Label>
                  <Form.Control type="file" className="border-0 rounded-0 bg-dark-subtle shadow-sm" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleBannerChange} isInvalid={!!bannerInputError} />
                  {bannerInputError && <p className="text-danger fw-bold m-0">{bannerInputError}</p>}
                </Form.Group> */}
                <Col xs={12} md={5} xl={4}>
                  <Card className="bg-dark-subtle border-0 rounded-0 shadow-sm h-100">
                    <Card.Body className="d-flex flex-column align-items-center row-gap-3">
                      <Image src={profileUrl ?? "/assets/icons/profile-user.png"} className={`pfp-img object-fit-cover ${profile?.profile_url ? '' : 'bg-dark'}`} height={95} roundedCircle alt={`${profile?.profile_url ? pfpAlt : dict.drivershub.profile.profilePage.card.profilePictureAlt}`} />
                      <BSButton variant="primary" onClick={handleShowProfilePictureModal}>Change photo</BSButton>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={7} xl={8}>
                  <Card className="bg-dark-subtle border-0 rounded-0 shadow-sm h-100">
                    <Card.Body className="d-flex flex-column align-items-center row-gap-3">
                      <Image src={bannerUrl ?? "https://placehold.co/900x160"} className={`pfp-banner w-100 ${profile?.banner_url ? "object-fit-cover" : ""}`} alt={profile?.banner_url ? bannerAlt : dict.drivershub.profile.profilePage.card.defaultBannerAlt} />
                      <BSButton variant="primary" onClick={handleShowBannerModal}>Change banner</BSButton>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Form.Group controlId="displayName">
                <Form.Label>Display Name</Form.Label>
                <Form.Control type="text" className="border-0 rounded-0 bg-dark-subtle shadow-sm" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" className="border-0 rounded-0 bg-dark-subtle shadow-sm"  />
              </Form.Group>
              <BSButton type="submit" variant="primary" disabled={uploading || profilePictureFileError || bannerInputError} className="align-self-start">
                {uploading ? "Uploading..." : "Update Profile"}
              </BSButton>
            </Form>
          </Card.Body>
          {error && <p className="text-danger fw-bold">{error}</p>}
          {success && <p className="text-success fw-bold">{success}</p>}
        </Card>

        <Modal show={showProfilePictureModal} onHide={handleCloseProfilePictureModal}>
          <Form onSubmit={handleUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>Change Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="d-flex justify-content-center p-3">
                <Image src={pfpPreviewUrl || ""} className={`pfp-img object-fit-cover`} height={95} roundedCircle alt={dict.drivershub.profile.profilePage.card.profilePictureAlt} />
              </div>
              <Form.Group controlId="profilePicture" className="border-bottom p-3">
                <Form.Label>Upload Picture</Form.Label>
                <Form.Control type="file" className="border-0 rounded-0 bg-dark-subtle shadow-sm" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfilePictureChange} isInvalid={!!profilePictureFileError} />
                {profilePictureFileError && <p className="text-danger fw-bold m-0 fs-6">{profilePictureFileError}</p>}
              </Form.Group>
              <div className="d-flex justify-content-center p-3 border-bottom">
                <button type="button" className="text-danger fw-bold bg-transparent p-0 border-0 fs-5">Remove Current Photo</button>
              </div>
              <div className="d-flex justify-content-end column-gap-2 p-3">
                <button type="button" className="bg-danger border border-danger rounded-1 fw-bold fs-5" style={{ padding: '6px 12px' }} onClick={handleCloseProfilePictureModal}>Cancel</button>
                <BSButton variant="primary" classes="text-capitalize fs-5" type="submit" disabled={uploading || profilePictureFileError}>Save changes</BSButton>
              </div>
            </Modal.Body>
          </Form>
        </Modal>

        <Modal show={showBannerModal} onHide={handleCloseBannerModal}>
          <Form onSubmit={handleUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>Change Profile Banner</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <Form.Group controlId="profileBanner" className="border-bottom p-3">
                <Form.Label>Upload Banner</Form.Label>
                <Form.Control type="file" className="border-0 rounded-0 bg-dark-subtle shadow-sm" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleBannerChange} isInvalid={!!bannerInputError} />
                {bannerInputError && <p className="text-danger fw-bold m-0 fs-6">{bannerInputError}</p>}
              </Form.Group>
              <div className="d-flex justify-content-center p-3 border-bottom">
                <button type="button" className="text-danger fw-bold bg-transparent p-0 border-0 fs-5">Remove Current Banner</button>
              </div>
              <div className="d-flex justify-content-end column-gap-2 p-3">
                <button type="button" className="bg-danger border border-danger rounded-1 fw-bold fs-5" style={{ padding: '6px 12px' }} onClick={handleCloseBannerModal}>Cancel</button>
                <BSButton variant="primary" classes="text-capitalize fs-5" type="submit" disabled={uploading || bannerInputError}>Save changes</BSButton>
              </div>
            </Modal.Body>
          </Form>
        </Modal>
      </Container>
    </>
  );
}
