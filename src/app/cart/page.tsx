"use client";

import { AlertCircle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getEdition, SHIPPING_P } from "@/lib/products";
import { formatGBP } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotalP, removeItem, setQuantity } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Checkout failed.");
      window.location.href = result.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setCheckingOut(false);
    }
  }

  if (items.length === 0) {
    return (
      <Container className="flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <ShoppingBag className="size-12 text-ink-soft/40" />
        <h1 className="font-display text-2xl font-semibold text-ink">
          Your basket is empty
        </h1>
        <p className="max-w-sm text-ink-soft">
          Create a custom storybook for your kid, your pet, or your other half —
          it only takes a few minutes.
        </p>
        <ButtonLink href="/kids">Start a book</ButtonLink>
      </Container>
    );
  }

  const totalP = subtotalP + SHIPPING_P;

  return (
    <Container className="py-12 sm:py-16">
      <h1 className="font-display mb-8 text-3xl font-semibold text-ink">
        Your basket
      </h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
          {items.map((item) => {
            const edition = getEdition(item.edition);
            return (
              <li key={item.id} className="flex gap-4 p-5">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-cream-soft">
                  {item.coverImageUrl ? (
                    <Image
                      src={item.coverImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-3xl">
                      📖
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="text-sm text-ink-soft">{edition?.name}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 rounded-full border border-border">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-ink/5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-ink/5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-ink">
                        {formatGBP(item.unitAmountP * item.quantity)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-ink-soft hover:text-red-600"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex h-fit flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Order summary
          </h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>Subtotal</span>
              <span>{formatGBP(subtotalP)}</span>
            </div>
            <div className="flex justify-between text-ink-soft">
              <span>Shipping</span>
              <span>{formatGBP(SHIPPING_P)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatGBP(totalP)}</span>
            </div>
          </div>
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}
          <Button onClick={handleCheckout} disabled={checkingOut} size="lg">
            {checkingOut ? "Redirecting to checkout…" : "Secure checkout"}
          </Button>
          <p className="text-center text-xs text-ink-soft">
            0% VAT on printed books · Payments by Stripe
          </p>
        </div>
      </div>
    </Container>
  );
}
