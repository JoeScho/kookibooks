import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartItem } from "@/lib/cart";
import { cartSubtotalP } from "@/lib/cart";
import { getEdition, SHIPPING_P } from "@/lib/products";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

export async function POST(req: Request) {
  try {
    const { items } = (await req.json()) as { items: CartItem[] };

    if (!items?.length) {
      return NextResponse.json(
        { error: "Your basket is empty." },
        { status: 400 },
      );
    }

    const subtotalP = cartSubtotalP(items);
    const totalP = subtotalP + SHIPPING_P;

    // Record the order before redirecting to Stripe so the webhook has
    // somewhere to write the payment result back to.
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();
    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        status: "pending_payment",
        items,
        subtotal_p: subtotalP,
        shipping_p: SHIPPING_P,
        total_p: totalP,
        customer_email: user?.email ?? null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      throw new Error(
        orderError?.message ?? "Could not create the order record.",
      );
    }

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item) => {
        const edition = getEdition(item.edition);
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${item.title} (${edition?.name ?? item.edition})`,
              images: item.coverImageUrl ? [item.coverImageUrl] : undefined,
            },
            unit_amount: item.unitAmountP,
          },
          quantity: item.quantity,
        };
      }),
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: SHIPPING_P, currency: "gbp" },
            display_name: "UK standard shipping",
          },
        },
      ],
      mode: "payment",
      customer_email: user?.email ?? undefined,
      shipping_address_collection: {
        allowed_countries: ["GB", "US", "CA", "AU", "IE"],
      },
      // Managed Payments (on by default on newer Stripe accounts) is
      // Stripe-as-merchant-of-record and only supports digital products —
      // it silently drops shipping collection entirely. We ship physical
      // printed books, so it's opted out explicitly rather than adapted to.
      managed_payments: { enabled: false },
      metadata: { order_id: order.id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    });

    await admin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
