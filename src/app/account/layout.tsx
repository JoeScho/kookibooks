import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { Container } from "@/components/ui/container";
import { getUser } from "@/lib/auth/dal";

export default async function AccountLayout({
  children,
}: LayoutProps<"/account">) {
  const user = await getUser();
  if (!user) redirect("/login?next=/account");

  return (
    <Container className="grid gap-10 py-12 lg:grid-cols-[220px_1fr]">
      <aside>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Signed in as
          </p>
          <p className="truncate text-sm font-medium text-ink">{user.email}</p>
        </div>
        <AccountNav />
      </aside>
      <div>{children}</div>
    </Container>
  );
}
