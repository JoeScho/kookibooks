"use client";

import { Check } from "lucide-react";
import { EDITIONS, type EditionId } from "@/lib/products";
import { cn, formatGBP } from "@/lib/utils";

export function EditionPicker({
  value,
  onChange,
}: {
  value: EditionId;
  onChange: (id: EditionId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {EDITIONS.map((edition) => {
        const selected = edition.id === value;
        return (
          <button
            key={edition.id}
            type="button"
            onClick={() => onChange(edition.id)}
            className={cn(
              "flex flex-col gap-1 rounded-2xl border-2 p-4 text-left transition",
              selected
                ? "border-coral bg-coral-soft/40"
                : "border-border bg-surface hover:border-coral/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">{edition.name}</span>
              {selected && (
                <span className="flex size-5 items-center justify-center rounded-full bg-coral text-white">
                  <Check className="size-3.5" />
                </span>
              )}
            </div>
            <span className="text-sm text-ink-soft">{edition.description}</span>
            <span className="mt-1 font-semibold text-ink">
              {formatGBP(edition.priceP)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
