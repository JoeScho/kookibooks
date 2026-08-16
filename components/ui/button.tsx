import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const variants = {
  primary: "bg-coral text-white hover:bg-coral-dark shadow-sm",
  secondary: "bg-ink text-cream hover:bg-ink/90",
  outline:
    "border-2 border-ink/15 text-ink hover:border-coral hover:text-coral bg-transparent",
  ghost: "text-ink hover:bg-ink/5",
  soft: "bg-coral-soft text-coral-dark hover:bg-coral-soft/70",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonProps = CommonProps & ComponentProps<"button">;
type LinkAsButtonProps = CommonProps & ComponentProps<typeof Link>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkAsButtonProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
