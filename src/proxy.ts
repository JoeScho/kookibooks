import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Runs on every request (outside API/static asset paths). Keeps the
// Supabase session cookie fresh and gates /account/* behind login.
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
