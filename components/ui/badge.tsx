import { cn } from "@/lib/utils";

const tones = {
  coral: "bg-coral-soft text-coral-dark",
  mint: "bg-mint text-mint-dark",
  sun: "bg-sun/40 text-ink",
  ink: "bg-ink/5 text-ink-soft",
};

export function Badge({
  tone = "coral",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
