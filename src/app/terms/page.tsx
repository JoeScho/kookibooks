import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated="16 August 2026">
      <p>
        These terms govern your use of Kookibooks and any book you order through
        it. By using the site or placing an order, you agree to them.
      </p>
      <h2>Your content</h2>
      <p>
        You confirm you have the right to upload any photo you submit, and that
        it doesn't infringe anyone else's rights. Don't upload photos of anyone
        without their permission — or, for children, without a parent or
        guardian's permission.
      </p>
      <h2>Generated content</h2>
      <p>
        Story text and illustrations are generated specifically for your order
        based on the details you provide. We reserve the right to decline to
        generate or print content that is unlawful, hateful, sexually explicit,
        or otherwise inappropriate for a family-friendly platform.
      </p>
      <h2>Orders and payment</h2>
      <p>
        Prices are shown in GBP and include 0% VAT on printed books, per current
        UK rules. Shipping is charged separately at checkout. Payment is
        processed securely by Stripe — we never see or store your card details.
      </p>
      <h2>Printing and delivery</h2>
      <p>
        Each book is printed on demand once payment is confirmed. Estimated
        delivery times are shown at checkout and are not guaranteed delivery
        dates.
      </p>
      <h2>Cancellations and refunds</h2>
      <p>
        Because each book is custom-made, we can only cancel or refund an order
        before it enters production. See our{" "}
        <a href="/shipping-returns" className="text-coral hover:underline">
          shipping &amp; returns
        </a>{" "}
        page for details.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Reach us via the{" "}
        <a href="/contact" className="text-coral hover:underline">
          contact page
        </a>
        .
      </p>
    </LegalPage>
  );
}
