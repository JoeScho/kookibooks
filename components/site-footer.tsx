import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter-form";
import { Container } from "@/components/ui/container";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { href: "/kids", label: "Kids' Storybooks" },
      { href: "/pets", label: "Pet Quirks Books" },
      { href: "/couples", label: "Beige Flags Books" },
      { href: "/how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact us" },
      { href: "/shipping-returns", label: "Shipping & returns" },
      { href: "/account/orders", label: "Track an order" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "Our story" },
      { href: "/terms", label: "Terms of service" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-cream/80">
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="font-display flex items-center gap-1.5 text-xl font-semibold text-white"
            >
              <span className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-lg bg-coral text-base">
                📖
              </span>
              Kookibooks
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-cream/60">
              Every quirk has a story. Custom, illustrated storybooks starring
              your kid, your pet, or your other half — printed and posted from
              the UK.
            </p>
            <div className="mt-2">
              <p className="mb-2 text-sm font-semibold text-white">
                Get 10% off your first book
              </p>
              <NewsletterForm />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-3 text-sm font-semibold text-white">
                  {col.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-cream/60 transition hover:text-coral"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Kookibooks. All rights reserved.
          </p>
          <p>Printed with love in the UK &middot; 0% VAT on printed books</p>
        </div>
      </Container>
    </footer>
  );
}
