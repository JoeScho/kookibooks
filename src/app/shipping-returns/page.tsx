import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Shipping & returns" };

export default function ShippingReturnsPage() {
  return (
    <LegalPage title="Shipping & returns" updated="16 August 2026">
      <h2>Shipping</h2>
      <p>
        We currently ship to the UK, US, Canada, Australia, and Ireland. UK
        shipping is a flat £3.50, calculated at checkout alongside international
        rates. Most orders are printed and dispatched within 2-4 working days,
        with delivery times varying by destination.
      </p>
      <h2>Tracking</h2>
      <p>
        You'll receive a shipping confirmation with tracking information as soon
        as your book leaves our print partner. You can also check order status
        any time from your{" "}
        <a href="/account/orders" className="text-coral hover:underline">
          account
        </a>
        .
      </p>
      <h2>Returns &amp; refunds</h2>
      <p>
        Because every book is printed specifically for you, we can't offer
        refunds for a change of mind once printing has started. If your book
        arrives damaged, misprinted, or different from your approved preview,
        contact us within 30 days of delivery and we'll reprint it or refund you
        — no questions asked.
      </p>
      <h2>Cancelling an order</h2>
      <p>
        If you need to cancel, contact us as soon as possible after checkout. We
        can cancel and refund any order that hasn't yet entered production.
      </p>
    </LegalPage>
  );
}
