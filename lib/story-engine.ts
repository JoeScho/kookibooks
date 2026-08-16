import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import type { BookPage } from "@/lib/ai";
import type { BookTypeId, NarrativeStyleId } from "@/lib/products";
import couplesTemplate from "@/lib/templates/couples.json";
import kidsTemplate from "@/lib/templates/kids.json";
import petsTemplate from "@/lib/templates/pets.json";
import type { StoryTemplate, TemplatePage } from "@/lib/templates/types";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TEMPLATES: Record<BookTypeId, StoryTemplate> = {
  kids: kidsTemplate as StoryTemplate,
  pets: petsTemplate as StoryTemplate,
  couples: couplesTemplate as StoryTemplate,
};

export function getStoryTemplate(bookType: BookTypeId): StoryTemplate {
  return TEMPLATES[bookType];
}

function substituteTokens(
  text: string,
  tokens: { subjectName: string; fromName?: string },
): string {
  return text
    .replaceAll("{{SUBJECT_NAME}}", tokens.subjectName)
    .replaceAll("{{FROM_NAME}}", tokens.fromName ?? "");
}

const ADAPTED_TEXT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pageNumber: { type: Type.INTEGER },
          storyText: { type: Type.STRING },
        },
        required: ["pageNumber", "storyText"],
      },
    },
  },
  required: ["pages"],
};

function styleInstruction(style: NarrativeStyleId): string {
  return style === "prose"
    ? `Write each "storyText" as 2-4 sentences of warm, flowing prose — a natural storytelling voice, no forced rhyme.`
    : `Write each "storyText" as 2-4 lines of playful, rhythmic rhyming verse.`;
}

export interface AdaptStoryInput {
  /** The illustrated subject — whoever the traits/story are about. For
   * couples this is the loved one being written about, not the buyer. */
  subjectName: string;
  /** Couples only: the buyer, for "written by" framing (the template's
   * {{FROM_NAME}} token). Omit for kids/pets. */
  fromName?: string;
  traits: string[]; // up to 3, matches template dynamic.traitIndex
  story: string; // free text, required
  style: NarrativeStyleId;
}

/**
 * Turns a fixed StoryTemplate into the actual 24-page book for one buyer.
 *
 * Fixed pages get their {{SUBJECT_NAME}}/{{FROM_NAME}} tokens substituted
 * directly — no LLM call, since the pre-written verse is already
 * authoritative and matches the linked background art exactly as authored.
 * The 5 `dynamic` pages (3 trait-anchored + story-open + story-climax, see
 * lib/templates/types.ts) are rewritten by Gemini to weave in the buyer's
 * actual traits/story while keeping each page's scene (and therefore its
 * background art and composited pose) unchanged.
 *
 * If the buyer picked "prose" style, the fixed pages' pre-written *rhyming*
 * text needs reflowing too so the whole book reads in one consistent
 * voice — those go through the same Gemini call as the dynamic pages in
 * that case. In the default "poem" style (which is how every fixed page is
 * already authored) no extra reflow is needed, so the common case only
 * ever sends the 5 dynamic pages to the model.
 */
export async function adaptStoryTemplate(
  bookType: BookTypeId,
  input: AdaptStoryInput,
): Promise<{ title: string; pages: BookPage[] }> {
  const template = getStoryTemplate(bookType);
  const tokens = { subjectName: input.subjectName, fromName: input.fromName };
  const title = substituteTokens(template.titleTemplate, tokens);

  const needsReflow = input.style === "prose";
  const pagesForModel = template.pages.filter((p) => p.dynamic || needsReflow);

  const adapted =
    pagesForModel.length > 0
      ? await adaptPagesWithModel(pagesForModel, input, tokens)
      : new Map<number, string>();

  const pages: BookPage[] = template.pages.map((p) => ({
    pageNumber: p.pageNumber,
    storyText:
      adapted.get(p.pageNumber) ?? substituteTokens(p.textTemplate, tokens),
    // Retained for callers that still want a text description of the
    // scene (e.g. logging/debugging) — the actual composite is driven by
    // baseImageAsset + pose + compositeSlot, not this prompt.
    imagePrompt: substituteTokens(p.sceneDescription, tokens),
  }));

  return { title, pages };
}

async function adaptPagesWithModel(
  pagesToAdapt: TemplatePage[],
  input: AdaptStoryInput,
  tokens: { subjectName: string; fromName?: string },
): Promise<Map<number, string>> {
  const traitLines = input.traits
    .map((t, i) => `  - Trait ${i + 1}: ${t}`)
    .join("\n");

  const pageBriefs = pagesToAdapt
    .map((p) => {
      const base = substituteTokens(p.textTemplate, tokens);
      const anchor = p.dynamic
        ? p.dynamic.anchor === "trait"
          ? `Weave in Trait ${p.dynamic.traitIndex + 1} naturally.`
          : p.dynamic.anchor === "story-open"
            ? `Draw on the opening/setup of their real story below.`
            : `Draw on the emotional high point of their real story below.`
        : `Keep the same meaning and scene — just restyle it, no new content.`;
      return `Page ${p.pageNumber} (scene: ${substituteTokens(p.sceneDescription, tokens)}):\nCurrent text: "${base}"\n${anchor}`;
    })
    .join("\n\n");

  const prompt = `
    You are an editor for Kookibooks, a warm, family-friendly, print-on-demand
    storybook studio. You're adapting specific pages of a pre-written
    storybook template for ${tokens.subjectName}.

    Traits/quirks (real, affectionate — never mocked):
${traitLines || "  (none given)"}

    Their real story, in their own words:
    """
    ${input.story}
    """

    For each page below, rewrite "storyText" to match its instruction while
    staying tightly anchored to its given scene — the illustration for each
    page is fixed and already drawn to match that scene, so the text must
    keep describing the same moment, just personalised.

    ${pageBriefs}

    Keep every page light, kind, and appropriate for all ages. ${styleInstruction(input.style)}
    Return strictly a JSON object with a "pages" array covering exactly
    these ${pagesToAdapt.length} page numbers.
  `;

  const response = await genAI.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ADAPTED_TEXT_SCHEMA,
    },
  });

  const text = response.text;
  if (!text) throw new Error("Invalid response from story engine");

  const parsed = JSON.parse(text) as {
    pages: { pageNumber: number; storyText: string }[];
  };

  const map = new Map<number, string>();
  for (const p of parsed.pages ?? []) {
    if (typeof p.pageNumber === "number" && typeof p.storyText === "string") {
      map.set(p.pageNumber, p.storyText);
    }
  }
  return map;
}
