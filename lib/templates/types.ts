// Shared shape for the fixed 24-page story templates in lib/templates/*.json.
// See UPDATES.md / the "Fixed-Template Story & Composite Image Pipeline"
// plan for the architecture this supports.

import type { BookTypeId } from "@/lib/products";

/**
 * The small, reusable set of hero character poses we render once per book
 * (see lib/ai.ts generateHeroPoses) and then composite onto every page's
 * background. Chosen per page to match that page's sceneDescription, not
 * assigned arbitrarily — that's part of what keeps image and story
 * coherent.
 */
export type PoseId = "greeting" | "curious" | "playing" | "cozy" | "walking";

export interface CompositeSlot {
  /** Top-left corner and size of the hero cutout, in pixels, against the
   * background asset's native canvas (authored at 1600x1600 — see
   * lib/templates/README.md). */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Composite the cutout mirrored horizontally — lets one rendered pose
   * face either direction without a second fal.ai render. */
  flip?: boolean;
}

/**
 * Marks a page whose text isn't fixed — it's adapted by the LLM to weave
 * in a real detail from the buyer's input, anchored to a specific trait or
 * to the opening/climax beat of their free-text story. See
 * lib/story-engine.ts.
 */
export type DynamicAnchor =
  | { anchor: "trait"; traitIndex: 0 | 1 | 2 }
  | { anchor: "story-open" | "story-climax" };

export interface TemplatePage {
  pageNumber: number; // 1..24
  /**
   * The brief: a short description of what's depicted on this page. This is
   * the contract linking three things that must agree — the background art
   * (supplied by the user, see baseImageAsset), the story text, and the
   * composited pose. Written once per page; everything else is derived to
   * match it.
   */
  sceneDescription: string;
  /** Path under /public to the background for this page, e.g.
   * "/templates/kids-v1/page-03-bg.jpg". Ultimately supplied by the user
   * (real artist art) — bootstrapped in the meantime via fal.ai, see
   * scripts/generate-fal-backgrounds.mjs. Authored/generated at 1600x1600
   * (see lib/pdf.ts PAGE_SIZE for the print-time downscale target). */
  baseImageAsset: string;
  /** Fixed base text with {{SUBJECT_NAME}} (and {{FROM_NAME}} on
   * couples-only pages) placeholders. Used as-is (after token
   * substitution) unless the buyer picked "prose" style, or this page is
   * `dynamic` — see lib/story-engine.ts adaptStoryTemplate. Authored as
   * rhyming verse, matching the default narrative style. */
  textTemplate: string;
  pose: PoseId;
  compositeSlot: CompositeSlot;
  dynamic?: DynamicAnchor;
}

export interface StoryTemplate {
  templateId: string;
  bookType: BookTypeId;
  /** May include {{SUBJECT_NAME}} / {{FROM_NAME}} tokens. */
  titleTemplate: string;
  pages: TemplatePage[]; // exactly 24, pageNumber 1..24
}
