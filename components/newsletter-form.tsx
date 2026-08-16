"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setState("loading");
        setTimeout(() => setState("done"), 500);
      }}
      className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        disabled={state !== "idle"}
        placeholder="you@example.com"
        className="h-11 flex-1 rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-white/50 focus:border-coral focus:outline-none disabled:opacity-60"
      />
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={state !== "idle"}
        className="h-11"
      >
        {state === "done" ? "You're in! 🎉" : "Get 10% off"}
      </Button>
    </form>
  );
}
