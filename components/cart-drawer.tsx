"use client";

import { ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/components/cart-provider";
import { ButtonLink } from "@/components/ui/button";
import { getEdition } from "@/lib/products";
import { cn, formatGBP } from "@/lib/utils";

export function CartDrawer() {
  const { items, subtotalP, isOpen, close, removeItem } = useCart();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        isOpen ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <button
        type="button"
        aria-label="Close basket"
        className={cn(
          "absolute inset-0 bg-ink/30 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0",
        )}
        onClick={close}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-xl font-semibold">Your basket</h2>
          <button
            type="button"
            onClick={close}
            className="flex size-9 items-center justify-center rounded-full hover:bg-ink/5"
            aria-label="Close basket"
          >
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="size-10 text-ink-soft/40" />
            <p className="font-medium text-ink-soft">Your basket is empty.</p>
            <ButtonLink href="/kids" size="sm" onClick={close}>
              Start a book
            </ButtonLink>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-6">
              {items.map((item) => {
                const edition = getEdition(item.edition);
                return (
                  <li key={item.id} className="flex gap-4 py-5">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-cream-soft book-shadow">
                      {item.coverImageUrl ? (
                        <Image
                          src={item.coverImageUrl}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-2xl">
                          📖
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="text-sm font-semibold text-ink">
                        {item.title}
                      </p>
                      <p className="text-xs text-ink-soft">
                        {edition?.name} · Qty {item.quantity}
                      </p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-sm font-semibold text-ink">
                          {formatGBP(item.unitAmountP * item.quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-ink-soft underline-offset-2 hover:text-coral hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm font-semibold text-ink">
                <span>Subtotal</span>
                <span>{formatGBP(subtotalP)}</span>
              </div>
              <ButtonLink href="/cart" className="w-full" onClick={close}>
                View basket &amp; checkout
              </ButtonLink>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
