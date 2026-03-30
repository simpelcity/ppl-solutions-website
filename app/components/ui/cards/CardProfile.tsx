'use client'

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Container, Card, Image, Row, Col, ButtonGroup } from 'react-bootstrap'
import { BSButton, LoaderSpinner, CardProfileSkills } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { useIsAdmin } from "@/lib/useIsAdmin";
import { useAuth } from '@/lib/AuthContext'
import { useSidebar } from '@/lib/SidebarContext'

type Props = {
  params: Promise<{ userId: string }>;
  lang: Locale;
  dict: Dictionary;
}

export default function CardProfile({ params, lang, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #00fbff; font-weight: bold;", ...args);
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [notMobile, setNotMobile] = useState(false);

  useEffect(() => {
    params.then(({ userId }) => setUserId(userId));
  }, [params]);

  useEffect(() => {
    const handleResize = () => {
      setNotMobile(window.innerWidth >= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const { user } = useAuth();

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
  } = useProfile({ userId: userId ?? "", lang, dict });

  // adminLog('Current user data:', fetchedProfile)
  // adminLog('TruckersHub driver data:', driver)
  // adminLog('countryData:', countryData)
  // adminLog(user)

  if (loading) return <LoaderSpinner dict={dict} />;
  if (!loading && (!profile || Object.keys(profile).length === 0)) {
    return <p className="text-danger fw-bold">Profile not found</p>;
  }

  return (
    <>
      <Container className="p-3 d-flex flex-column row-gap-3" fluid>
        <Card className="border-0 rounded-0 shadow-sm" data-bs-theme="dark">
          <Card.Header className="p-0">
            {profile?.banner_url ? (
              <Image src={profile.banner_url} className="object-fit-cover" roundedCircle width={150} height={150} alt="Profile Picture" />
            ) : (
              <Image src="https://placehold.co/900x160" className="w-100 pfp-banner" alt="Default banner" />
            )}
          </Card.Header>
          <Card.Body className="d-flex flex-column pb-3 pb-md-0">
            <div className="d-flex pb-3 pb-md-0">
              <div className="pfp-position d-flex">
                <Image src={profile?.profile_url ?? "/assets/icons/profile-user.png"} className={`border border-5 border-dark pfp-img ${profile?.profile_url ? '' : 'bg-dark'}`} roundedCircle alt="Profile Picture" />
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
                      <span className="text-muted">• No role</span>
                    )}
                  </div>

                  {driver?.country ? (
                    <div className="d-flex align-items-center column-gap-1 p-0">
                      <Image src={countryData?.flags.png} alt={countryData?.flags.alt} height={25} className="rounded-1" />
                      <span>{driver?.country}</span>
                    </div>
                  ) : (
                    <span></span>
                  )}
                  <p className="m-0 p-0 text-muted">@{fetchedProfile?.user.user_metadata.username}</p>
                </div>

                {userId === user?.id && notMobile && (
                  <>
                    <div className="m-0 p-0">
                      <ButtonGroup className="">
                        <BSButton variant="primary" classes="rounded-end-0" href={`/drivershub/profile/${user.id}/settings`}>Settings</BSButton>
                        <BSButton variant="outline" classes="rounded-start-0" href={`/drivershub/profile/settings#change-password`}>Change Password</BSButton>
                      </ButtonGroup>
                    </div>
                  </>
                )}
              </div>
            </div>
            {!notMobile && (
              <div className="m-0 p-0">
                <ButtonGroup className="">
                  <BSButton variant="primary" classes="rounded-end-0" href={`/drivershub/profile/${user?.id}/settings`}>Settings</BSButton>
                  <BSButton variant="outline" classes="rounded-start-0" href={`/drivershub/profile/settings#change-password`}>Change Password</BSButton>
                </ButtonGroup>
              </div>
            )}
          </Card.Body>
          {error && <p className="text-danger fw-bold">{error}</p>}
        </Card >

        <CardProfileSkills params={params} lang={lang} dict={dict} />
      </Container >
    </>
  )
}
