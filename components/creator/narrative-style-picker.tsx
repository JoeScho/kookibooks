"use client";

import { Check } from "lucide-react";
import { NARRATIVE_STYLES, type NarrativeStyleId } from "@/lib/products";
import { cn } from "@/lib/utils";

export function NarrativeStylePicker({
  value,
  onChange,
}: {
  value: NarrativeStyleId;
  onChange: (id: NarrativeStyleId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {NARRATIVE_STYLES.map((style) => {
        const selected = style.id === value;
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              "flex flex-col gap-1 rounded-2xl border-2 p-4 text-left transition",
              selected
                ? "border-coral bg-coral-soft/40"
                : "border-border bg-cream hover:border-coral/40",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-ink">{style.label}</span>
              {selected && (
                <span className="flex size-5 items-center justify-center rounded-full bg-coral text-white">
                  <Check className="size-3.5" />
                </span>
              )}
            </div>
            <span className="text-sm text-ink-soft">{style.description}</span>
          </button>
        );
      })}
    </div>
  );
}
