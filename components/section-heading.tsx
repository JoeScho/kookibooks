import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="text-sm font-semibold uppercase tracking-wider text-coral">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display max-w-2xl text-3xl font-semibold text-balance text-ink sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-xl text-balance text-lg text-ink-soft">
          {subtitle}
        </p>
      )}
    </div>
  );
}
