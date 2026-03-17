'use client'

import { useState, useEffect } from "react";
import { type Locale } from "@/i18n"
import { useProfile } from "@/hooks/useProfile";
import { Container, Card, Image, Row, Col } from 'react-bootstrap'
import { BSButton, LoaderSpinner } from '@/components'
import { useAuth } from '@/lib/AuthContext'
import type { Dictionary } from "@/app/i18n"
import { useIsAdmin } from "@/lib/useIsAdmin";

type Props = {
  params: Promise<{ userId: string }>;
  dict: Dictionary;
}

export default function CardProfile({ params, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log(...args);
  };

  const { user } = useAuth();
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
    steamID,
    driver,
    driverName,
  } = useProfile(userId ?? "");

  adminLog('profile:', profile)
  adminLog('fetchedProfile:', fetchedProfile)
  adminLog('driverName:', driverName)
  adminLog('steamID:', steamID)
  adminLog('driver:', driver)

  if (loading) return <LoaderSpinner dict={dict} />

  if (!profile) return <p className="text-danger fw-bold">No profile</p>;

  return (
    <>
      <Container className="my-3 p-0" fluid>
        <Card className="border-0 rounded-0 shadow" data-bs-theme="dark">
          <Card.Header className="p-0">
            {profile.banner ? (
              <Image src={profile.banner} className="object-fit-cover" roundedCircle width={150} height={150} alt="Profile Picture" />
            ) : (
              <Image src="https://placehold.co/900x160" className="w-100" alt="Default banner" />
            )}
          </Card.Header>
          <Card.Body className="d-flex">
            <div className="pfp-position d-flex">
              <Image src={profile.profile_url ?? "/assets/icons/profile-user.png"} className="border border-5 border-dark" roundedCircle width={120} height={120} alt="Profile Picture" />
            </div>
            <Row className="ms-4 d-flex flex-column">
              <h3 className="m-0 p-0">{fetchedProfile?.user.user_metadata.display_name}</h3>
            </Row>
          </Card.Body>
          {error && <p className="text-danger fw-bold">{error}</p>}
        </Card>
      </Container>
    </>
  )
}
