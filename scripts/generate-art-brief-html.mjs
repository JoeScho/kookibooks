#!/usr/bin/env node
// Renders docs/art-brief.html — a browsable version of docs/art-brief.md,
// generated straight from lib/templates/*.json so it can never drift out
// of sync with what the pipeline actually renders. Self-contained (no
// external fonts/scripts/images) so it can be published as a Claude
// Artifact. Re-run any time a template's pages/scenes change.
//
// Usage: node scripts/generate-art-brief-html.mjs

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const TEMPLATES_DIR = path.join(ROOT, "lib", "templates");
const OUT_PATH = path.join(ROOT, "docs", "art-brief.html");

// Book-type -> brand accent, matching lib/products.ts BOOK_TYPES[].accent
// (kids: sun, pets: mint, couples: coral) — reused here so each template's
// section is colour-coded the same way it already is across the app.
const BOOK_TYPE_META = {
  kids: {
    label: "Kids",
    fullName: "Custom Kids' Storybook",
    accentVar: "--sun",
    accentInkVar: "--sun-ink",
  },
  pets: {
    label: "Pets",
    fullName: "Pet Quirks Book",
    accentVar: "--mint",
    accentInkVar: "--mint-ink",
  },
  couples: {
    label: "Couples",
    fullName: "Beige Flags Book",
    accentVar: "--coral",
    accentInkVar: "--coral-ink",
  },
};

const DYNAMIC_LABEL = {
  trait: (i) => `Trait ${i + 1}`,
  "story-open": () => "Story opening",
  "story-climax": () => "Story climax",
};

function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

const CANVAS = 1600;

function slotDiagram(slot, accentVar) {
  const s = (n) => +(n / (CANVAS / 100)).toFixed(2);
  const x = s(slot.x);
  const y = s(slot.y);
  const w = s(slot.width);
  const h = s(slot.height);
  const flipMark = slot.flip
    ? `<text x="50" y="9" text-anchor="middle" font-size="7" fill="var(${accentVar})">mirrored ⇋</text>`
    : "";
  return `
  <svg viewBox="0 0 100 100" role="img" aria-label="On the 1600 by 1600 background, leave the area at x ${slot.x}, y ${slot.y}, width ${slot.width}, height ${slot.height} open for the composited hero character.">
    <rect x="1" y="1" width="98" height="98" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="1"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2"
          fill="var(${accentVar})" fill-opacity="0.16"
          stroke="var(${accentVar})" stroke-width="1.4" stroke-dasharray="3 2.4"/>
    ${flipMark}
  </svg>`;
}

function renderPageCard(page, meta) {
  const dynamic = page.dynamic
    ? DYNAMIC_LABEL[page.dynamic.anchor](page.dynamic.traitIndex)
    : null;
  const storyLines = esc(page.textTemplate).split("\n").join("<br/>");

  return `
  <article class="card" data-page="${page.pageNumber}">
    <header class="card-head">
      <span class="page-no">${String(page.pageNumber).padStart(2, "0")}</span>
      <div class="badges">
        <span class="badge pose">${esc(page.pose)}</span>
        ${dynamic ? `<span class="badge dynamic">dynamic — ${esc(dynamic)}</span>` : ""}
      </div>
    </header>

    <div class="card-body">
      <div class="diagram" style="color: var(${meta.accentInkVar})">
        ${slotDiagram(page.compositeSlot, meta.accentVar)}
      </div>
      <div class="scene">
        <p class="scene-text">${esc(page.sceneDescription)}</p>
        <blockquote class="story">${storyLines}</blockquote>
        ${dynamic ? `<p class="hint">Text is personalised per buyer — the scene above is what stays fixed and must match the art.</p>` : ""}
      </div>
    </div>

    <footer class="card-foot">
      <code>public${page.baseImageAsset}</code>
      <span class="slot-nums">x=${page.compositeSlot.x} y=${page.compositeSlot.y} w=${page.compositeSlot.width} h=${page.compositeSlot.height}</span>
    </footer>
  </article>`;
}

function renderSection(template) {
  const meta = BOOK_TYPE_META[template.bookType];
  const cards = template.pages.map((p) => renderPageCard(p, meta)).join("\n");
  return `
  <section class="template" id="tpl-${template.bookType}" data-book-type="${template.bookType}" style="--section-accent: var(${meta.accentVar}); --section-accent-ink: var(${meta.accentInkVar})">
    <div class="template-intro">
      <h2>${esc(meta.fullName)}</h2>
      <p class="template-meta"><code>${esc(template.templateId)}</code></p>
      <p class="template-title">Title: <em>${esc(template.titleTemplate)}</em></p>
    </div>
    <div class="grid">
      ${cards}
    </div>
  </section>`;
}

async function main() {
  const templateFiles = ["kids.json", "pets.json", "couples.json"];
  const templates = await Promise.all(
    templateFiles.map(async (f) =>
      JSON.parse(await readFile(path.join(TEMPLATES_DIR, f), "utf8")),
    ),
  );

  const tabs = templates
    .map((t, i) => {
      const meta = BOOK_TYPE_META[t.bookType];
      return `<button class="tab${i === 0 ? " active" : ""}" data-target="tpl-${t.bookType}" style="--tab-accent: var(${meta.accentVar}); --tab-accent-ink: var(${meta.accentInkVar})">${esc(meta.label)}</button>`;
    })
    .join("\n");

  const sections = templates.map(renderSection).join("\n");

  const html = `<title>Kookibooks Art Brief</title>
<style>
  :root {
    --bg: #fffbf0;
    --surface: #ffffff;
    --surface-2: #fff6e0;
    --ink: #1e293b;
    --ink-soft: #475569;
    --border: #f1ede1;
    --border-strong: #e7ddc7;

    --sun: #e0a72e;
    --sun-ink: #7a5514;
    --sun-bg: #fff3d6;
    --mint: #2f9e6f;
    --mint-ink: #1f6e4c;
    --mint-bg: #ddf3e8;
    --coral: #ff6b52;
    --coral-ink: #b13d27;
    --coral-bg: #ffe4de;
  }

  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      --bg: #18140f;
      --surface: #221c15;
      --surface-2: #271f16;
      --ink: #f3ecdc;
      --ink-soft: #b7ab93;
      --border: #382e21;
      --border-strong: #473927;

      --sun: #f0bb52;
      --sun-ink: #f0bb52;
      --sun-bg: #3a2c12;
      --mint: #5cc796;
      --mint-ink: #5cc796;
      --mint-bg: #16332590;
      --coral: #ff8a72;
      --coral-ink: #ff8a72;
      --coral-bg: #3d2018;
    }
  }
  :root[data-theme="dark"] {
    --bg: #18140f;
    --surface: #221c15;
    --surface-2: #271f16;
    --ink: #f3ecdc;
    --ink-soft: #b7ab93;
    --border: #382e21;
    --border-strong: #473927;

    --sun: #f0bb52;
    --sun-ink: #f0bb52;
    --sun-bg: #3a2c12;
    --mint: #5cc796;
    --mint-ink: #5cc796;
    --mint-bg: #16332590;
    --coral: #ff8a72;
    --coral-ink: #ff8a72;
    --coral-bg: #3d2018;
  }

  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--ink);
    font-family: -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
    line-height: 1.5;
  }
  h1, h2 {
    font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
    font-weight: 600;
    text-wrap: balance;
  }
  code, .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }

  .page {
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 20px 96px;
  }

  header.top {
    position: sticky;
    top: 0;
    z-index: 5;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--border);
  }
  .top-inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 22px 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .eyebrow {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  h1 { font-size: clamp(1.5rem, 1.1rem + 1.6vw, 2.1rem); margin: 2px 0 0; }
  .lede {
    max-width: 68ch;
    color: var(--ink-soft);
    font-size: 0.96rem;
    margin: 4px 0 0;
  }

  .tabs {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .tab {
    appearance: none;
    border: 1px solid var(--border-strong);
    background: var(--surface);
    color: var(--ink);
    border-radius: 999px;
    padding: 7px 16px;
    font: inherit;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tab::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--tab-accent);
  }
  .tab.active {
    border-color: var(--tab-accent);
    color: var(--tab-accent-ink);
    background: color-mix(in srgb, var(--tab-accent) 14%, var(--surface));
  }
  .tab:focus-visible { outline: 2px solid var(--tab-accent); outline-offset: 2px; }

  .template { padding-top: 32px; }
  .template[hidden] { display: none; }
  .template-intro {
    padding: 20px 22px;
    margin-bottom: 22px;
    border: 1px solid var(--border);
    border-left: 4px solid var(--section-accent);
    border-radius: 10px;
    background: var(--surface);
  }
  .template-intro h2 { font-size: 1.3rem; margin: 0 0 4px; }
  .template-meta { margin: 0 0 6px; color: var(--ink-soft); font-size: 0.85rem; }
  .template-title { margin: 0; color: var(--ink-soft); font-size: 0.92rem; }
  .template-title em { color: var(--ink); font-style: normal; font-weight: 600; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
    gap: 16px;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 12px 14px 0;
  }
  .page-no {
    font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--ink-soft);
  }
  .badges { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .badge {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 999px;
    background: var(--surface-2);
    color: var(--ink-soft);
    white-space: nowrap;
  }
  .badge.dynamic {
    background: color-mix(in srgb, var(--section-accent) 20%, var(--surface));
    color: var(--section-accent-ink);
  }

  .card-body {
    display: grid;
    grid-template-columns: 88px 1fr;
    gap: 12px;
    padding: 10px 14px 12px;
    align-items: start;
  }
  .diagram svg { width: 100%; height: auto; display: block; }
  .scene-text { margin: 0 0 8px; font-size: 0.9rem; }
  .story {
    margin: 0 0 6px;
    padding: 8px 10px;
    border-left: 2px solid var(--border-strong);
    background: var(--surface-2);
    border-radius: 0 8px 8px 0;
    font-size: 0.84rem;
    font-style: italic;
    color: var(--ink-soft);
  }
  .hint { margin: 0; font-size: 0.74rem; color: var(--ink-soft); }

  .card-foot {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 14px;
    border-top: 1px dashed var(--border-strong);
    font-size: 0.72rem;
    color: var(--ink-soft);
    flex-wrap: wrap;
  }

  @media (max-width: 480px) {
    .card-body { grid-template-columns: 1fr; }
    .diagram { max-width: 160px; }
  }
</style>

<div class="page">
  <header class="top">
    <div class="top-inner">
      <div>
        <p class="eyebrow">Kookibooks &middot; background production</p>
        <h1>Art Brief</h1>
        <p class="lede">
          One background per page, 1600&times;1600px, matching the scene below.
          Leave the dashed area open — the hero character is composited on
          top separately per buyer (see <code>lib/ai.ts</code>). Style: simple,
          soft, gently-shaded storybook illustration in the spirit of classic
          <em>Winnie&#8209;the&#8209;Pooh</em> &mdash; warm muted colours, calm and
          timeless, not flat vector, not busy or hyper-rendered.
        </p>
      </div>
      <nav class="tabs" aria-label="Book type">
        ${tabs}
      </nav>
    </div>
  </header>

  <main>
    ${sections}
  </main>
</div>

<script>
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll(".template");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      sections.forEach((s) => {
        s.hidden = s.id !== tab.dataset.target;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
  sections.forEach((s, i) => { s.hidden = i !== 0; });
</script>
`;

  await writeFile(OUT_PATH, html);
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
