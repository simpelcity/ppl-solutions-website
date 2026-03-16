'use client'

import { useState, useEffect } from "react";
import { type Locale } from "@/i18n"
import { useProfile } from "@/hooks/useProfile";
import { Container, Card, Image, Row, Col } from 'react-bootstrap'
import { BSButton } from '@/components'
import { useAuth } from '@/lib/AuthContext'

type Props = {
  params: Promise<{ lang: Locale; userId: string }>
}

export default function CardProfile({ params }: Props) {
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
    fetchedProfile
  } = useProfile(userId ?? "");

  console.log(profile)
  console.log(fetchedProfile)

  if (!profile) return null;

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
            <Row className="mt-5">
              <h3 className="m-0 p-0 h-50">{fetchedProfile?.user.user_metadata.display_name}</h3>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </>
  )
}
