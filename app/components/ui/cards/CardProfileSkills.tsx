'use client'

import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Card, Container, Row, Col, Image } from 'react-bootstrap'
import { BSButton, LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"
import { useIsAdmin } from "@/lib/useIsAdmin";

type Props = {
  params: Promise<{ userId: string }>;
  lang: Locale;
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

export default function CardProfileSkills({ params, lang, dict }: Props) {
  const isAdmin = useIsAdmin();

  const adminLog = (...args: any[]) => {
    if (isAdmin) console.log("%c[ADMIN]", "color: #00ffc8; font-weight: bold;", ...args);
  };

  const [userId, setUserId] = useState<string | null>(null);
  const [userAdr, setUserAdr] = useState<{ [key: number]: number }>({});

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
  } = useProfile({ userId: userId ?? "", lang, dict });

  adminLog('TruckersHub driver data:', driver)

  const skills = driver?.skills || {};

  const skillsObject: SkillsObject = {
    adr: skills.adr || [],
    cost: skills.cost || 0,
    distance: skills.distance || 0,
    fragile: skills.fragile || 0,
    overweight: skills.overweight || 0,
    valuable: skills.valuable || 0,
  };

  // useEffect(() => {
  //   setUserAdr(skillsObject.adr);
  // }, [skillsObject.adr]);
  // adminLog('Updated user ADR skills state:', userAdr);

  const adrClasses = [1, 2, 3, 4, 6, 8];

  const adrClassNames: { [key: number]: string } = {
    1: "Class 1 - Explosives",
    2: "Class 2 - Gases",
    3: "Class 3 - Flammable liquids",
    4: "Class 4: Flammable Solids",
    6: "Class 6 - Toxic and infectious substances",
    8: "Class 8 - Corrosive substances ",
  };

  const ownedClasses: number[] = Object.values(skillsObject.adr)

  const skillsList = [
    { id: "Skill_ADR", name: "ADR Cargo", desc: "Get trained to Drive Dangerous goods and gain extra points and income.", value: skillsObject.adr },
    { id: "Skill_Long_Distance", name: "Long Distance Bonus", desc: "Upgrading this skill help you gain bonus based on Distance.", value: skillsObject.distance },
    { id: "Skill_High_Value", name: "High Value Cargo", desc: "Upgrading this skill help you gain bonus based on Valuable Cargo.", value: skillsObject.valuable },
    { id: "Skill_Fragile", name: "Fragile Cargo Bonus", desc: "Upgrading this skill help you gain bonus based on Cargo Fragility.", value: skillsObject.fragile },
    { id: "Skill_Overweight", name: "Overweight Cargo Bonus", desc: "Upgrading this skill help you gain bonus based on Overweight Cargo.", value: skillsObject.overweight },
    { id: "Skill_Cost", name: "Cost per km", desc: "Upgrading this skill help you gain extra points & income per km.", value: skillsObject.cost },
  ];

  const skillLevels = [1, 2, 3, 4, 5, 6];

  adminLog('ADR Skills:', skillsObject.adr)
  adminLog('Driver skills:', skillsObject)
  adminLog('Formatted skills list:', skillsList)

  if (loading) return <LoaderSpinner dict={dict} />;

  return (
    <>
      <Card className="border-0 rounded-0 shadow mt-3" data-bs-theme="dark">
        <Card.Body>
          <h3 className="">Skills</h3>
          <Container className="m-0 p-0">
            {skillsList.map((skill, index) => (
              <Row key={index} className="">
                {skill.id === "Skill_ADR" ? (
                  <>
                    <Col xs={12} md={4} className="d-flex align-items-center">
                      <Image src={`/assets/images/skills/${skill.id}.webp`} alt={skill.name} className="me-2" width={60} height={60} />
                      <div className="text-start">
                        <p className="m-0">{skill.name}</p>
                        <p className="m-0 fs-6 text-muted">{skill.desc}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={8} className="d-flex align-items-center column-gap-2">
                      {adrClasses.map((adrClass) => (
                        <div key={adrClass} className={`rounded-1 p-2 ${ownedClasses.includes(adrClass) ? 'bg-primary' : 'border border-primary'}`} title={adrClassNames[adrClass]}>
                          <Image src={`/assets/images/skills/ADR_${adrClass}.webp`} alt={`ADR Skill ${adrClass}`} width={60} height={60} />
                        </div>
                      ))}
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs={12} md={4} className="d-flex align-items-center">
                      <Image src={`/assets/images/skills/${skill.id}.webp`} alt={skill.name} className="me-2" width={60} height={60} />
                      <div className="text-start">
                        <p className="m-0">{skill.name}</p>
                        <p className="m-0 fs-6 text-muted">{skill.desc}</p>
                      </div>
                    </Col>
                    <Col xs={12} md={8} className="d-flex align-items-center column-gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className={`rounded-1 p-2 ${i < (typeof skill.value === 'number' ? skill.value : 0) ? "bg-primary" : "border border-primary"}`} title={`${skill.name} Level: ${skill.value}`} style={{ width: 76, height: 76 }}></div>
                      ))}
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
