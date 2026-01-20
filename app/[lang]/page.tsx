import { Container, Image, Row, Col } from "react-bootstrap";
import { CardText, BSButton } from "@/components/index";
import "@/styles/Home.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type DictionaryType = {
  home: {
    meta: {
      title: string,
      description: string
    },
    slogan: string;
    buttons: {
      apply: string;
      discord: string;
    },
    "about-us": {
      title: string,
      description: string
    },
    offers: {
      title: string,
      card1: {
        title: string,
        description: string
      },
      card2: {
        title: string,
        description: string
      },
      card3: {
        title: string,
        description: string
      }
    },
    apply: {
      title: string,
      description: string,
      button: string
    }
  },
  signup: {
    form: {
      title: string,
      email: string,
      emailPlaceholder: string,
      username: string,
      usernamePlaceholder: string,
      allowedChars: string,
      password: string,
      passwordPlaceholder: string,
      submit: string,
      haveAccount: string
    }
  },
  forgotPassword: {
    form: {
      title: string,
      description: string,
      email: string,
      emailPlaceholder: string,
      submit: string,
      remember: string
    }
  },
  "reset-password": {
    form: {
      title: string,
      "new-password-below": string,
      "new-password": string,
      "new-password-placeholder": string,
      "confirm-password": string,
      "confirm-password-placeholder": string,
      submit: string,
      backToLogin: string
    }
  },
  drivershub: {
    sidebar: {
      title: string,
      drivershub: string,
      userStats: string,
      leaderboard: string,
      dashboard: {
        title: string,
        vtcStats: string,
        team: string,
        gallery: string
      },
      profile: {
        settings: string,
        profile: string,
        logout: string
      }
    },
    jobs: {
      title: string,
      table: {
        date: string,
        username: string,
        fromTo: string,
        cargo: string,
        truck: string,
        distance: string,
        income: string,
        navigation: {
          showing: string,
          allJobs: string,
          paginated: string
        }
      }
    },
    vtcStats: {
      vtc: {
        title: string,
        totalDistance: string,
        totalJobs: string,
        totalIncome: string,
        totalTimeDriven: string
      },
      ets2: {
        title: string,
        totalDistance: string,
        totalJobs: string,
        totalIncome: string,
        totalTimeDriven: string
      },
      ats: {
        title: string,
        totalDistance: string,
        totalJobs: string,
        totalIncome: string,
        totalTimeDriven: string
      }
    },
    team: {
      form: {
        titleNewMember: string,
        titleEditMember: string,
        username: string,
        usernamePlaceholder: string,
        profilePicture: string,
        submitNewMember: string,
        submitEditMember: string,
        calcelEditMember: string,
        rolesDepartments: {
          title: string,
          currentRoles: string,
          addRole: string,
          department: string,
          role: string
        }
      },
      card: {
        title: string
      },
      modal: {
        title: string,
        descriptionmember: string,
        descriptionPicture: string,
        cancel: string,
        confirm: string
      }
    },
    gallery: {
      form: {
        titleNewItem: string,
        titleEditItem: string,
        title: string,
        titlePlaceholder: string,
        image: string,
        imageEdit: string,
        submit: string,
        submitEdit: string,
        cancel: string
      },
      card: {
        title: string
      },
      modal: {
        title: string,
        description: string,
        cancel: string,
        confirm: string
      }
    }
  }
}

type PageProps = {
  params: Promise<{ lang: Locale }>
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  const aboutUs1 = dict.home["about-us"].title.split(' ')[0];
  const aboutUs2 = dict.home["about-us"].title.split(' ')[1];

  const offer1 = dict.home.offers.title.split(' ')[0];
  const offer2 = dict.home.offers.title.split(' ')[1];
  const offer3 = dict.home.offers.title.split(' ')[2];

  const apply1 = dict.home.apply.title.split(' ')[0];
  const apply2 = dict.home.apply.title.split(' ')[1];
  const apply3 = dict.home.apply.title.split(' ')[2];

  return (
    <>
      <title>{`PPL Solutions | ${dict.home.meta.title}`}</title>
      <meta
        name="description"
        content={dict.home.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`PPL Solutions | ${dict.home.meta.title}`} />
      <meta
        property="og:description"
        content={dict.home.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <meta property="og:site_name" content="PPL Solutions VTC" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/" />
      <script src="https://kit.fontawesome.com/555ef81382.js" crossOrigin="anonymous"></script>

      <main className="fs-5">
        <section className="d-flex w-100 text-light">
          <Container className="px-0 position-relative d-flex justify-content-center" fluid>
            <Image
              src={"/assets/images/banner.jpg"}
              alt="PPL Solutions Scania S650 V8"
              className="object-fit-cover w-100 home-img"
              fluid
            />
            <div className="overlay position-absolute top-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center">
              <h4 className="text-center">"{dict.home.slogan}"</h4>
              <div className="mt-3 d-flex justify-content-center column-gap-3">
                <BSButton variant="outline" size="lg" border="light" href="/apply">
                  {dict.home.buttons.apply}
                </BSButton>
                <BSButton
                  variant="outline"
                  size="lg"
                  border="light"
                  href="https://discord.gg/mnKcKwsYm4"
                  target="_blank">
                  {dict.home.buttons.discord}
                </BSButton>
              </div>
            </div>
          </Container>
        </section>
        <section className="short-about text-center text-light bg-dark-subtle d-flex justify-content-center">
          <Container className="my-5">
            <h1 className="text-uppercase">
              <span>{aboutUs1}</span> <span className="text-primary">{aboutUs2}</span>
            </h1>
            <p className="m-0">
              {dict.home["about-us"].description}
            </p>
          </Container>
        </section>
        <section className="offers d-flex justify-content-center text-center bg-dark">
          <Container className="my-5 d-flex flex-column align-items-center">
            <h2 className="text-uppercase mb-3 text-light mb-4">
              <span>{offer1}</span> <span className="text-primary">{offer2}</span> <span>{offer3}?</span>
            </h2>
            <Row className="w-100 d-flex justify-content-center row-gap-4">
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.title} icon="FaUsers">
                  {dict.home.offers.card1.description}
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card2.title} icon="FaEdit">
                  {dict.home.offers.card2.description}
                </CardText>
              </Col>
              <Col xs={12} md={6} xl={4}>
                <CardText title={dict.home.offers.card3.title} icon="FaGears">
                  {dict.home.offers.card3.description}
                </CardText>
              </Col>
            </Row>
          </Container>
        </section>
        <section className="apply-today d-flex justify-conetent-center text-center bg-dark-subtle text-light">
          <Container className="my-5">
            <h2 className="text-uppercase">
              <span>{apply1}</span> <span className="text-primary">{apply2} {apply3}</span>
            </h2>
            <p>{dict.home.apply.description}</p>
            <div className="d-grid d-md-inline-block">
              <BSButton variant="outline" border="primary" text="primary">
                {dict.home.apply.button}
              </BSButton>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}

