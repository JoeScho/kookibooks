import { Container } from "@/components/ui/container";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ink">
          {title}
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Last updated {updated}</p>
        <div className="prose-legal mt-8 flex flex-col gap-5 text-sm leading-relaxed text-ink-soft [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-ink">
          {children}
        </div>
      </div>
    </Container>
  );
}
