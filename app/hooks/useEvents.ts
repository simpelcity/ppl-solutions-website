'use client'

import { useEffect, useState } from "react";
import { useLang } from '@/hooks/useLang'
import axios from "axios";
import type { Dictionary } from "@/app/i18n";


export function useEvents(dict: Dictionary) {
  const lang = useLang();
  const [events, setEvents] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const eventData = 
  {
    error: false,
    response: [
      {
        id: 35650,
        event_type: {
          key: "truck_show_and_convoy",
          name: "Truckfest And Convoy",
        },
        name: "test event #3",
        slug: "35650-test-event#3",
        game: "ETS2",
        server: {
          id: 0,
          name: "To be determined",
        },
        language: "English",
        departure: {
          location: "Stokes",
          city: "Amsterdam",
        },
        arrive: {
          location: "Trameri",
          city: "Amsterdam",
        },
        meetup_at: "2026-05-11 18:00:00",
        start_at: "2026-05-11 19:00:00",
        banner: "https://static.truckersmp.com/images/event/cover/35650.1778485358.jpg",
        map: null,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel cum cupiditate soluta exercitationem facilis consequatur nesciunt dolorum laborum enim delectus nam ipsa rerum, error nemo quam, adipisci voluptatibus sed est asperiores doloremque quasi autem ut. Vero a cum laboriosam possimus alias modi autem tenetur molestias labore iste, id ea vitae repellat quos consequuntur amet quae? Non similique exercitationem placeat tempore explicabo quaerat nostrum alias laboriosam sit, voluptatem aut itaque et deleniti debitis commodi assumenda reiciendis necessitatibus doloribus provident? Ratione quo nihil cumque odio, officiis illum sed soluta excepturi optio, magnam illo architecto aliquid nam mollitia ipsum rerum deleniti voluptas corporis?",
        rule: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel cum cupiditate soluta exercitationem facilis consequatur nesciunt dolorum laborum enim delectus nam ipsa rerum, error nemo quam, adipisci voluptatibus sed est asperiores doloremque quasi autem ut. Vero a cum laboriosam possimus alias modi autem tenetur molestias labore iste, id ea vitae repellat quos consequuntur amet quae? Non similique exercitationem placeat tempore explicabo quaerat nostrum alias laboriosam sit, voluptatem aut itaque et deleniti debitis commodi assumenda reiciendis necessitatibus doloribus provident? Ratione quo nihil cumque odio, officiis illum sed soluta excepturi optio, magnam illo architecto aliquid nam mollitia ipsum rerum deleniti voluptas corporis?",
        voice_link: "https://discord.gg/mnKcKwsYm4",
        external_link: "https://ppl-solutions.vercel.app",
        featured: "",
        vtc: {
          id: 74455,
          name: "PPL Solutions",
        },
        user: {
          id: 5244560,
          username: "Simpelcity",
        },
        attendances: {
          confirmed: 0,
          unsure: 0,
          vtcs: 0,
          confirmed_users: [
            {
              id: 5244560,
              username: "Simpelcity",
              following: false,
              created_at: "2026-05-11 07:44:05",
              updated_at: "2026-05-11 07:44:05",
            },
          ],
          unsure_users: [],
          confirmed_vtcs: [
            {
              id: 74455,
              name: "PPL Solutions",
              following: false,
              created_at: "2026-05-11 07:42:38",
              updated_at: "2026-05-11 07:42:38",
            },
          ],
        },
        dlcs: {
          "227310": "Going East!",
          "304212": "Scandinavia",
          "531130": "Vive la France !",
          "558244": "Italia",
          "925580": "Beyond the Baltic Sea",
          "933610": "Krone Trailer Pack",
          "1056760": "Road to the Black Sea",
          "1209460": "Iberia",
          "2004210": "West Balkans",
          "2193220": "Feldbinder Trailer Pack",
          "2604420": "Greece",
          "2780810": "Nordic Horizons",
          "3796990": "Iceland",
          "3851260": "Isle of Ireland",
        },
        url: "/events/35650-test-event#3",
        created_at: "2026-05-11 07:42:38",
        updated_at: "2026-05-11 07:42:38",
      },
      {
        id: 35650,
        event_type: {
          key: "truck_show_and_convoy",
          name: "Truckfest And Convoy",
        },
        name: "test event #3",
        slug: "35650-test-event#3",
        game: "ETS2",
        server: {
          id: 0,
          name: "To be determined",
        },
        language: "English",
        departure: {
          location: "Stokes",
          city: "Amsterdam",
        },
        arrive: {
          location: "Trameri",
          city: "Amsterdam",
        },
        meetup_at: "2026-05-11 18:00:00",
        start_at: "2026-05-11 19:00:00",
        banner: "https://static.truckersmp.com/images/event/cover/35650.1778485358.jpg",
        map: null,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel cum cupiditate soluta exercitationem facilis consequatur nesciunt dolorum laborum enim delectus nam ipsa rerum, error nemo quam, adipisci voluptatibus sed est asperiores doloremque quasi autem ut. Vero a cum laboriosam possimus alias modi autem tenetur molestias labore iste, id ea vitae repellat quos consequuntur amet quae? Non similique exercitationem placeat tempore explicabo quaerat nostrum alias laboriosam sit, voluptatem aut itaque et deleniti debitis commodi assumenda reiciendis necessitatibus doloribus provident? Ratione quo nihil cumque odio, officiis illum sed soluta excepturi optio, magnam illo architecto aliquid nam mollitia ipsum rerum deleniti voluptas corporis?",
        rule: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel cum cupiditate soluta exercitationem facilis consequatur nesciunt dolorum laborum enim delectus nam ipsa rerum, error nemo quam, adipisci voluptatibus sed est asperiores doloremque quasi autem ut. Vero a cum laboriosam possimus alias modi autem tenetur molestias labore iste, id ea vitae repellat quos consequuntur amet quae? Non similique exercitationem placeat tempore explicabo quaerat nostrum alias laboriosam sit, voluptatem aut itaque et deleniti debitis commodi assumenda reiciendis necessitatibus doloribus provident? Ratione quo nihil cumque odio, officiis illum sed soluta excepturi optio, magnam illo architecto aliquid nam mollitia ipsum rerum deleniti voluptas corporis?",
        voice_link: "https://discord.gg/mnKcKwsYm4",
        external_link: "https://ppl-solutions.vercel.app",
        featured: "",
        vtc: {
          id: 74455,
          name: "PPL Solutions",
        },
        user: {
          id: 5244560,
          username: "Simpelcity",
        },
        attendances: {
          confirmed: 0,
          unsure: 0,
          vtcs: 0,
          confirmed_users: [
            {
              id: 5244560,
              username: "Simpelcity",
              following: false,
              created_at: "2026-05-11 07:44:05",
              updated_at: "2026-05-11 07:44:05",
            },
          ],
          unsure_users: [],
          confirmed_vtcs: [
            {
              id: 74455,
              name: "PPL Solutions",
              following: false,
              created_at: "2026-05-11 07:42:38",
              updated_at: "2026-05-11 07:42:38",
            },
          ],
        },
        dlcs: {
          "227310": "Going East!",
          "304212": "Scandinavia",
          "531130": "Vive la France !",
          "558244": "Italia",
          "925580": "Beyond the Baltic Sea",
          "933610": "Krone Trailer Pack",
          "1056760": "Road to the Black Sea",
          "1209460": "Iberia",
          "2004210": "West Balkans",
          "2193220": "Feldbinder Trailer Pack",
          "2604420": "Greece",
          "2780810": "Nordic Horizons",
          "3796990": "Iceland",
          "3851260": "Isle of Ireland",
        },
        url: "/events/35650-test-event#3",
        created_at: "2026-05-11 07:42:38",
        updated_at: "2026-05-11 07:42:38",
      },
    ],
  };

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/events?lang=${lang}`);
        if (res.status !== 200) throw new Error(dict.errors.events.FAILED_TO_FETCH_EVENTS, { cause: res.status });
        const data = res.data;
        // setEvents(data.response);
        setEvents(eventData.response)
      } catch (err: any) {
        const message = err?.response?.data?.message || err?.message || dict.errors.events.FAILED_TO_FETCH_EVENTS;
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return { events, loading, error };
}
