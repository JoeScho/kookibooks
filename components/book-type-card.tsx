import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { BookType } from "@/lib/products";
import { cn } from "@/lib/utils";

const accentClasses: Record<BookType["accent"], string> = {
  sun: "bg-sun/40",
  mint: "bg-mint",
  coral: "bg-coral-soft",
};

export function BookTypeCard({ book }: { book: BookType }) {
  return (
    <Link
      href={`/${book.slug}`}
      className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={cn(
          "flex h-40 items-center justify-center text-6xl",
          accentClasses[book.accent],
        )}
      >
        <span className="animate-float">{book.heroEmoji}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-coral">
          {book.targetLabel}
        </span>
        <h3 className="font-display text-xl font-semibold text-ink">
          {book.name}
        </h3>
        <p className="text-sm leading-relaxed text-ink-soft">{book.blurb}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-coral">
          Start their book
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
