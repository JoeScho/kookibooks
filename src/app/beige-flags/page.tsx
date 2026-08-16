import { redirect } from "next/navigation";

// "/couples" is canonical; keep this path alive since it's the name used
// in marketing (see KOOKIBOOKS_PLAN.md route A).
export default function BeigeFlagsRedirect() {
  redirect("/couples");
}
