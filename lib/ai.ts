import { fal } from "@fal-ai/client";
import {
  createPartFromBase64,
  createUserContent,
  GoogleGenAI,
  Type,
} from "@google/genai";
import type { NarrativeStyleId } from "@/lib/products";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
fal.config({ credentials: process.env.FAL_KEY });

export interface BookPage {
  pageNumber: number;
  storyText: string;
  imagePrompt: string;
  imageUrl?: string;
}

// Image generation (fal.ai) is the expensive step, billed per page — cap the
// page count here in code, not just in the prompt, since nothing guarantees
// the model actually honours "return exactly N pages". Kept low by default
// while testing; override via env once ready to scale back up to a full book.
const MAX_PAGES = Number(process.env.MAX_STORY_PAGES) || 2;

// Shared style language for illustrations — kept in one place so the
// Gemini-authored scene descriptions and the fal.ai render prompt point at
// the same aesthetic instead of fighting each other. Deliberately avoids
// "3D", "cartoon", "8k", "vibrant" — that combination is what pushes toward
// the generic, over-rendered, big-eyed "AI slop" look. Aiming instead for
// something calmer and more hand-made, with normal proportions.
const ART_STYLE =
  "a gentle, hand-illustrated storybook style with natural proportions and a warm, simple expression";
const RENDER_STYLE_SUFFIX =
  "soft hand-painted children's book illustration, gentle flat colours, warm muted palette, natural proportions, simple clean linework, painterly texture, understated and not overly stylised";

const STORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pageNumber: { type: Type.INTEGER },
          storyText: { type: Type.STRING },
          imagePrompt: { type: Type.STRING },
        },
        required: ["pageNumber", "storyText", "imagePrompt"],
      },
    },
  },
  required: ["pages"],
};

function styleInstruction(style: NarrativeStyleId = "poem"): string {
  return style === "prose"
    ? `Each "storyText" is 2-4 sentences of warm, flowing prose — a natural storytelling voice, no forced rhyme.`
    : `Each "storyText" is 2-4 lines of playful, rhythmic rhyming verse.`;
}

function isUsablePage(page: unknown): page is BookPage {
  if (!page || typeof page !== "object") return false;
  const p = page as Partial<BookPage>;
  return (
    typeof p.pageNumber === "number" &&
    typeof p.storyText === "string" &&
    p.storyText.trim().length > 0 &&
    typeof p.imagePrompt === "string" &&
    p.imagePrompt.trim().length > 0
  );
}

/**
 * Validates and normalizes the model's raw page array: drops any
 * malformed entries, sorts and caps at `MAX_PAGES`, and renumbers
 * sequentially so page N always corresponds to array index N-1 — that's
 * what `illustratePages` relies on to pair each image with the right page.
 * Throws on anything that doesn't amount to a usable story, which is what
 * stops `illustratePages` (the paid fal.ai step) from ever running against
 * a failed or empty generation.
 */
function normalizePages(rawPages: unknown): BookPage[] {
  const usable = Array.isArray(rawPages) ? rawPages.filter(isUsablePage) : [];
  if (usable.length === 0) {
    throw new Error(
      "The story engine didn't return a usable story. Please try again.",
    );
  }

  return usable
    .sort((a, b) => a.pageNumber - b.pageNumber)
    .slice(0, MAX_PAGES)
    .map((page, i) => ({ ...page, pageNumber: i + 1 }));
}

/** Shared Gemini call — both story modes below funnel through this. */
async function callStoryModel(prompt: string): Promise<BookPage[]> {
  const response = await genAI.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: STORY_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Invalid response from story engine");

  const parsed = JSON.parse(text) as { pages: unknown };
  return normalizePages(parsed.pages);
}

/**
 * Looks at the uploaded photo and returns a short, plain description of the
 * subject's actual appearance (breed, colouring, markings). Used only for
 * "subject" illustration mode (non-human subjects, e.g. pets) — Flux PuLID
 * (used for "face" mode) already grounds identity from the photo directly
 * via face embeddings, so it doesn't need this. The general image-to-image
 * model pets use has no equivalent identity lock, so without an explicit
 * text description the story prompt tends to drift onto a generic "cute
 * animal" rather than the actual pet in the photo.
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
 * Writes the storybook script with Gemini, weaving a short list of real
 * traits/quirks into a story we invent from scratch. Used by the kids
 * funnel. Image generation is a separate step (see `generateConsistentImage`
 * below), handled by fal.ai rather than Gemini.
 */
export async function generateStoryScript(
  subjectName: string,
  traits: string[],
  opts?: { genre?: "kids" | "pets"; style?: NarrativeStyleId },
): Promise<BookPage[]> {
  const genre = opts?.genre ?? "kids";
  const audience =
    genre === "kids"
      ? `a young child named ${subjectName}`
      : `a pet named ${subjectName}, narrated from the pet's own point of view`;
  const subjectDescriptor =
    genre === "kids" ? "illustrated character" : "illustrated animal character";

  const prompt = `
    You are an award-winning children's book author writing for Kookibooks, a
    warm, family-friendly, print-on-demand storybook studio. Write a charming
    ${MAX_PAGES}-page storybook about ${audience}.

    Weave these real traits/quirks into the plot naturally and affectionately
    — they should feel like the heart of the story, never mocked: ${traits.join(", ")}.

    Keep every page light, kind, and appropriate for all ages — funny and
    heartfelt, never mean-spirited, scary, or inappropriate.

    Return exactly ${MAX_PAGES} pages. ${styleInstruction(opts?.style)} Each
    "imagePrompt" is a detailed visual scene description for an illustrator,
    always describing the subject as "an ${subjectDescriptor} named
    ${subjectName}, drawn in ${ART_STYLE}".
  `;

  return callStoryModel(prompt);
}

/**
 * Writes the storybook script by expanding a real, free-text story into a
 * full narrative — used by the couples/beige-flags and pets funnels. Unlike
 * `generateStoryScript`, this doesn't invent a plot: the buyer's own story
 * IS the plot, embellished and given shape.
 *
 * `illustratedName` is the subject whose photo is the visual reference for
 * every page (a person for couples, a pet for pets). `fromName`, when given,
 * frames the story as written by that person for the illustrated subject —
 * omit it for pets, which are narrated in third person / from their own POV
 * rather than "written by" someone. `appearanceDescription`, when given
 * (see `describeSubjectAppearance`), is threaded into every imagePrompt so
 * the illustrations actually match what's in the photo.
 */
export async function generateStoryFromNarrative(
  illustratedName: string,
  story: string,
  opts?: {
    fromName?: string;
    appearanceDescription?: string;
    style?: NarrativeStyleId;
  },
): Promise<BookPage[]> {
  const framing = opts?.fromName
    ? `${opts.fromName} wrote you a real story about their loved one, ${illustratedName}, to turn into a gift book.`
    : `Here's a real story about ${illustratedName} to turn into a book.`;

  const appearanceLine = opts?.appearanceDescription
    ? `\n\n${illustratedName}'s actual appearance, for the illustrations: ${opts.appearanceDescription}. Every "imagePrompt" must reflect this — don't substitute a generic or different-looking subject.`
    : "";

  const prompt = `
    You are an award-winning children's book author writing for Kookibooks, a
    warm, family-friendly, print-on-demand storybook studio. ${framing}
    Expand it into a charming ${MAX_PAGES}-page storybook.

    Use their story as the central plot — don't replace it with something you
    invent. Give it a clear beginning, middle, and warm ending; you can
    embellish playfully, but the emotional heart and the specific, real
    details below must stay recognisable throughout.

    Their story, in their own words:
    """
    ${story}
    """
    ${appearanceLine}

    Keep every page light, kind, and appropriate for all ages — funny and
    heartfelt, never mean-spirited, scary, or inappropriate.

    Return exactly ${MAX_PAGES} pages. ${styleInstruction(opts?.style)} Each
    "imagePrompt" is a detailed visual scene description for an illustrator,
    always describing the subject as "${illustratedName}, drawn in
    ${ART_STYLE}"${opts?.appearanceDescription ? `, matching: ${opts.appearanceDescription}` : ""}.
  `;

  return callStoryModel(prompt);
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

type IllustrationMode = "face" | "subject";

/**
 * Renders one illustrated page via fal.ai, using the uploaded photo as a
 * reference so the subject stays consistent across every page.
 *
 * "face" mode uses Flux PuLID, which locks onto a human face — it hard-fails
 * ("no face detected") on anything else, so pets and other non-human
 * subjects use "subject" mode instead: a general image-to-image restyle
 * that doesn't require face landmarks. It has no equivalent identity lock,
 * so a *low* `strength` (which anchors tightly to the source photo's exact
 * pixels) seems like the fix — but it isn't: it repaints one composition
 * instead of generating the page's actual scene, producing the same
 * pose/background on every page, and a real-photo-lightly-repainted look
 * reads as uncanny rather than illustrated. Identity instead comes from the
 * imagePrompt's text appearance description (see `describeSubjectAppearance`
 * and `appearanceLine` below), which frees `strength` to run high enough
 * that the model actually draws each page's distinct scene.
 */
export async function generateConsistentImage(
  imagePrompt: string,
  facePhotoUrl: string,
  mode: IllustrationMode = "face",
): Promise<string> {
  const styledPrompt = `${imagePrompt}, ${RENDER_STYLE_SUFFIX}`;

  try {
    if (mode === "subject") {
      // No `image_size` here — this endpoint doesn't take one and inherits
      // the source photo's own dimensions. Pages render into a square frame
      // downstream (BookPageGrid, the print PDF) via center-crop, so a
      // non-square upload is handled, just not perfectly framed.
      //
      // strength is high: this is the model's "how much to deviate from the
      // source image" dial, and each page needs a genuinely different scene
      // (pose, background, action) rather than a repaint of one photo. The
      // appearance description baked into `imagePrompt` is what keeps the
      // subject recognisable at this strength, not the source pixels.
      const result = await fal.subscribe("fal-ai/flux/dev/image-to-image", {
        input: {
          prompt: styledPrompt,
          image_url: facePhotoUrl,
          strength: 0.85,
        },
      });
      return result.data.images[0].url;
    }

    const result = await fal.subscribe("fal-ai/flux-pulid", {
      input: {
        prompt: styledPrompt,
        reference_image_url: facePhotoUrl,
        image_size: "square_hd",
        guidance_scale: 3.5,
        num_inference_steps: 20,
      },
    });
    return result.data.images[0].url;
  } catch (err) {
    throw new Error(`Illustration failed: ${extractFalErrorDetail(err)}`);
  }
}

/** Generates every page's illustration in parallel. */
export async function illustratePages(
  pages: BookPage[],
  facePhotoUrl: string,
  mode: IllustrationMode = "face",
): Promise<BookPage[]> {
  return Promise.all(
    pages.map(async (page) => ({
      ...page,
      imageUrl: await generateConsistentImage(
        page.imagePrompt,
        facePhotoUrl,
        mode,
      ),
    })),
  );
}
