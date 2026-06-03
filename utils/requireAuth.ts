import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

type AuthSuccess = { user: User; response: null };
type AuthFailure = { user: null; response: NextResponse };
export type AuthResult = AuthSuccess | AuthFailure;

export async function requireAuth(): Promise<AuthResult> {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    },
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: true, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  return { user, response: null };
}

export function isAdmin(user: User): boolean {
  return user.app_metadata?.is_admin === true;
}

export function requireAdmin(user: User): NextResponse | null {
  if (!isAdmin(user)) {
    return NextResponse.json(
      { error: true, message: "Forbidden" },
      { status: 403 },
    );
  }
  return null;
}
