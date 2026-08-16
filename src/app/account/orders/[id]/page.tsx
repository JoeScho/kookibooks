import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getUser } from "@/lib/auth/dal";
import { getOrderById } from "@/lib/orders";
import { getEdition } from "@/lib/products";
import { formatGBP } from "@/lib/utils";

export const metadata: Metadata = { title: "Order details" };

export default async function OrderDetailPage(
  props: PageProps<"/account/orders/[id]">,
) {
  const { id } = await props.params;
  const user = await getUser();
  if (!user) notFound();

  const order = await getOrderById(user.id, id);
  if (!order) notFound();

  const hasReadableBook = order.items.some((item) => item.pages?.length);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-ink-soft">
            Placed{" "}
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="mint">{order.status.replace("_", " ")}</Badge>
          {hasReadableBook && (
            <ButtonLink
              href={`/account/orders/${order.id}/read`}
              size="sm"
              variant="soft"
            >
              Read your book
            </ButtonLink>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface">
        <ul className="divide-y divide-border">
          {order.items.map((item) => {
            const edition = getEdition(item.edition);
            return (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-ink-soft">
                    {edition?.name} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {formatGBP(item.unitAmountP * item.quantity)}
                </p>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-1.5 border-t border-border p-5 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>{formatGBP(order.subtotal_p)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Shipping</span>
            <span>{formatGBP(order.shipping_p)}</span>
          </div>
          <div className="flex justify-between pt-1 text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatGBP(order.total_p)}</span>
          </div>
        </div>
      </div>

      {order.shipping_address && (
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h2 className="mb-2 text-sm font-semibold text-ink">Shipping to</h2>
          <p className="text-sm text-ink-soft">
            {order.shipping_address.name}
            <br />
            {order.shipping_address.addressLine1}
            {order.shipping_address.addressLine2 && (
              <>
                <br />
                {order.shipping_address.addressLine2}
              </>
            )}
            <br />
            {order.shipping_address.city}, {order.shipping_address.postCode}
            <br />
            {order.shipping_address.country}
          </p>
        </div>
      )}
    </div>
  );
}
