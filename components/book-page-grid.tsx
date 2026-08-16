"use client";

import Image from "next/image";
import type { GeneratedPage } from "@/lib/cart";

const WATERMARK_SLOTS = ["wm-1", "wm-2", "wm-3", "wm-4", "wm-5", "wm-6"];

function SampleWatermark() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      <div className="grid -rotate-[28deg] grid-cols-2 gap-x-12 gap-y-10 pt-6 opacity-30">
        {WATERMARK_SLOTS.map((slot) => (
          <span
            key={slot}
            className="whitespace-nowrap text-sm font-bold uppercase tracking-widest text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.65)]"
          >
            Kookibooks Sample
          </span>
        ))}
      </div>
    </div>
  );
}

export function BookPageGrid({
  pages,
  watermark = false,
  editable = false,
  onPageTextChange,
}: {
  pages: GeneratedPage[];
  /** Overlay a "sample" watermark on every illustration — use for
   * pre-purchase previews so they're genuinely useful to look at without
   * being usable as a free stand-in for the printed (or downloaded) book. */
  watermark?: boolean;
  /** Let the reader edit story text inline (pre-purchase preview only). */
  editable?: boolean;
  onPageTextChange?: (pageNumber: number, text: string) => void;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {pages.map((page) => (
        <div
          key={page.pageNumber}
          className="overflow-hidden rounded-2xl border border-border bg-surface book-shadow"
        >
          <div className="relative aspect-square bg-cream-soft">
            {page.imageUrl ? (
              <Image
                src={page.imageUrl}
                alt={`Page ${page.pageNumber}`}
                fill
                className="object-cover"
                sizes="(min-width: 640px) 50vw, 100vw"
                unoptimized
              />
            ) : (
              <div className="flex size-full items-center justify-center text-4xl">
                📖
              </div>
            )}
            {watermark && <SampleWatermark />}
          </div>
          <div className="p-4">
            <p className="mb-1 text-xs font-semibold text-ink-soft">
              Page {page.pageNumber}
            </p>
            {editable ? (
              <textarea
                value={page.storyText}
                onChange={(e) =>
                  onPageTextChange?.(page.pageNumber, e.target.value)
                }
                rows={3}
                className="w-full resize-none rounded-lg border border-transparent bg-transparent p-1 text-sm text-ink italic outline-none transition hover:border-border focus:border-coral focus:bg-cream"
              />
            ) : (
              <p className="p-1 text-sm text-ink italic">{page.storyText}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
