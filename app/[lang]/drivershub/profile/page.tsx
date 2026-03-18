import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from '@supabase/ssr'

export default async function ProfileRedirectPage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch (err: any) {
            console.error(err.message || err);
          }
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect(`/drivershub/profile/${user.id}`);
  } else {
    redirect("/login");
  }
}