"use client";
import { useState, useEffect, type ChangeEvent } from "react";
import type { Dictionary } from "@/app/i18n"
import { useProfile } from "@/hooks/useProfile";
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from "@/lib";
import { Container, Card, Image, Form, Modal, Row, Col, Alert } from 'react-bootstrap'
import { BSButton, BSLink } from '@/components'
import { supabase } from "@/lib";
import { FileInput } from "lucide-react";

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

  const settingsDict = dict.drivershub.profile.settingsPage;


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

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  function handleCloseProfilePictureModal() {
    setShowProfilePictureModal(false);
    setPfpPreviewUrl(null);
    setFile(null);
    setProfilePictureFileError(null);
    setProfileFileName("");
  }

  function handleShowProfilePictureModal() { setShowProfilePictureModal(true) }
  
  function handleCloseBannerModal() {
    setShowBannerModal(false);
    setBannerPreviewUrl(null);
    setBannerFile(null);
    setBannerInputError(null);
    setBannerFileName("");
  }

  function handleShowBannerModal() { setShowBannerModal(true) }

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
    if (loading) return;
    const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navEntry?.type === "reload") return;
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [loading]);

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

  async function handleRemoveCurrentProfilePicture() {
    setFile(null);
    setProfilePictureFileError(null);
    setProfileFileName("");
    setPfpPreviewUrl(null);
    
    if (confirm(dict.drivershub.profile.settingsPage.modal.profilePicture.warning)) {
      try {
        await updateProfile(displayName, null, null, true);
        if (typeof refreshSession === "function") {
          refreshSession();
        }
        handleCloseProfilePictureModal();
      } catch (err: any) {
        const message = err?.message || dict.errors.UNEXPECTED;
        setProfilePictureFileError(message);
      }
    }
  }

  async function handleRemoveCurrentBanner() {
    setBannerFile(null);
    setBannerInputError(null);
    setBannerFileName("");
    setBannerPreviewUrl(null);
    
    if (confirm(dict.drivershub.profile.settingsPage.modal.banner.warning)) {
      try {
        await updateProfile(displayName, null, null, true);
        if (typeof refreshSession === "function") {
          refreshSession();
        }
        handleCloseBannerModal();
      } catch (err: any) {
        const message = err?.message || dict.errors.UNEXPECTED;
        setBannerInputError(message);
      }
    }
  }

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

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    setPasswordChanging(true);

    if (newPassword !== confirmNewPassword) {
      setPasswordError(dict.errors.resetPassword.password.PASSWORDS_MISMATCH);
      setPasswordChanging(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        email: email,
        password: newPassword
      })

      if (error) throw error;
      
      setPasswordSuccess(dict.success.updatePassword.PASSWORD_UPDATED);
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      const message = err?.message || dict.errors.UNEXPECTED;
      setPasswordError(message);
    } finally {
      setPasswordChanging(false);
    }
  }

  const pfpAlt = dict.drivershub.profile.profilePage.card.profilePictureAlt.replace("{driver}", fetchedProfile?.user.user_metadata.display_name);
  const bannerAlt = dict.drivershub.profile.profilePage.card.bannerAlt.replace("{driver}", fetchedProfile?.user.user_metadata.display_name);



  return (
    <>
      <Container className="p-3 d-flex flex-column row-gap-3" fluid>
        <Card className="border-0 rounded-0 shadow-sm p-4" data-bs-theme="dark">
          <Card.Header className="bg-dark border-0 p-0 pb-3">
            <h4 className="m-0 p-0">{settingsDict.form.accountInfo.title}</h4>
          </Card.Header>
          <Card.Body className="p-0">
            <Form onSubmit={handleUpdate} className="d-flex flex-column row-gap-3">
              <Row className="row-gap-3">
                <Col xs={12} md={5} xl={4}>
                  <Card className="bg-dark-subtle border-0 rounded-0 shadow-sm h-100">
                    <Card.Body className="d-flex flex-column align-items-center row-gap-3">
                      <Image src={profileUrl ?? "/assets/icons/profile-user.png"} className={`pfp-img object-fit-cover ${profile?.profile_url ? '' : 'bg-dark'}`} roundedCircle alt={`${profile?.profile_url ? pfpAlt : dict.drivershub.profile.profilePage.card.defaultProfilePictureAlt}`} />
                      <BSButton variant="secondary" border="primary" onClick={handleShowProfilePictureModal}>{settingsDict.form.accountInfo.pfpButton}</BSButton>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={7} xl={8}>
                  <Card className="bg-dark-subtle border-0 rounded-0 shadow-sm h-100">
                    <Card.Body className="d-flex flex-column align-items-center row-gap-3">
                      <Image src={bannerUrl ?? "https://placehold.co/900x160"} className={`pfp-banner w-100 ${profile?.banner_url ? "object-fit-cover" : ""}`} alt={profile?.banner_url ? bannerAlt : dict.drivershub.profile.profilePage.card.defaultBannerAlt} />
                      <BSButton variant="secondary" border="primary" onClick={handleShowBannerModal}>{settingsDict.form.accountInfo.bannerButton}</BSButton>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="row-gap-3">
                <Form.Group as={Col} xs={12} md={6} controlId="displayName">
                  <Form.Label className="fw-bold fs-5">{settingsDict.form.accountInfo.displayName}</Form.Label>
                  <Form.Control type="text" className="border-0 rounded-0 bg-dark-subtle shadow-sm" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder={settingsDict.form.accountInfo.displayNamePlaceholder} />
                </Form.Group>
                <Form.Group as={Col} xs={12} md={6} controlId="username">
                  <Form.Label className="fw-bold fs-5">{settingsDict.form.accountInfo.username}</Form.Label>
                  <Form.Control type="text" className="border-0 rounded-0 bg-dark-subtle shadow-sm text-gray" value={username} disabled placeholder={settingsDict.form.accountInfo.usernamePlaceholder} />
                </Form.Group>
              </Row>
              <Form.Group controlId="email">
                <Form.Label className="fw-bold fs-5">{settingsDict.form.accountInfo.email}</Form.Label>
                <Form.Control type="email" className="border-0 rounded-0 bg-dark-subtle shadow-sm" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={dict.contact.form.emailPlaceholder} />
              </Form.Group>
              <Form.Group controlId="bio">
                <Form.Label className="fw-bold fs-5">{settingsDict.form.accountInfo.bio}</Form.Label>
                <Form.Control as="textarea" rows={3} className="border-0 rounded-0 bg-dark-subtle shadow-sm" value={bio} onChange={(e) => setBio(e.target.value)} placeholder={settingsDict.form.accountInfo.bioPlaceholder} />
              </Form.Group>
              <BSButton type="submit" variant="primary" disabled={uploading || profilePictureFileError || bannerInputError} classes="align-self-start">
                {uploading ? settingsDict.form.accountInfo.uploading : settingsDict.form.accountInfo.submit}
              </BSButton>
            </Form>
          </Card.Body>
          {error && <Alert variant="danger" className="mt-3 mb-0 fw-bold" dismissible>{error}</Alert>}
          {success && <Alert variant="success" className="mt-3 mb-0 fw-bold" dismissible>{success}</Alert>}
        </Card>

        <Card className="border-0 rounded-0 shadow-sm p-4" id="change-password" data-bs-theme="dark">
          <Card.Header className="bg-dark border-0 p-0 pb-3">
            <h4 className="m-0 p-0">{settingsDict.form.changePassword.title}</h4>
          </Card.Header>
          <Card.Body className="p-0">
            <Form onSubmit={handlePasswordChange} className="d-flex flex-column row-gap-3">
              <Form.Group controlId="newPassword">
                <Form.Label className="fw-bold fs-5">{settingsDict.form.changePassword.newPassword}</Form.Label>
                <Form.Control type="password" className="border-0 rounded-0 bg-dark-subtle shadow-sm" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder={settingsDict.form.changePassword.newPasswordPlaceholder} required />
              </Form.Group>
              <Form.Group controlId="confirmNewPassword">
                <Form.Label className="fw-bold fs-5">{settingsDict.form.changePassword.newPassword}</Form.Label>
                <Form.Control type="password" className="border-0 rounded-0 bg-dark-subtle shadow-sm" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder={settingsDict.form.changePassword.confirmNewPasswordPlaceholder} required />
              </Form.Group>
              <BSButton type="submit" variant="primary" disabled={passwordChanging} classes="align-self-start">
                {passwordChanging ? settingsDict.form.changePassword.updating : settingsDict.form.changePassword.submit}
              </BSButton>
              {passwordError && <Alert variant="danger" className="fw-bold m-0" dismissible onClose={() => setPasswordError(null)}>{passwordError}</Alert>}
              {passwordSuccess && <Alert variant="success" className="fw-bold m-0" dismissible onClose={() => setPasswordSuccess(null)}>{passwordSuccess}</Alert>}
            </Form>
          </Card.Body>
        </Card>

        <Modal show={showProfilePictureModal} onHide={handleCloseProfilePictureModal}>
          <Form onSubmit={handleUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>{settingsDict.modal.profilePicture.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="d-flex justify-content-center p-3 pb-0">
                {pfpPreviewUrl ? (
                  <Image src={pfpPreviewUrl} className={`pfp-img object-fit-cover`} height={95} roundedCircle alt={pfpAlt} />
                ) : (
                  <Image src={profileUrl ?? "/assets/icons/profile-user.png"} className={`pfp-img object-fit-cover`} height={95} roundedCircle alt={pfpAlt} />
                )}
              </div>

              <Form.Group controlId="profilePicture" className="border-bottom p-3">
                <Form.Label className="fw-bold fs-5">{settingsDict.modal.profilePicture.label}</Form.Label>
                <Form.Label className="rounded-0 d-flex position-relative m-0">
                  <button className="d-block overflow-hidden position-absolute top-0 end-0 float-none border-0 m-0 bg-primary fw-bold rounded-end-1" style={{ padding: "6px 12px" }}>
                    <Form.Control className="border-0 rounded-0 opacity-0 d-block position-absolute top-0 end-0" style={{ padding: "6px 12px" }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfilePictureChange} title={profileFileName ? profileFileName : settingsDict.modal.profilePicture.placeholder} />{settingsDict.modal.profilePicture.browse}
                  </button>
                  <Form.Control className="border-0 bg-dark-subtle shadow-none d-flex rounded-start-1 rounded-end-0 fw-semibold" type="text" readOnly value={profileFileName ? profileFileName : settingsDict.modal.profilePicture.placeholder} isInvalid={!!profilePictureFileError} />
                </Form.Label>
                {profilePictureFileError && <p className="text-danger fw-bold m-0 fs-6">{profilePictureFileError}</p>}
              </Form.Group>

              <div className="d-flex justify-content-center p-3 border-bottom">
                <button type="button" className="text-danger fw-bold bg-transparent p-0 border-0 fs-5" onClick={handleRemoveCurrentProfilePicture}>{settingsDict.modal.profilePicture.remove}</button>
              </div>

              <div className="d-flex justify-content-end column-gap-2 p-3">
                <button type="button" className="bg-danger border border-danger rounded-1 fw-bold fs-5" style={{ padding: '6px 12px' }} onClick={handleCloseProfilePictureModal}>{settingsDict.modal.profilePicture.cancel}</button>
                <BSButton variant="primary" classes="text-capitalize fs-5" type="submit" disabled={uploading || profilePictureFileError}>{settingsDict.modal.profilePicture.submit}</BSButton>
              </div>
            </Modal.Body>
          </Form>
        </Modal>

        <Modal show={showBannerModal} onHide={handleCloseBannerModal}>
          <Form onSubmit={handleUpdate}>
            <Modal.Header closeButton>
              <Modal.Title>{settingsDict.modal.banner.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-0">
              <div className="d-flex justify-content-center p-3 pb-0">
                {bannerPreviewUrl ? (
                  <Image src={bannerPreviewUrl} className={`pfp-banner object-fit-cover w-100`} alt={bannerAlt} />
                ) : (
                  <Image src={bannerUrl ?? "https://placehold.co/900x160"} className={`pfp-banner w-100 ${profile?.banner_url ? "object-fit-cover" : ""}`} alt={bannerAlt} />
                )}
              </div>

              <Form.Group controlId="profileBanner" className="border-bottom p-3">
                <Form.Label className="fw-bold fs-5">{settingsDict.modal.banner.label}</Form.Label>
                <Form.Label className="rounded-0 d-flex position-relative m-0">
                  <button className="d-block overflow-hidden position-absolute top-0 end-0 float-none border-0 m-0 bg-primary fw-bold rounded-0" style={{ padding: "6px 12px" }}>
                    <Form.Control className="border-0 rounded-0 opacity-0 d-block position-absolute top-0 end-0" style={{ padding: "6px 12px" }} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleBannerChange} title={bannerFileName ? bannerFileName : settingsDict.modal.profilePicture.placeholder} />{settingsDict.modal.profilePicture.browse}
                  </button>
                  <Form.Control className="border-0 bg-dark-subtle shadow-none d-flex rounded-0 fw-semibold" type="text" readOnly value={bannerFileName ? bannerFileName : settingsDict.modal.profilePicture.placeholder} isInvalid={!!bannerInputError} />
                </Form.Label>
                {bannerInputError && <p className="text-danger fw-bold m-0 fs-6">{bannerInputError}</p>}
              </Form.Group>

              <div className="d-flex justify-content-center p-3 border-bottom">
                <button type="button" className="text-danger fw-bold bg-transparent p-0 border-0 fs-5" onClick={handleRemoveCurrentBanner}>{settingsDict.modal.banner.remove}</button>
              </div>

              <div className="d-flex justify-content-end column-gap-2 p-3">
                <button type="button" className="bg-danger border border-danger rounded-1 fw-bold fs-5" style={{ padding: '6px 12px' }} onClick={handleCloseBannerModal}>{settingsDict.modal.banner.cancel}</button>
                <BSButton variant="primary" classes="text-capitalize fs-5" type="submit" disabled={uploading || bannerInputError}>{settingsDict.modal.banner.submit}</BSButton>
              </div>
            </Modal.Body>
          </Form>
        </Modal>
      </Container>
    </>
  );
}
