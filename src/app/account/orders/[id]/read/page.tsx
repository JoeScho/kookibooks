import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookPageGrid } from "@/components/book-page-grid";
import { Container } from "@/components/ui/container";
import { getUser } from "@/lib/auth/dal";
import { getOrderById } from "@/lib/orders";

export const metadata: Metadata = { title: "Read your book" };

export default async function ReadOrderPage(
  props: PageProps<"/account/orders/[id]/read">,
) {
  const { id } = await props.params;
  const user = await getUser();
  if (!user) notFound();

  const order = await getOrderById(user.id, id);
  if (!order) notFound();

  const readableItems = order.items.filter((item) => item.pages?.length);

  return (
    <Container className="py-12 sm:py-16">
      <Link
        href={`/account/orders/${order.id}`}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Back to order
      </Link>

      {readableItems.length === 0 ? (
        <p className="text-ink-soft">
          This order's book content isn't available to view yet.
        </p>
      ) : (
        <div className="flex flex-col gap-16">
          {readableItems.map((item) => (
            <div key={item.id}>
              <h1 className="font-display mb-6 text-2xl font-semibold text-ink sm:text-3xl">
                {item.title}
              </h1>
              {/* No watermark and not editable — this is the paid copy. This
                  still isn't the print-ready PDF though: pages render as
                  plain images/text here, never a downloadable file. */}
              <BookPageGrid pages={item.pages ?? []} />
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
