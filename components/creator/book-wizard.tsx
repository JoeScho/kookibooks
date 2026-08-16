"use client";

import { AlertCircle, Loader2, Sparkles, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BookPageGrid } from "@/components/book-page-grid";
import { useCart } from "@/components/cart-provider";
import { EditionPicker } from "@/components/creator/edition-picker";
import { NarrativeStylePicker } from "@/components/creator/narrative-style-picker";
import { Button } from "@/components/ui/button";
import type { CartItem, GeneratedPage } from "@/lib/cart";
import {
  type BookType,
  EDITIONS,
  type EditionId,
  type NarrativeStyleId,
  SHIPPING_P,
} from "@/lib/products";
import { createClient } from "@/lib/supabase/client";
import { cn, formatGBP } from "@/lib/utils";

type Step = "details" | "photo" | "generating" | "preview";

const STEP_ORDER: Step[] = ["details", "photo", "generating", "preview"];

// Fixed 3-slot trait list — the array length never changes, so these are
// stable keys rather than array indices.
const TRAIT_KEYS = ["trait-1", "trait-2", "trait-3"];

export function BookWizard({ book }: { book: BookType }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [step, setStep] = useState<Step>("details");
  const [subjectName, setSubjectName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [traits, setTraits] = useState(["", "", ""]);
  const [story, setStory] = useState("");
  const [narrativeStyle, setNarrativeStyle] =
    useState<NarrativeStyleId>("poem");

  const [file, setFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [pages, setPages] = useState<GeneratedPage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [edition, setEdition] = useState<EditionId>("softcover");
  const [quantity, setQuantity] = useState(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const stepIndex = STEP_ORDER.indexOf(step);
  // Who gets drawn into the illustrations — the loved one when a book has a
  // separate "written for" subject (couples), otherwise whoever's name was
  // given directly (kids, pets — there's no separate narrator to name).
  const illustratedName = book.partnerLabel ? partnerName : subjectName;
  const detailsValid =
    subjectName.trim().length > 1 &&
    (!book.partnerLabel || partnerName.trim().length > 1) &&
    (book.inputMode === "story"
      ? story.trim().length >= 20
      : traits.some((t) => t.trim().length > 0));

  function handleFileSelect(selected: File | null) {
    setFile(selected);
    setPhotoPreview(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleGenerate() {
    if (!file) return;
    setError(null);
    setStep("generating");
    setUploading(true);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${book.slug}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("KookiBooks-photos")
        .upload(path, file);
      if (uploadError)
        throw new Error(`Photo upload failed: ${uploadError.message}`);

      const { data: publicUrlData } = supabase.storage
        .from("KookiBooks-photos")
        .getPublicUrl(path);
      setUploading(false);

      const res = await fetch("/api/generate-book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookType: book.id,
          subjectName: subjectName.trim(),
          partnerName: partnerName.trim() || undefined,
          narrativeStyle,
          ...(book.inputMode === "story"
            ? { story: story.trim() }
            : { traits: traits.filter((t) => t.trim().length > 0) }),
          photoUrl: publicUrlData.publicUrl,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Something went wrong.");

      setPages(result.pages);
      setStep("preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStep("photo");
      setUploading(false);
    }
  }

  function handleAddToCart() {
    const selectedEdition = EDITIONS.find((e) => e.id === edition)!;
    const item: CartItem = {
      id: crypto.randomUUID(),
      bookType: book.id,
      title: `${subjectName}${book.partnerLabel ? ` & ${partnerName}` : ""}'s ${book.name}`,
      subjectName,
      edition,
      quantity,
      unitAmountP: selectedEdition.priceP,
      coverImageUrl: pages[0]?.imageUrl,
      pages,
    };
    addItem(item);
    router.push("/cart");
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <ol className="mb-10 flex items-center justify-center gap-2">
        {STEP_ORDER.map((s, i) => (
          <li
            key={s}
            className={cn(
              "h-1.5 w-12 rounded-full transition-colors",
              i <= stepIndex ? "bg-coral" : "bg-ink/10",
            )}
          />
        ))}
      </ol>

      {step === "details" && (
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Tell us about them
            </h2>
            <p className="mt-1 text-ink-soft">{book.traitPrompt}</p>
          </div>

          <div
            className={cn("grid gap-4", book.partnerLabel && "sm:grid-cols-2")}
          >
            <div>
              <label
                htmlFor="subjectName"
                className="mb-1 block text-sm font-medium text-ink"
              >
                {book.subjectLabel}
              </label>
              <input
                id="subjectName"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="e.g. Leo"
                className="h-11 w-full rounded-xl border border-border bg-cream px-4 text-sm outline-none focus:border-coral"
              />
            </div>
            {book.partnerLabel && (
              <div>
                <label
                  htmlFor="partnerName"
                  className="mb-1 block text-sm font-medium text-ink"
                >
                  {book.partnerLabel}
                </label>
                <input
                  id="partnerName"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. Sam"
                  className="h-11 w-full rounded-xl border border-border bg-cream px-4 text-sm outline-none focus:border-coral"
                />
              </div>
            )}
          </div>

          {book.inputMode === "story" ? (
            <div>
              <label
                htmlFor="story"
                className="mb-2 block text-sm font-medium text-ink"
              >
                Their story
              </label>
              <textarea
                id="story"
                value={story}
                onChange={(e) => setStory(e.target.value)}
                placeholder={book.storyPlaceholder}
                rows={6}
                className="w-full rounded-xl border border-border bg-cream p-4 text-sm outline-none focus:border-coral"
              />
              <p className="mt-1.5 text-xs text-ink-soft">
                A paragraph or two is plenty — we'll do the rest. Need
                inspiration? {book.examplePrompts[0]}
              </p>
            </div>
          ) : (
            <div>
              <span className="mb-2 block text-sm font-medium text-ink">
                Three quirks or traits
              </span>
              <div className="flex flex-col gap-2">
                {traits.map((trait, i) => (
                  <input
                    key={TRAIT_KEYS[i]}
                    value={trait}
                    onChange={(e) => {
                      const next = [...traits];
                      next[i] = e.target.value;
                      setTraits(next);
                    }}
                    placeholder={
                      i === 0 ? book.traitPlaceholder : `Quirk ${i + 1}`
                    }
                    className="h-11 w-full rounded-xl border border-border bg-cream px-4 text-sm outline-none focus:border-coral"
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="mb-2 block text-sm font-medium text-ink">
              Style
            </span>
            <NarrativeStylePicker
              value={narrativeStyle}
              onChange={setNarrativeStyle}
            />
          </div>

          <Button
            disabled={!detailsValid}
            onClick={() => setStep("photo")}
            size="lg"
          >
            Continue to photo
          </Button>
        </div>
      )}

      {step === "photo" && (
        <div className="flex flex-col gap-6 rounded-3xl border border-border bg-surface p-6 sm:p-8">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Upload one clear photo
            </h2>
            <p className="mt-1 text-ink-soft">
              A front-facing, well-lit photo works best — we'll draw{" "}
              {illustratedName || "them"} into every page.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square w-full max-w-xs mx-auto flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-cream-soft text-ink-soft transition hover:border-coral/50"
          >
            {photoPreview ? (
              <Image
                src={photoPreview}
                alt="Selected photo preview"
                width={320}
                height={320}
                className="size-full rounded-3xl object-cover"
                unoptimized
              />
            ) : (
              <>
                <Upload className="size-8" />
                <span className="text-sm font-medium">
                  Click to upload a photo
                </span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => setStep("details")}
              className="sm:w-40"
            >
              Back
            </Button>
            <Button
              disabled={!file}
              onClick={handleGenerate}
              size="lg"
              className="flex-1"
            >
              <Sparkles className="size-4" />
              Create their book
            </Button>
          </div>
        </div>
      )}

      {step === "generating" && (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface p-16 text-center">
          <Loader2 className="size-10 animate-spin text-coral" />
          <h2 className="font-display text-xl font-semibold text-ink">
            {uploading
              ? "Uploading your photo…"
              : "Writing and illustrating their story…"}
          </h2>
          <p className="max-w-sm text-sm text-ink-soft">
            This usually takes about a minute. We're{" "}
            {book.inputMode === "story"
              ? "expanding their story into a book and painting"
              : `weaving ${subjectName || "their"} quirks into a story and painting`}{" "}
            each scene to match.
          </p>
        </div>
      )}

      {step === "preview" && (
        <div className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Their book is ready! 🎉
            </h2>
            <p className="mt-1 text-ink-soft">
              Flip through the preview, then choose your edition. Pages are
              watermarked until you order — the printed book isn't.
            </p>
          </div>

          <BookPageGrid
            pages={pages}
            watermark
            editable
            onPageTextChange={(pageNumber, text) => {
              setPages((prev) =>
                prev.map((p) =>
                  p.pageNumber === pageNumber ? { ...p, storyText: text } : p,
                ),
              );
            }}
          />

          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <h3 className="font-display mb-4 text-lg font-semibold text-ink">
              Choose your edition
            </h3>
            <EditionPicker value={edition} onChange={setEdition} />

            <div className="mt-6 flex items-center justify-between">
              <label
                htmlFor="quantity"
                className="text-sm font-medium text-ink"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
                className="h-10 w-20 rounded-lg border border-border bg-cream px-3 text-center text-sm"
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm text-ink-soft">
              <span>Plus {formatGBP(SHIPPING_P)} shipping at checkout</span>
              <span className="font-display text-xl font-semibold text-ink">
                {formatGBP(
                  (EDITIONS.find((e) => e.id === edition)?.priceP ?? 0) *
                    quantity,
                )}
              </span>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="mt-6 w-full">
              Add to basket
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
