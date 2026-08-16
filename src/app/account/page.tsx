import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { getUser } from "@/lib/auth/dal";
import { getOrdersForUser } from "@/lib/orders";
import { formatGBP } from "@/lib/utils";

export const metadata: Metadata = { title: "Your account" };

export default async function AccountOverviewPage(
  props: PageProps<"/account">,
) {
  const params = await props.searchParams;
  const user = await getUser();
  const orders = user ? await getOrdersForUser(user.id) : [];
  const welcome = params.welcome === "1";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          {welcome
            ? "Welcome to Kookibooks! 🎉"
            : `Hi, ${user?.user_metadata?.full_name ?? "there"}`}
        </h1>
        <p className="mt-1 text-ink-soft">
          Here's a quick look at your account.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-ink-soft">Total orders</p>
          <p className="font-display mt-1 text-3xl font-semibold text-ink">
            {orders.length}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-ink-soft">Total spent</p>
          <p className="font-display mt-1 text-3xl font-semibold text-ink">
            {formatGBP(orders.reduce((sum, o) => sum + o.total_p, 0))}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Recent orders
          </h2>
          <Link
            href="/account/orders"
            className="text-sm font-semibold text-coral hover:underline"
          >
            View all
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="text-sm text-ink-soft">
              You haven't ordered a book yet.
            </p>
            <ButtonLink href="/kids" size="sm">
              Start your first book
            </ButtonLink>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {orders.slice(0, 3).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-medium text-ink">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-xs text-ink-soft">
                    {new Date(order.created_at).toLocaleDateString("en-GB")}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {formatGBP(order.total_p)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
