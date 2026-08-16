import { Check } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { type BookType, EDITIONS, SHIPPING_P } from "@/lib/products";
import { formatGBP } from "@/lib/utils";

const accentBg: Record<BookType["accent"], string> = {
  sun: "bg-sun/40",
  mint: "bg-mint",
  coral: "bg-coral-soft",
};

export function FunnelLanding({ book }: { book: BookType }) {
  return (
    <>
      <section className="pt-14 pb-16 sm:pt-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-4 py-1.5 text-sm font-semibold text-coral-dark">
              {book.heroEmoji} {book.targetLabel}
            </span>
            <h1 className="font-display text-4xl font-semibold text-balance text-ink sm:text-5xl">
              {book.name}
            </h1>
            <p className="max-w-lg text-lg text-ink-soft">{book.blurb}</p>
            <ButtonLink href={`/create/${book.slug}`} size="lg">
              Start their book — free preview
            </ButtonLink>
            <div className="flex items-center gap-2 text-sm text-ink-soft">
              <StarRating />
              Loved by thousands of families across the UK
            </div>
          </div>
          <div
            className={`animate-float flex aspect-square items-center justify-center rounded-[2.5rem] ${accentBg[book.accent]} text-[8rem]`}
          >
            {book.heroEmoji}
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Real examples"
            title={`${book.traitPrompt} — that's the whole point`}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {book.examplePrompts.map((example) => (
              <div
                key={example}
                className="rounded-2xl border border-border bg-surface p-5"
              >
                <p className="text-sm leading-relaxed text-ink">"{example}"</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-cream-soft py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="The process"
            title="How your book comes together"
          />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {book.steps.map((step, i) => (
              <li
                key={step}
                className="flex flex-col gap-3 rounded-2xl bg-surface p-5"
              >
                <span className="font-display flex size-8 items-center justify-center rounded-full bg-coral text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-ink">{step}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-16">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Pricing"
            title="One book, two ways to hold it"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            {EDITIONS.map((edition) => (
              <div
                key={edition.id}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-8"
              >
                <h3 className="font-display text-xl font-semibold text-ink">
                  {edition.name}
                </h3>
                <p className="text-sm text-ink-soft">{edition.description}</p>
                <p className="font-display text-3xl font-semibold text-ink">
                  {formatGBP(edition.priceP)}
                  <span className="text-sm font-normal text-ink-soft">
                    {" "}
                    + {formatGBP(SHIPPING_P)} shipping
                  </span>
                </p>
                <ul className="flex flex-col gap-2 text-sm text-ink-soft">
                  {[
                    "Written & illustrated just for them",
                    "10 fully illustrated pages",
                    "0% UK VAT on printed books",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-mint-dark" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <ButtonLink
            href={`/create/${book.slug}`}
            size="lg"
            className="mx-auto"
          >
            Start their book
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
