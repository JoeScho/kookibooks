import Link from "next/link";
import { HeaderActions } from "@/components/header-actions";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { getUser } from "@/lib/auth/dal";
import { NAV_LINKS } from "@/lib/nav-links";

export async function SiteHeader() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-cream/90 backdrop-blur-sm">
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <HeaderActions isLoggedIn={!!user} />
      </Container>
    </header>
  );
}
