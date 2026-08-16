import { BookOpen, Camera, PenTool, Truck } from "lucide-react";
import type { Metadata } from "next";
import { BookTypeCard } from "@/components/book-type-card";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { BOOK_TYPES } from "@/lib/products";

export const metadata: Metadata = { title: "How it works" };

const STEPS = [
  {
    icon: PenTool,
    title: "1. Tell us the details",
    body: "Pick a book, give us a name (or two), and three real quirks or traits. This is the raw material for the whole story, so the more specific, the funnier and more heartfelt the result.",
  },
  {
    icon: Camera,
    title: "2. Upload one photo",
    body: "A single clear, front-facing photo is all our illustration engine needs to keep your subject's face consistent across all ten pages.",
  },
  {
    icon: BookOpen,
    title: "3. We write & illustrate",
    body: "Our story engine drafts ten pages of rhyming verse woven around the details you gave us, then paints a matching illustration for every page — usually in about a minute.",
  },
  {
    icon: Truck,
    title: "4. Preview, tweak, and print",
    body: "Flip through the finished book right in your browser. Not happy with a line? Edit it inline. When you're ready, we print on demand and post it — no minimum order, no warehouse.",
  },
];

export default function HowItWorksPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="How it works"
        title="From quirks to a printed keepsake"
        subtitle="No design skills needed — you provide the details, we do the writing, illustrating, printing, and posting."
        className="mb-14"
      />
      <div className="mx-auto grid max-w-3xl gap-10">
        {STEPS.map((step) => (
          <div key={step.title} className="flex gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-coral-soft text-coral-dark">
              <step.icon className="size-6" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">
                {step.title}
              </h2>
              <p className="mt-1 text-ink-soft">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20">
        <SectionHeading
          eyebrow="Ready?"
          title="Pick a book to start"
          className="mb-8"
        />
        <div className="grid gap-6 sm:grid-cols-3">
          {BOOK_TYPES.map((book) => (
            <BookTypeCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </Container>
  );
}
