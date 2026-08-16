#!/usr/bin/env node
// Regenerates docs/art-brief.md from lib/templates/*.json — the single
// source of truth for both the code and this doc, so the brief can never
// drift out of sync with what the pipeline actually renders. Re-run any
// time a template's pages/scenes change.
//
// Usage: node scripts/generate-art-brief.mjs

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "lib", "templates");
const OUT_PATH = path.join(ROOT, "docs", "art-brief.md");

const TEMPLATE_FILES = ["kids.json", "pets.json", "couples.json"];

const BOOK_TYPE_LABEL = {
  kids: "Kids — Custom Kids' Storybook",
  pets: "Pets — Pet Quirks Book",
  couples: "Couples — Beige Flags Book",
};

const DYNAMIC_LABEL = (d) => {
  if (!d) return null;
  if (d.anchor === "trait") return `Dynamic — adapted for Trait ${d.traitIndex + 1}`;
  if (d.anchor === "story-open") return "Dynamic — adapted from the opening of their real story";
  if (d.anchor === "story-climax") return "Dynamic — adapted from the emotional high point of their real story";
  return "Dynamic";
};

function renderTemplate(template) {
  const lines = [];
  lines.push(`## ${BOOK_TYPE_LABEL[template.bookType] ?? template.bookType}`);
  lines.push("");
  lines.push(`Template ID: \`${template.templateId}\``);
  lines.push(`Title: ${template.titleTemplate}`);
  lines.push("");
  lines.push(
    "Each page below needs one background illustration, 1600×1600px, saved to the given path. " +
      "**Leave the composite slot area visually open** (no character already drawn there) — " +
      "the hero character is layered on top of this background separately at render time, at " +
      "the position/size given.",
  );
  lines.push("");

  for (const page of template.pages) {
    const dynamicNote = DYNAMIC_LABEL(page.dynamic);
    lines.push(`### Page ${page.pageNumber}${dynamicNote ? ` — ${dynamicNote}` : ""}`);
    lines.push("");
    lines.push(`- **File path:** \`public${page.baseImageAsset}\``);
    lines.push(`- **Hero pose on this page:** ${page.pose}`);
    lines.push(
      `- **Composite slot (leave this area open):** x=${page.compositeSlot.x}, y=${page.compositeSlot.y}, ` +
        `width=${page.compositeSlot.width}, height=${page.compositeSlot.height}` +
        `${page.compositeSlot.flip ? ", mirrored horizontally" : ""} (of a 1600×1600 canvas)`,
    );
    lines.push(`- **Scene to depict:** ${page.sceneDescription}`);
    lines.push(`- **Page text (for context/tone — not to be illustrated literally):**`);
    lines.push(`  > ${page.textTemplate.replace(/\n/g, "\n  > ")}`);
    if (dynamicNote) {
      lines.push(
        `  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_`,
      );
    }
    lines.push("");
  }

  return lines.join("\n");
}

async function main() {
  const sections = [];
  for (const file of TEMPLATE_FILES) {
    const template = JSON.parse(
      await readFile(path.join(TEMPLATES_DIR, file), "utf8"),
    );
    sections.push(renderTemplate(template));
  }

  const doc = `# Kookibooks — Background Art Brief

Generated from \`lib/templates/*.json\` — do not hand-edit this file, edit the
templates and re-run \`node scripts/generate-art-brief.mjs\` instead.

Every book type shares the same 24-page structure: one fixed background per
page, with a single hero character (rendered separately per buyer from their
uploaded photo, see \`lib/ai.ts\` \`generateHeroPoses\`) composited on top at
the given slot. Art style: simple, soft, gently-shaded storybook
illustration in the spirit of classic *Winnie-the-Pooh* — warm muted
colours, calm and timeless, not flat vector, not busy or hyper-rendered.

${sections.join("\n---\n\n")}
`;

  await writeFile(OUT_PATH, doc);
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
