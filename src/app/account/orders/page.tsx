import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { getUser } from "@/lib/auth/dal";
import { getOrdersForUser, type OrderStatus } from "@/lib/orders";
import { formatGBP } from "@/lib/utils";

export const metadata: Metadata = { title: "Your orders" };

const STATUS_LABEL: Record<
  OrderStatus,
  { label: string; tone: "coral" | "mint" | "sun" | "ink" }
> = {
  pending_payment: { label: "Awaiting payment", tone: "sun" },
  paid: { label: "Paid", tone: "mint" },
  fulfilling: { label: "Printing", tone: "coral" },
  fulfilled: { label: "Shipped", tone: "mint" },
  failed: { label: "Failed", tone: "ink" },
  cancelled: { label: "Cancelled", tone: "ink" },
};

export default async function OrdersPage() {
  const user = await getUser();
  const orders = user ? await getOrdersForUser(user.id) : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Your orders
      </h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface py-16 text-center">
          <p className="text-ink-soft">
            No orders yet — your printed books will show up here.
          </p>
          <ButtonLink href="/kids">Start a book</ButtonLink>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => {
            const status = STATUS_LABEL[order.status];
            return (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition hover:border-coral/40 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {new Date(order.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "book" : "books"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge tone={status.tone}>{status.label}</Badge>
                    <span className="text-sm font-semibold text-ink">
                      {formatGBP(order.total_p)}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
