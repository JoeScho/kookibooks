import "server-only";
import path from "node:path";
import sharp from "sharp";
import type { CompositeSlot } from "@/lib/templates/types";

/**
 * Composites one hero pose cutout onto one page's fixed background art,
 * producing the final page image — the "layered composite" pipeline (see
 * the fixed-template plan): background art is authored once per template
 * page, the hero is rendered once per pose (lib/ai.ts generateHeroPoses),
 * and every buyer's book is assembled by combining the two per page,
 * per `compositeSlot`.
 */
export async function compositePage(
  bgAssetPath: string, // e.g. "/templates/kids-v1/page-03-bg.png"
  heroCutout: Buffer,
  slot: CompositeSlot,
): Promise<Buffer> {
  const bgAbsolutePath = path.join(process.cwd(), "public", bgAssetPath);

  const resizedHero = await sharp(heroCutout)
    // `fit: "contain"` pads to the target box to preserve aspect ratio —
    // sharp defaults that padding to opaque black, which would frame every
    // composited hero in black bars. Force transparent padding instead.
    //
    // `position: "bottom"` matters just as much as the transparency fix:
    // without it, "contain" centers the hero vertically in the box, so any
    // hero image that's a different aspect ratio than the slot ends up
    // floating with padding underneath its feet instead of standing on the
    // slot's bottom edge. Anchoring to the bottom means the hero's feet
    // land at the same y-coordinate (`slot.y + slot.height`) every time,
    // regardless of the source image's own proportions — the one piece of
    // "grounding" this pipeline can guarantee, since the background art
    // itself isn't authored with a known floor line to align to (that's on
    // whoever draws/generates it — see docs/art-brief's compositeSlot spec).
    .resize(slot.width, slot.height, {
      fit: "contain",
      position: "bottom",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .flop(Boolean(slot.flip)) // mirror horizontally
    .toBuffer();

  return sharp(bgAbsolutePath)
    .composite([{ input: resizedHero, top: slot.y, left: slot.x }])
    .png()
    .toBuffer();
}

/** Fetches a hero pose cutout URL (from fal.ai) down into a Buffer, ready
 * for `compositePage`. */
export async function fetchImageBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Couldn't fetch hero image (${res.status})`);
  return Buffer.from(await res.arrayBuffer());
}
