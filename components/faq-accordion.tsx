export interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:content-none">
            {item.question}
            <span className="shrink-0 text-xl text-ink-soft transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
