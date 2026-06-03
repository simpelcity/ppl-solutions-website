import { createServerClient } from "@supabase/ssr";
import { NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

/**
 * Validates the session from the incoming request cookies and returns the
 * authenticated user, or null when no valid session is present.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<User | null> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // No-op: cookies cannot be set on a plain NextRequest in API routes.
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
