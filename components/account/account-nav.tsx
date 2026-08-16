"use client";

import { LayoutGrid, LogOut, Package, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/account", label: "Overview", icon: LayoutGrid },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === link.href
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              active
                ? "bg-coral-soft text-coral-dark"
                : "text-ink-soft hover:bg-ink/5 hover:text-ink",
            )}
          >
            <link.icon className="size-4.5" />
            {link.label}
          </Link>
        );
      })}
      <form action={signOut} className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink"
        >
          <LogOut className="size-4.5" />
          Sign out
        </button>
      </form>
    </nav>
  );
}
