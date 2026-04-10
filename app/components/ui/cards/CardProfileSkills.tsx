'use client'

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card, Container, Row, Col, Image } from 'react-bootstrap'
import { BSButton, LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { useIsAdmin } from "@/lib/useIsAdmin";

type Props = {
  params: Promise<{ userId: string }>;
  dict: Dictionary;
}

type SkillsObject = {
  adr: number[];
  cost: number;
  distance: number;
  fragile: number;
  overweight: number;
  valuable: number;
}

export default function CardProfileSkills({ params, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #00ffc8; font-weight: bold;", ...args);
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
  } = useProfile({ userId: userId ?? "", dict });

  const skills = driver?.skills || {};

  const skillsObject: SkillsObject = {
    adr: skills.adr || [],
    cost: skills.cost || 0,
    distance: skills.distance || 0,
    fragile: skills.fragile || 0,
    overweight: skills.overweight || 0,
    valuable: skills.valuable || 0,
  };

  const adrClasses = [1, 2, 3, 4, 6, 8];

  const adrClassNames: { [key: number]: string } = {
    1: dict.drivershub.profile.profilePage.skillsCard.adr.classes.class1,
    2: dict.drivershub.profile.profilePage.skillsCard.adr.classes.class2,
    3: dict.drivershub.profile.profilePage.skillsCard.adr.classes.class3,
    4: dict.drivershub.profile.profilePage.skillsCard.adr.classes.class4,
    6: dict.drivershub.profile.profilePage.skillsCard.adr.classes.class6,
    8: dict.drivershub.profile.profilePage.skillsCard.adr.classes.class8,
  };

  const ownedClasses: number[] = Object.values(skillsObject.adr)

  const skillsList = [
    { id: "Skill_ADR", name: dict.drivershub.profile.profilePage.skillsCard.adr.title, desc: dict.drivershub.profile.profilePage.skillsCard.adr.description, value: skillsObject.adr },
    { id: "Skill_Long_Distance", name: dict.drivershub.profile.profilePage.skillsCard.longDistance.title, desc: dict.drivershub.profile.profilePage.skillsCard.longDistance.description, value: skillsObject.distance },
    { id: "Skill_High_Value", name: dict.drivershub.profile.profilePage.skillsCard.highValue.title, desc: dict.drivershub.profile.profilePage.skillsCard.highValue.description, value: skillsObject.valuable },
    { id: "Skill_Fragile", name: dict.drivershub.profile.profilePage.skillsCard.fragile.title, desc: dict.drivershub.profile.profilePage.skillsCard.fragile.description, value: skillsObject.fragile },
    { id: "Skill_Overweight", name: dict.drivershub.profile.profilePage.skillsCard.overweight.title, desc: dict.drivershub.profile.profilePage.skillsCard.overweight.description, value: skillsObject.overweight },
    { id: "Skill_Cost", name: dict.drivershub.profile.profilePage.skillsCard.cost.title, desc: dict.drivershub.profile.profilePage.skillsCard.cost.description, value: skillsObject.cost },
  ];

  if (loading) return <LoaderSpinner dict={dict} />;

  return (
    <>
      <Card className="border-0 rounded-0 shadow-sm" data-bs-theme="dark">
        <Card.Body className="p-4">
          <h3 className="mb-3">{dict.drivershub.profile.profilePage.skillsCard.title}</h3>
          <Container className="m-0 p-0 d-flex flex-column row-gap-2 align-items-center">
            {skillsList.map((skill, index) => (
              <Row key={index} className={`w-100 row-gap-2 row-gap-md-0 ${index !== skillsList.length - 1 ? "border-bottom border-2 border-light border-opacity-25 pb-2" : ""}`}>
                {skill.id === "Skill_ADR" ? (
                  <>
                    <Col xs={12} md={5} className="d-flex align-items-center column-gap-2">
                      <Image src={`/assets/images/skills/${skill.id}.webp`} alt={skill.name} width={65} height={65} />
                      <div className="text-start">
                        <p className="m-0">{skill.name}</p>
                        <p className="m-0 fs-6 text-muted">{skill.desc}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={7} className="d-flex align-items-center justify-content-center justify-content-md-start">
                      <Row className="w-100">
                        {adrClasses.map((adrClass) => (
                          <Col xs={2} key={adrClass} className="px-1" title={adrClassNames[adrClass]}>
                            <div className={`rounded-1 p-md-2 border border-primary skill ${ownedClasses.includes(adrClass) ? 'bg-primary' : ''}`}>
                              <Image src={`/assets/images/skills/ADR_${adrClass}.webp`} alt={`${dict.drivershub.profile.profilePage.skillsCard.adr.alt} ${adrClass}`} className="skill-level w-100 h-100" />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs={12} md={5} className="d-flex align-items-center column-gap-2">
                      <Image src={`/assets/images/skills/${skill.id}.webp`} alt={skill.name} width={65} height={65} />
                      <div className="text-start">
                        <p className="m-0">{skill.name}</p>
                        <p className="m-0 fs-6 text-muted">{skill.desc}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={7} className="d-flex align-items-center justify-content-center justify-content-md-start">
                      <Row className="w-100">
                        {[...Array(6)].map((_, i) => (
                          <Col xs={2} key={i} className="px-1" title={`${skill.name} ${dict.drivershub.profile.profilePage.skillsCard.alt} ${i + 1}`}>
                            <div className={`rounded-1 p-md-2 border border-primary skill ${i < (typeof skill.value === 'number' ? skill.value : 0) ? "bg-primary" : ""}`}>
                              <div className="skill-level w-100 h-100"></div>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            ))}
          </Container>
        </Card.Body>
      </Card>
    </>
  )
}
