import "server-only";
import { createClient } from "@supabase/supabase-js";

// Admin Supabase client (Supabase's "secret key" — the current name for
// what used to be the "service_role" key) for trusted server-side writes
// (creating and updating orders) that must bypass row-level security. Never
// import this from a Client Component or expose the key to the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false } },
  );
}
