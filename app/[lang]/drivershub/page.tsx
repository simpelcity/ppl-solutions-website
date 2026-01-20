import { Card, CardBody, CardTitle } from "react-bootstrap";
import { TableJobs, Dashboard } from "@/components/";
import "@/styles/Drivershub.scss";
import { getDictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

type PageProps = {
  params: Promise<{ lang: Locale }>
}

type DictionaryType = {
  drivershub: {
    meta: {
      title: string,
      description: string
    },
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
        game: string,
        fromTo: string,
        cargo: string,
        truck: string,
        distance: string,
        income: string,
        navigation: {
          showing: string,
          allJobs: string,
          paginated: string
        },
        error: {
          error: string,
          noJobs: string
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

export default async function DriversHubPage({ params }: PageProps) {
  const { lang } = await params
  const dict = await getDictionary(lang) as DictionaryType

  return (
    <>
      <title>{`${dict.drivershub.meta.title} | PPL Solutions`}</title>
      <meta
        name="description"
        content={dict.drivershub.meta.description}
      />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={`${dict.drivershub.meta.title} | PPL Solutions`} />
      <meta
        property="og:description"
        content={dict.drivershub.meta.description}
      />
      <meta property="og:url" content="https://ppl-solutions.vercel.app/drivershub" />
      <meta property="og:image" content="https://ppl-solutions.vercel.app/assets/images/ppls-logo.png" />
      <link rel="canonical" href="https://ppl-solutions.vercel.app/drivershub" />

      <main className="fs-5">
        <section className="drivershub d-flex w-100 bg-dark-subtle text-center text-light">
          <Dashboard dict={dict.drivershub.sidebar}>
            <Card className="bg-dark rounded-0 border-0 shadow mt-3">
              <CardBody className="p-4">
                <CardTitle className="text-uppercase fs-2 text-light mb-3">{dict.drivershub.jobs.title}</CardTitle>
                <TableJobs params={params} />
              </CardBody>
            </Card>
          </Dashboard>
        </section>
      </main>
    </>
  );
}

