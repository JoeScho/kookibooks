#!/usr/bin/env node
// Generates simple stand-in background images for every page referenced by
// lib/templates/*.json, so the composite pipeline (lib/composer.ts) is
// testable end-to-end before real artist backgrounds exist. NOT a
// deliverable — the user supplies real background art per
// lib/templates/*.json's `sceneDescription` (the art brief). Re-run any
// time after editing a template's page count/paths.
//
// Usage: node scripts/generate-placeholder-templates.mjs

import { mkdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "lib", "templates");
const PUBLIC_DIR = path.join(ROOT, "public");

const CANVAS = 1600;
// One flat colour per template so the three book types are visually
// distinguishable at a glance while testing.
const BG_COLOR_BY_BOOK_TYPE = {
  kids: "#FDE9C8",
  pets: "#D9F0E3",
  couples: "#FBE0E0",
};

function escapeXml(s) {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c],
  );
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

async function generatePlaceholder({ outPath, bgColor, label, scene }) {
  const sceneLines = wrapText(scene, 42).slice(0, 6);
  const tspans = sceneLines
    .map(
      (line, i) =>
        `<tspan x="${CANVAS / 2}" dy="${i === 0 ? 0 : 44}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  const svg = `
    <svg width="${CANVAS}" height="${CANVAS}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <rect x="24" y="24" width="${CANVAS - 48}" height="${CANVAS - 48}"
            fill="none" stroke="#ffffff" stroke-width="6" stroke-dasharray="16 12"/>
      <text x="${CANVAS / 2}" y="140" text-anchor="middle"
            font-family="sans-serif" font-size="56" font-weight="bold" fill="#33302b">
        ${escapeXml(label)}
      </text>
      <text x="${CANVAS / 2}" y="${CANVAS / 2 - sceneLines.length * 22}" text-anchor="middle"
            font-family="sans-serif" font-size="38" fill="#5c574f">
        ${tspans}
      </text>
      <text x="${CANVAS / 2}" y="${CANVAS - 80}" text-anchor="middle"
            font-family="sans-serif" font-size="28" fill="#8a8478">
        placeholder background — replace before launch
      </text>
    </svg>
  `;

  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(outPath);
}

async function main() {
  const templateFiles = ["kids.json", "pets.json", "couples.json"];
  let count = 0;

  for (const file of templateFiles) {
    const templatePath = path.join(TEMPLATES_DIR, file);
    const template = JSON.parse(await readFile(templatePath, "utf8"));

    for (const page of template.pages) {
      const outPath = path.join(PUBLIC_DIR, page.baseImageAsset);
      mkdirSync(path.dirname(outPath), { recursive: true });
      await generatePlaceholder({
        outPath,
        bgColor: BG_COLOR_BY_BOOK_TYPE[template.bookType] ?? "#EEEEEE",
        label: `${template.bookType} — page ${page.pageNumber}`,
        scene: page.sceneDescription,
      });
      count++;
    }
  }

  console.log(
    `Generated ${count} placeholder background images under public/templates/.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
