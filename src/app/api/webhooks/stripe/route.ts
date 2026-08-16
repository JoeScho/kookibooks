import { NextResponse } from "next/server";
import Stripe from "stripe";
import type { CartItem } from "@/lib/cart";
import { createGelatoOrder } from "@/lib/gelato";
import { createSignedPdfUrl, generateBookPdf, uploadBookPdf } from "@/lib/pdf";
import { createAdminClient } from "@/lib/supabase/admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia",
});

// Real print jobs cost real money and can't be un-sent, so Gelato dispatch
// stays off until this is explicitly turned on — even once a pdfPath exists.
// Flip GELATO_LIVE_DISPATCH=true in the environment once Gelato's dashboard
// (billing, product config) is actually ready.
const GELATO_LIVE_DISPATCH = process.env.GELATO_LIVE_DISPATCH === "true";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "invalid signature";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 },
    );
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;

    // For async payment methods (e.g. bank transfers), `completed` can fire
    // before the money has actually arrived — only fulfil once paid.
    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, note: "awaiting payment" });
    }

    const orderId = session.metadata?.order_id;
    const shipping = session.collected_information?.shipping_details;

    if (!orderId) {
      return NextResponse.json({
        received: true,
        note: "no order_id on session",
      });
    }

    const admin = createAdminClient();
    const { data: order } = await admin
      .from("orders")
      .select("id, items, status")
      .eq("id", orderId)
      .single();

    if (!order) {
      return NextResponse.json({ received: true, note: "order not found" });
    }

    // Idempotency: Stripe may retry deliveries or send both
    // `checkout.session.completed` and `checkout.session.async_payment_succeeded`.
    if (order.status !== "pending_payment") {
      return NextResponse.json({ received: true, note: "already processed" });
    }

    const shippingAddress = shipping
      ? {
          name: shipping.name || "Valued Customer",
          addressLine1: shipping.address?.line1 || "",
          addressLine2: shipping.address?.line2 || undefined,
          city: shipping.address?.city || "",
          postCode: shipping.address?.postal_code || "",
          country: shipping.address?.country || "GB",
        }
      : null;

    await admin
      .from("orders")
      .update({
        status: "paid",
        stripe_payment_intent_id: session.payment_intent as string | null,
        shipping_address: shippingAddress,
        customer_email: session.customer_details?.email ?? undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (shippingAddress) {
      const items = (order.items as CartItem[]) ?? [];
      const gelatoOrderIds: string[] = [];

      const updatedItems = await Promise.all(
        items.map(async (item) => {
          if (item.pdfPath || !item.pages?.length) return item;
          try {
            const pdfBytes = await generateBookPdf(item.title, item.pages);
            const pdfPath = await uploadBookPdf(orderId, item.id, pdfBytes);
            return { ...item, pdfPath };
          } catch (err) {
            console.error(`PDF generation failed for item ${item.id}:`, err);
            return item;
          }
        }),
      );

      if (GELATO_LIVE_DISPATCH) {
        for (const item of updatedItems) {
          if (!item.pdfPath) continue;
          try {
            // Signed URL minted fresh, right before Gelato needs to fetch
            // it — the underlying file stays private otherwise.
            const pdfUrl = await createSignedPdfUrl(item.pdfPath);
            const gelatoOrder = await createGelatoOrder({
              orderId: `${orderId}_${item.id}`,
              pdfUrl,
              recipient: {
                name: shippingAddress.name,
                addressLine1: shippingAddress.addressLine1,
                city: shippingAddress.city,
                postCode: shippingAddress.postCode,
                country: shippingAddress.country,
              },
            });
            gelatoOrderIds.push(gelatoOrder.id);
          } catch (err) {
            console.error(`Gelato dispatch failed for item ${item.id}:`, err);
          }
        }
      } else {
        const readyCount = updatedItems.filter((i) => i.pdfPath).length;
        console.log(
          `[gelato] Live dispatch is off (GELATO_LIVE_DISPATCH!=true) — ` +
            `${readyCount}/${updatedItems.length} item(s) on order ${orderId} have a PDF ready but were not sent to print.`,
        );
      }

      await admin
        .from("orders")
        .update({
          items: updatedItems,
          status: gelatoOrderIds.length > 0 ? "fulfilling" : "paid",
          gelato_order_ids: gelatoOrderIds,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
    }
  }

  return NextResponse.json({ received: true });
}
