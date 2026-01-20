import { createClient } from "@supabase/supabase-js";

// Only allow this to be used on the server side
if (typeof window !== "undefined") {
  throw new Error(
    "supabaseAdmin should only be imported in server-side code (API routes, Server Components, Server Actions)"
  );
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
  );
}

export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { 
    persistSession: false,
    autoRefreshToken: false,
  },
});
