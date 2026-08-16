import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Centralised auth check, memoized for the lifetime of a single request so
// multiple components (header, layout, page) can call it without firing
// duplicate requests to Supabase.
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
