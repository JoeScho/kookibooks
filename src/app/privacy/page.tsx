import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated="16 August 2026">
      <p>
        This policy explains what personal data Kookibooks collects, why, and
        how it's used. We collect the minimum needed to make and ship your book.
      </p>
      <h2>What we collect</h2>
      <p>
        Account details (name, email), the names and traits you enter to write
        your story, any photo you upload, and shipping and payment details
        needed to fulfil your order.
      </p>
      <h2>How we use it</h2>
      <p>
        To generate your book's text and illustrations, to process payment and
        print your order, to send order updates, and — only if you opt in — to
        send occasional marketing emails.
      </p>
      <h2>Third parties</h2>
      <p>
        We share the minimum data necessary with the services that power
        Kookibooks: our AI story and illustration providers (to generate your
        book), Stripe (to process payment), and our print partner (to fulfil
        your order). None of them may use your data for their own marketing.
      </p>
      <h2>Photos</h2>
      <p>
        Uploaded photos are used solely to generate your book's illustrations
        and are retained only as long as needed to fulfil and support your
        order.
      </p>
      <h2>Your rights</h2>
      <p>
        You can request a copy of your data, ask us to correct it, or ask us to
        delete your account and associated data at any time via the{" "}
        <a href="/contact" className="text-coral hover:underline">
          contact page
        </a>
        .
      </p>
    </LegalPage>
  );
}
