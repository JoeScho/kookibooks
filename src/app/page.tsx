import { BookOpen, Sparkles, Star, Truck } from "lucide-react";
import Link from "next/link";
import { BookTypeCard } from "@/components/book-type-card";
import { SectionHeading } from "@/components/section-heading";
import { StarRating } from "@/components/star-rating";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BOOK_TYPES } from "@/lib/products";

const TRUST_ITEMS = [
  { icon: Sparkles, label: "Written & illustrated just for them" },
  { icon: Truck, label: "Printed & posted from the UK" },
  { icon: BookOpen, label: "0% VAT on every printed book" },
  { icon: Star, label: "Loved by 12,000+ families" },
];

const STEPS = [
  {
    title: "Tell us about them",
    body: "A name and three quirky little details — the things that make them, them.",
  },
  {
    title: "Upload one photo",
    body: "A clear, front-facing photo is all we need to draw them into every page.",
  },
  {
    title: "We write & illustrate",
    body: "Our story engine writes rhyming pages and paints matching illustrations in about a minute.",
  },
  {
    title: "Preview, then print",
    body: "Flip through the book, tweak any line you like, then we print and post it.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "My son asked me to read 'his book' four times before bed. He's obsessed with seeing himself as the hero.",
    name: "Priya, mum of one",
    book: "Kids' Storybook",
  },
  {
    quote:
      "We made one about our dog's vendetta against the postman. It's the funniest, most accurate thing I own.",
    name: "Callum & Beth",
    book: "Pet Quirks Book",
  },
  {
    quote:
      "Gave it to my partner for our anniversary. She read the 'beige flags' page out loud, crying with laughter.",
    name: "Jordan",
    book: "Beige Flags Book",
  },
];

export default function Home() {
  return (
    <>
      <section className="overflow-hidden pt-14 pb-20 sm:pt-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex flex-col items-start gap-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-coral-soft px-4 py-1.5 text-sm font-semibold text-coral-dark">
              ✨ Every quirk has a story
            </span>
            <h1 className="font-display text-4xl font-semibold text-balance text-ink sm:text-5xl lg:text-6xl">
              Turn their weirdest habits into the hero of a real, printed book
            </h1>
            <p className="max-w-lg text-lg text-ink-soft">
              Kookibooks writes and illustrates a one-of-a-kind storybook
              starring your kid, your pet, or your other half — quirks, inside
              jokes and all. Ready to print in minutes.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/kids" size="lg">
                Create your book
              </ButtonLink>
              <ButtonLink href="/how-it-works" size="lg" variant="outline">
                See how it works
              </ButtonLink>
            </div>
            <div className="flex items-center gap-2 pt-2 text-sm text-ink-soft">
              <StarRating />
              4.9/5 from 2,300+ storybooks printed
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative grid w-full max-w-md grid-cols-2 gap-4">
              {BOOK_TYPES.map((book, i) => (
                <Link
                  key={book.id}
                  href={`/${book.slug}`}
                  className="animate-float book-shadow flex aspect-[4/5] flex-col justify-between rounded-3xl border border-border bg-surface p-5 transition hover:-translate-y-1 hover:border-coral/40"
                  style={{
                    animationDelay: `${i * 0.6}s`,
                    marginTop: i === 1 ? "2.5rem" : i === 2 ? "-1.5rem" : 0,
                  }}
                >
                  <span className="text-4xl">{book.heroEmoji}</span>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">
                      {book.name}
                    </p>
                    <p className="text-xs text-ink-soft">{book.tagline}</p>
                  </div>
                </Link>
              ))}
              <Link
                href="/how-it-works"
                className="animate-float flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-coral/40 bg-coral-soft/40 p-5 text-center transition hover:-translate-y-1 hover:border-coral/70"
              >
                <span className="text-3xl">➕</span>
                <p className="text-xs font-semibold text-coral-dark">
                  Your story, next
                </p>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <div className="border-y border-border bg-cream-soft/60 py-6">
        <Container className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
          {TRUST_ITEMS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 text-sm font-medium text-ink-soft"
            >
              <Icon className="size-5 shrink-0 text-coral" />
              {label}
            </div>
          ))}
        </Container>
      </div>

      <section className="py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Pick their story"
            title="Three books. One question: whose quirks are we celebrating?"
            subtitle="Every book is written from scratch and illustrated to match — no two Kookibooks are ever the same."
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {BOOK_TYPES.map((book) => (
              <BookTypeCard key={book.id} book={book} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-ink py-20 text-cream">
        <Container className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="How it works"
            title="From quirks to a printed book in four easy steps"
            className="[&_h2]:text-cream [&_p]:text-cream/60"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-3">
                <span className="font-display flex size-10 items-center justify-center rounded-full bg-coral text-lg font-semibold text-white">
                  {i + 1}
                </span>
                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-cream/60">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
          <ButtonLink href="/how-it-works" variant="soft" className="w-fit">
            More about our process
          </ButtonLink>
        </Container>
      </section>

      <section className="py-20">
        <Container className="flex flex-col gap-10">
          <SectionHeading
            eyebrow="Loved by families"
            title="Don't just take our word for it"
          />
          <div className="grid gap-6 sm:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-6"
              >
                <StarRating />
                <blockquote className="flex-1 text-sm leading-relaxed text-ink-soft">
                  "{t.quote}"
                </blockquote>
                <figcaption className="text-sm font-semibold text-ink">
                  {t.name}
                  <span className="block text-xs font-normal text-ink-soft">
                    {t.book}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-[2.5rem] bg-coral px-8 py-16 text-center text-white">
            <h2 className="font-display max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
              Ready to see them as the hero of their own book?
            </h2>
            <p className="max-w-md text-white/85">
              Takes about five minutes to create. Delivered in a keepsake
              hardcover or softcover, straight to your door.
            </p>
            <ButtonLink href="/kids" size="lg" variant="secondary">
              Start creating — free preview
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
