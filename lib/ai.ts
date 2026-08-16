import { fal } from "@fal-ai/client";
import {
  createPartFromBase64,
  createUserContent,
  GoogleGenAI,
} from "@google/genai";
import type { PoseId } from "@/lib/templates/types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
fal.config({ credentials: process.env.FAL_KEY });

export interface BookPage {
  pageNumber: number;
  storyText: string;
  // Carried through from the template's sceneDescription (see
  // lib/story-engine.ts) — a text description of what the page depicts.
  // No longer used to prompt a per-page image (images are composited from
  // fixed background art, see lib/composer.ts) — kept for debugging/QA.
  imagePrompt: string;
  imageUrl?: string;
}

// Shared style language for "subject" mode (non-human) hero renders —
// kept textually identical to STYLE_POSITIVE in
// scripts/generate-fal-backgrounds.mjs (that file can't import this one —
// it's a standalone script, this module has a Next-only `server-only`
// dependency chain) since hero and background now render on the same
// model (`fal-ai/fast-sdxl`, see below): matching wording is what actually
// keeps them visually coherent, not just conceptually similar-sounding
// language — a lesson learned the hard way (see the "flux/dev image-to-image
// hero vs fast-sdxl background" style-mismatch that prompted this).
// Keep both copies in sync if either changes.
const RENDER_STYLE_SUFFIX =
  "vintage mid-century children's picture-book illustration, gouache and watercolour texture, soft muted palette, hand-inked outlines, gentle rounded shapes, warm nostalgic nursery-book quality";

const RENDER_NEGATIVE_PROMPT =
  "photorealistic, photo, photograph, 3d render, glossy, plastic, " +
  "hyperrealistic, digital painting, sharp vector lines, high contrast, " +
  "harsh shading, cel shading, text, watermark, blurry, extra limbs, " +
  "deformed, multiple animals, person, human, depth of field, bokeh";

/**
 * Looks at the uploaded photo and returns a short, plain description of the
 * subject's actual appearance (breed, colouring, markings). Used only for
 * "subject" illustration mode (non-human subjects, e.g. pets) — Flux PuLID
 * (used for "face" mode) already grounds identity from the photo directly
 * via face embeddings, so it doesn't need this.
 *
 * This is now the *only* source of identity for "subject" mode — the hero
 * render is pure text-to-image (see `generateHeroPoseCutout`), not
 * conditioned on the photo at all, so a failure here isn't recoverable the
 * way it used to be. (Earlier this was best-effort on top of an
 * image-to-image render that used the photo directly; that image-to-image
 * approach got dropped — see the style-mismatch note on
 * `RENDER_STYLE_SUFFIX` — so this description is now load-bearing.)
 */
export async function describeSubjectAppearance(
  photoUrl: string,
): Promise<string> {
  const res = await fetch(photoUrl);
  if (!res.ok)
    throw new Error(`Couldn't fetch the photo to describe it (${res.status})`);

  const bytes = new Uint8Array(await res.arrayBuffer());
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = res.headers.get("content-type") || "image/jpeg";

  const response = await genAI.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: createUserContent([
      "In one short phrase (under 15 words), describe this animal's breed (or best guess), fur/feather colour, and any distinctive markings. Just the description, no preamble, no name.",
      createPartFromBase64(base64, mimeType),
    ]),
  });

  const text = response.text?.trim();
  if (!text) throw new Error("Couldn't describe the photo");
  return text;
}

/**
 * fal.ai wraps failed requests in an ApiError whose `.message` is just the
 * HTTP status text (e.g. "Unprocessable Entity") — the actual reason lives
 * in `.body`. Pull that out so failures are diagnosable instead of opaque.
 */
function extractFalErrorDetail(err: unknown): string {
  if (err && typeof err === "object" && "body" in err) {
    const body = (err as { body?: unknown }).body;
    if (body && typeof body === "object" && "detail" in body) {
      const detail = (body as { detail: unknown }).detail;
      if (typeof detail === "string") return detail;
      if (Array.isArray(detail)) {
        return detail
          .map((d) =>
            d && typeof d === "object" && "msg" in d
              ? String((d as { msg: unknown }).msg)
              : JSON.stringify(d),
          )
          .join("; ");
      }
    }
  }
  return err instanceof Error ? err.message : "Image generation failed.";
}

export type IllustrationMode = "face" | "subject";

const POSE_PROMPTS: Record<PoseId, string> = {
  greeting: "standing, warm open pose, looking at the viewer, friendly",
  curious: "leaning in slightly, head tilted, curious and alert expression",
  playing: "mid-motion, playful and animated, joyful energy",
  cozy: "sitting or curled up, relaxed and content, soft calm expression",
  walking: "mid-stride, walking forward, purposeful and cheerful",
};

/**
 * Renders one full-body pose of the hero character via fal.ai, then removes
 * the background so the result can be composited onto any page's fixed
 * artwork (see lib/composer.ts).
 *
 * "face" mode (human subjects — kids, couples) uses Flux PuLID, which locks
 * onto the uploaded photo's face via embeddings — it hard-fails ("no face
 * detected") on anything else, so non-human subjects use "subject" mode
 * instead.
 *
 * "subject" mode is pure text-to-image on `fal-ai/fast-sdxl` — the same
 * model the fixed background art is generated on (see
 * scripts/generate-fal-backgrounds.mjs) — driven entirely by
 * `appearanceDescription`, not the photo. An earlier version ran this as
 * image-to-image against the uploaded photo instead: it kept the subject
 * *recognisable*, but rendered in a different model's default aesthetic
 * (glossier, more "vector cartoon") than the watercolour background art,
 * so the composited result looked like a sticker pasted on rather than one
 * illustration. Dropping the photo conditioning and generating from the
 * text description alone, on the same model as the backgrounds, fixed the
 * coherence at the cost of the render being guided by a description of the
 * subject rather than the photo's exact pixels — an acceptable trade for a
 * storybook illustration, not a photo lookalike.
 */
async function generateHeroPoseCutout(
  pose: PoseId,
  facePhotoUrl: string,
  mode: IllustrationMode,
  appearanceDescription?: string,
): Promise<string> {
  let rawUrl: string;
  try {
    if (mode === "subject") {
      if (!appearanceDescription) {
        throw new Error(
          "Missing appearance description — required to render a subject-mode hero.",
        );
      }
      const prompt =
        `Full-body character illustration of a subject matching this ` +
        `appearance: ${appearanceDescription}. ${POSE_PROMPTS[pose]}, ` +
        `isolated on a plain white background. ${RENDER_STYLE_SUFFIX}.`;
      const result = await fal.subscribe("fal-ai/fast-sdxl", {
        input: {
          prompt,
          negative_prompt: RENDER_NEGATIVE_PROMPT,
          image_size: "square_hd",
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      });
      rawUrl = result.data.images[0].url;
    } else {
      const prompt = `Full-body character portrait, ${POSE_PROMPTS[pose]}, isolated on a plain flat white background, ${RENDER_STYLE_SUFFIX}.`;
      const result = await fal.subscribe("fal-ai/flux-pulid", {
        input: {
          prompt,
          reference_image_url: facePhotoUrl,
          image_size: "square_hd",
          guidance_scale: 3.5,
          num_inference_steps: 20,
        },
      });
      rawUrl = result.data.images[0].url;
    }
  } catch (err) {
    throw new Error(`Hero render failed: ${extractFalErrorDetail(err)}`);
  }

  try {
    const cutout = await fal.subscribe("fal-ai/imageutils/rembg", {
      input: { image_url: rawUrl },
    });
    return cutout.data.image.url;
  } catch (err) {
    throw new Error(`Background removal failed: ${extractFalErrorDetail(err)}`);
  }
}

/**
 * Renders every distinct pose a template needs, once each, in parallel.
 * Returns transparent-background cutout URLs keyed by pose, ready for
 * lib/composer.ts to composite onto each page's fixed background art.
 */
export async function generateHeroPoses(
  poses: PoseId[],
  facePhotoUrl: string,
  mode: IllustrationMode,
  appearanceDescription?: string,
): Promise<Record<PoseId, string>> {
  const distinctPoses = Array.from(new Set(poses));
  const entries = await Promise.all(
    distinctPoses.map(
      async (pose) =>
        [
          pose,
          await generateHeroPoseCutout(
            pose,
            facePhotoUrl,
            mode,
            appearanceDescription,
          ),
        ] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<PoseId, string>;
}
