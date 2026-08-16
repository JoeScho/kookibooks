import type { Metadata } from "next";
import { FunnelLanding } from "@/components/funnel-landing";
import { type BookType, getBookType } from "@/lib/products";

const book: BookType = (() => {
  const found = getBookType("kids");
  if (!found) throw new Error("Missing book type: kids");
  return found;
})();

export const metadata: Metadata = {
  title: book.name,
  description: book.blurb,
};

export default function KidsPage() {
  return <FunnelLanding book={book} />;
}
