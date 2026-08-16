import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "font-display flex items-center gap-1.5 text-xl font-semibold tracking-tight text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="flex h-8 w-8 -rotate-6 items-center justify-center rounded-lg bg-coral text-base text-white"
      >
        📖
      </span>
      Kookibooks
    </Link>
  );
}
