import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <span className="text-6xl">📖</span>
      <h1 className="font-display text-3xl font-semibold text-ink">
        This page got lost in the story
      </h1>
      <p className="max-w-sm text-ink-soft">
        We couldn't find that page. Let's get you back to somewhere good.
      </p>
      <ButtonLink href="/">Back to home</ButtonLink>
    </Container>
  );
}
