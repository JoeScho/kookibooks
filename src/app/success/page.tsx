import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Stripe from "stripe";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Order confirmed" };

async function getSessionEmail(sessionId: string | undefined) {
  if (!sessionId || !process.env.STRIPE_SECRET_KEY) return null;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-07-29.dahlia",
    });
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.customer_details?.email ?? null;
  } catch {
    return null;
  }
}

export default async function SuccessPage(props: PageProps<"/success">) {
  const params = await props.searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;
  const email = await getSessionEmail(sessionId);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-5 py-16 text-center">
      <ClearCartOnMount />
      <span className="flex size-16 items-center justify-center rounded-full bg-mint">
        <CheckCircle2 className="size-9 text-mint-dark" />
      </span>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Their book is on its way to print!
      </h1>
      <p className="max-w-md text-ink-soft">
        {email
          ? `We've sent a confirmation to ${email}. `
          : "We've sent you a confirmation email. "}
        We write, illustrate, print, and post every book by hand — you'll get a
        tracking link the moment it ships.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/account/orders">View your orders</ButtonLink>
        <ButtonLink href="/kids" variant="outline">
          Start another book
        </ButtonLink>
      </div>
    </Container>
  );
}
