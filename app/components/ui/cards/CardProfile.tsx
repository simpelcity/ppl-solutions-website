'use client'

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Container, Card, Image, Row, Col } from 'react-bootstrap'
import { BSButton, LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { useIsAdmin } from "@/lib/useIsAdmin";

type Props = {
  params: Promise<{ userId: string }>;
  dict: Dictionary;
}

export default function CardProfile({ params, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #00fbff; font-weight: bold;", ...args);
  };

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
    countryData,
    members,
    departments,
    roles,
    memberRoles,
    loadingRoles,
  } = useProfile(userId ?? "");

  adminLog('fetchedProfile:', fetchedProfile)
  adminLog('driver:', driver)
  adminLog('countryData:', countryData)
  adminLog('members:', members)

  if (loading) return <LoaderSpinner dict={dict} />;
  if (!loading && (!profile || Object.keys(profile).length === 0)) {
    return <p className="text-danger fw-bold">No profile</p>;
  }

  return (
    <>
      <Container className="my-3 p-0" fluid>
        <Card className="border-0 rounded-0 shadow" data-bs-theme="dark">
          <Card.Header className="p-0">
            {profile?.banner_url ? (
              <Image src={profile.banner_url} className="object-fit-cover" roundedCircle width={150} height={150} alt="Profile Picture" />
            ) : (
              <Image src="https://placehold.co/900x160" className="w-100" alt="Default banner" />
            )}
          </Card.Header>
          <Card.Body className="d-flex">
            <div className="pfp-position d-flex">
              <Image src={profile?.profile_url ?? "/assets/icons/profile-user.png"} className={`border border-5 border-dark ${profile?.profile_url ? '' : 'bg-dark'}`} roundedCircle width={120} height={120} alt="Profile Picture" />
            </div>
            <Row className="ms-4 d-flex flex-column text-start">
              <h3 className="m-0 p-0">{fetchedProfile?.user.user_metadata.display_name}</h3>
              {driver?.country ? (
                <div className="d-flex align-items-center column-gap-1 p-0">
                  <Image src={countryData?.flags.png} alt={countryData?.flags.alt} height={25} className="rounded-1" />
                  <span>{driver?.country}</span>
                </div>
              ) : (
                <span></span>
              )}
              <p className="m-0 p-0 text-muted">@{fetchedProfile?.user.user_metadata.username}</p>
              {/* <Image src={ } /> */}
            </Row>
          </Card.Body>
          {error && <p className="text-danger fw-bold">{error}</p>}
        </Card>
      </Container>
    </>
  )
}
