#!/usr/bin/env node

// One-off bootstrap: generates a background image per page (no reference
// photo — these are environment-only, the hero character is composited on
// top separately per buyer, see lib/composer.ts) for every page in
// lib/templates/*.json, via fal.ai. Costs real fal.ai + Gemini credits.
//
// Two-step pipeline per template:
//   1. Gemini rewrites each page's story-facing `sceneDescription` into a
//      short, static, character-free environment description — the raw
//      sceneDescription is written to *include* the subject ("{{SUBJECT_NAME}}
//      waking up...") which a plain token-strip can't cleanly undo, and
//      pattern-matches too strongly to "a person is here" for the image
//      model to ignore.
//   2. fal-ai/fast-sdxl renders that environment, with `negative_prompt`
//      explicitly forbidding people/animals/characters — SDXL's
//      negative_prompt is far more reliable at suppressing an unwanted
//      subject than asking nicely in the positive prompt, which diffusion
//      models routinely ignore.
//
// These are a stand-in for real artist backgrounds (see docs/art-brief.md/
// .html for the brief) — replace public/templates/**/*-bg.jpg with real
// art whenever it's ready; nothing else needs to change, since
// lib/templates/*.json already points at those same paths.
//
// Usage:
//   node --env-file=.env.local scripts/generate-fal-backgrounds.mjs --sample
//     -> generates just pages 1 and 20 of each template (6 images), so you
//        can sanity-check style/cost before committing to the full batch.
//   node --env-file=.env.local scripts/generate-fal-backgrounds.mjs
//     -> generates every page of every template (72 images).
//   node --env-file=.env.local scripts/generate-fal-backgrounds.mjs --only=kids
//     -> generates every page of just one template.

import { mkdirSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fal } from "@fal-ai/client";
import { GoogleGenAI, Type } from "@google/genai";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "lib", "templates");
const PUBLIC_DIR = path.join(ROOT, "public");
const CANVAS = 1600;
const GENERATE_SIZE = 1024; // SDXL's native training resolution
const CONCURRENCY = 4;

// Kept textually identical (minus the "background/setting only" clause) to
// RENDER_STYLE_SUFFIX in lib/ai.ts, which now renders the hero character on
// this same model (`fal-ai/fast-sdxl`) for exactly this reason — matching
// wording on the same model is what keeps hero and background visually
// coherent. Keep both in sync if either changes.
const STYLE_POSITIVE =
  "vintage mid-century children's picture-book illustration, gouache and " +
  "watercolour texture, soft muted palette, hand-inked outlines, gentle " +
  "rounded shapes, warm nostalgic nursery-book quality, background/setting " +
  "illustration only";

const NEGATIVE_PROMPT =
  "person, people, human, man, woman, child, kid, boy, girl, face, hands, " +
  "body, figure, character, animal, dog, cat, pet, creature, silhouette, " +
  "statue, portrait, text, watermark, signature";

const args = process.argv.slice(2);
const isSample = args.includes("--sample");
const onlyArg = args.find((a) => a.startsWith("--only="));
const onlyBookTypes = onlyArg
  ? onlyArg.slice("--only=".length).split(",")
  : null;
const SAMPLE_PAGES = new Set([1, 20]);

function stripTokens(text) {
  return text
    .replaceAll("{{SUBJECT_NAME}}", "the subject")
    .replaceAll("{{FROM_NAME}}", "")
    .replace(/\s+/g, " ")
    .trim();
}

const ENVIRONMENTS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          pageNumber: { type: Type.INTEGER },
          environment: { type: Type.STRING },
        },
        required: ["pageNumber", "environment"],
      },
    },
  },
  required: ["pages"],
};

/**
 * Rewrites every page's sceneDescription into a short, static,
 * character-free environment description via Gemini — see the file
 * header for why a plain token-strip isn't enough.
 */
async function describeEnvironments(genAI, template) {
  const petNote =
    template.bookType === "pets"
      ? 'This is a pet-themed book: environments may include generic cushioned/cosy furniture or a small food bowl, but NEVER use the words "dog", "cat", "pet", or any animal name anywhere in the description, even to name furniture (say "a cushioned nook", not "a dog bed") — those words bias the image model into drawing the animal itself despite the no-animal rule below.'
      : "Do not depict any animal either.";

  const prompt = `
    You are a background/set illustrator's assistant for a storybook.
    For each numbered page below, rewrite its scene into a short (max 20
    words) description of ONLY the physical setting: place, objects,
    lighting, mood.

    Rules:
    - No people of any age, no characters, no figures of any kind.
    - ${petNote}
    - No verbs implying someone is present or acting (no "waking up",
      "walking", "standing", "playing") — describe the static place only.
    - Keep it recognisably the same setting/mood as the original scene.

    Pages:
    ${template.pages.map((p) => `${p.pageNumber}: ${stripTokens(p.sceneDescription)}`).join("\n")}

    Return strictly JSON with a "pages" array covering all ${template.pages.length} page numbers.
  `;

  const response = await genAI.models.generateContent({
    model: "gemini-flash-lite-latest",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: ENVIRONMENTS_SCHEMA,
    },
  });

  const text = response.text;
  if (!text)
    throw new Error(
      `No environment descriptions returned for ${template.bookType}`,
    );
  const parsed = JSON.parse(text);

  const map = new Map();
  for (const p of parsed.pages ?? []) {
    if (typeof p.pageNumber === "number" && typeof p.environment === "string") {
      map.set(p.pageNumber, p.environment);
    }
  }
  return map;
}

async function generateOne(environment, outPath) {
  const result = await fal.subscribe("fal-ai/fast-sdxl", {
    input: {
      prompt: `${environment}. ${STYLE_POSITIVE}.`,
      negative_prompt: NEGATIVE_PROMPT,
      image_size: { width: GENERATE_SIZE, height: GENERATE_SIZE },
      num_inference_steps: 30,
      guidance_scale: 7.5,
    },
  });
  const url = result.data.images[0].url;

  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Couldn't fetch generated image (${res.status})`);
  const bytes = Buffer.from(await res.arrayBuffer());

  // Upscale from SDXL's native 1024 to the template's 1600 canvas, and
  // re-encode for a predictable, compressed file size — these are
  // temporary bootstrap assets committed to git.
  const compressed = await sharp(bytes)
    .resize(CANVAS, CANVAS, { fit: "cover" })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();

  mkdirSync(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, compressed);
  return compressed.length;
}

async function runWithConcurrency(items, limit, worker) {
  const results = [];
  let cursor = 0;
  async function next() {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, next),
  );
  return results;
}

async function main() {
  if (!process.env.FAL_KEY || !process.env.GEMINI_API_KEY) {
    console.error(
      "FAL_KEY and/or GEMINI_API_KEY not set. Run with: node --env-file=.env.local scripts/generate-fal-backgrounds.mjs",
    );
    process.exit(1);
  }
  fal.config({ credentials: process.env.FAL_KEY });
  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const templateFiles = ["kids.json", "pets.json", "couples.json"];
  const jobs = [];

  for (const file of templateFiles) {
    const template = JSON.parse(
      await readFile(path.join(TEMPLATES_DIR, file), "utf8"),
    );
    if (onlyBookTypes && !onlyBookTypes.includes(template.bookType)) continue;

    const pagesForThisRun = isSample
      ? template.pages.filter((p) => SAMPLE_PAGES.has(p.pageNumber))
      : template.pages;
    if (pagesForThisRun.length === 0) continue;

    console.log(`Describing environments for ${template.bookType}...`);
    const environments = await describeEnvironments(genAI, {
      ...template,
      pages: pagesForThisRun,
    });

    for (const page of pagesForThisRun) {
      const environment = environments.get(page.pageNumber);
      if (!environment) {
        console.error(
          `No environment description for ${template.bookType} page ${page.pageNumber}, skipping`,
        );
        continue;
      }
      jobs.push({
        bookType: template.bookType,
        page,
        environment,
        outPath: path.join(PUBLIC_DIR, page.baseImageAsset),
      });
    }
  }

  console.log(
    `\nGenerating ${jobs.length} background${jobs.length === 1 ? "" : "s"} via fal.ai (fal-ai/fast-sdxl)...`,
  );

  const started = Date.now();
  let done = 0;
  let totalBytes = 0;

  await runWithConcurrency(jobs, CONCURRENCY, async (job) => {
    try {
      const bytes = await generateOne(job.environment, job.outPath);
      totalBytes += bytes;
      done++;
      console.log(
        `[${done}/${jobs.length}] ${job.bookType} page ${job.page.pageNumber} -> ` +
          `${path.relative(ROOT, job.outPath)} (${(bytes / 1024).toFixed(0)}KB)\n` +
          `    env: "${job.environment}"`,
      );
    } catch (err) {
      console.error(
        `FAILED: ${job.bookType} page ${job.page.pageNumber}:`,
        err instanceof Error ? err.message : err,
      );
    }
  });

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(
    `\nDone: ${done}/${jobs.length} images, ${(totalBytes / 1024 / 1024).toFixed(1)}MB total, ${seconds}s.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
