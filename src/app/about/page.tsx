import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Our story" };

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <SectionHeading
          eyebrow="Our story"
          title="Every quirk has a story"
          align="left"
          className="mb-8"
        />
        <div className="flex flex-col gap-5 text-ink-soft leading-relaxed">
          <p>
            Kookibooks started with a simple observation: the things we tease
            each other about — the dog's vendetta against the vacuum, the
            toddler who won't sleep without a plastic dinosaur, the partner who
            narrates the cat's inner monologue — are usually the best stories we
            have. We just weren't writing them down.
          </p>
          <p>
            So we built a small studio that does exactly that. Tell us the
            quirk, upload a photo, and in a few minutes we write and illustrate
            a real, printed book that turns it into the plot. No design
            software, no waiting weeks for a back-and-forth with an illustrator
            — just a genuinely personal keepsake, made for the people (and pets)
            who put up with each other's nonsense.
          </p>
          <p>
            We're a small, UK-based team, and every book is printed on demand —
            nothing sits in a warehouse waiting to be bought. That keeps things
            simple, keeps waste down, and means the book you get was made
            because you ordered it.
          </p>
        </div>
        <div className="mt-10">
          <ButtonLink href="/kids">Start your book</ButtonLink>
        </div>
      </div>
    </Container>
  );
}
