"use client";

import { LogIn, Menu, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

export function HeaderActions({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { count, open } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href={isLoggedIn ? "/account" : "/login"}
          className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-ink/5 hover:text-ink sm:flex"
        >
          {isLoggedIn ? (
            <User className="size-4" />
          ) : (
            <LogIn className="size-4" />
          )}
          {isLoggedIn ? "Account" : "Log in"}
        </Link>
        <button
          type="button"
          onClick={open}
          className="relative flex size-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink"
          aria-label="Open cart"
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="flex size-10 items-center justify-center rounded-full text-ink-soft transition hover:bg-ink/5 hover:text-ink md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close menu"
          className={cn(
            "absolute inset-0 bg-ink/30 transition-opacity",
            mobileOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 h-full w-72 bg-cream p-6 shadow-xl transition-transform",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-lg font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex size-9 items-center justify-center rounded-full hover:bg-ink/5"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-ink/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base font-medium text-ink hover:bg-ink/5"
            >
              {isLoggedIn ? "Your account" : "Log in"}
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
