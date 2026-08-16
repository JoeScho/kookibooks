# TODO — Fixed-Template Story & Composite Pipeline

Working notes for picking this back up. Context/architecture lives in the
approved plan and `UPDATES.md`; this file just tracks what's left.

## Where things stand

Implemented and passing `tsc`/`biome`/`npm run build`:

- `lib/templates/{types,kids,pets,couples}.json` — three 24-page story
  templates (5 dynamic pages each: 3 trait-anchored + story-open +
  story-climax, rest fixed).
- `lib/story-engine.ts` — `adaptStoryTemplate()`, token substitution +
  batched Gemini call for dynamic pages (and for all pages if the buyer
  picked "prose" style).
- `lib/ai.ts` — `generateHeroPoses()`: renders each distinct pose once,
  then `fal-ai/imageutils/rembg` for a transparent cutout. "Subject" mode
  (pets) is pure text-to-image on `fal-ai/fast-sdxl` — the same model and
  style wording as the background art — driven by `appearanceDescription`,
  not the photo. An earlier image-to-image version kept the photo likeness
  but rendered in a visibly different style than the backgrounds (sticker
  effect); before/after: https://claude.ai/code/artifact/2687897b-038f-426e-acba-77c46c1e98ea.
  "Face" mode (kids/couples, human) is still Flux PuLID, unchanged — the
  same style-coherence problem is still open there, see below.
- `lib/composer.ts` — `compositePage()` via `sharp`, bottom-anchored
  (`position: "bottom"`) so the hero's feet land on a consistent line
  regardless of its own aspect ratio — without this it "floats" inside its
  box. Combined with more conservative `compositeSlot` sizing (see below),
  fixes the placement bug caught live: hero perched on furniture, standing
  on a table, or bigger than the bed and floating.
- `scripts/generate-story-templates.mjs` — the actual source of
  `lib/templates/*.json` (story text *and* compositeSlot geometry). All
  slot presets now share one bottom edge (`FLOOR_Y = 1440` on the
  1600-canvas) and are meaningfully smaller than the first pass — the
  bootstrapped background art has no real floor line to calibrate against,
  so one consistent baseline across all 24 pages is the best a bootstrap
  can do. Re-run this (not manual JSON edits) after any slot/story change.
- `src/app/api/generate-book/route.ts` — rewritten around the template
  pipeline, returns all 24 composited pages, no paywall.
- `supabase/migrations/0004_preview_images_bucket.sql` — RLS + public flag
  for a new `KookiBooks-previews` bucket.
- `lib/products.ts` / `components/creator/book-wizard.tsx` — unified input:
  every book type now collects traits *and* a story about the illustrated
  subject.
- `docs/art-brief.md` / `docs/art-brief.html` — page-by-page art brief,
  generated from the templates. Published artifact:
  https://claude.ai/code/artifact/7ea2c6f3-cb9f-445f-90c5-5ea2b7922621
- Background art: **pets** (`public/templates/pets-v1/*.jpg`) is real
  fal.ai-bootstrapped art, 24/24, verified character-free and on-style.
  **kids** and **couples** are still the plain SVG placeholder backgrounds.
- Scripts: `templates:placeholders`, `templates:fal-backgrounds` (supports
  `--sample`, `--only=<bookType>`), `templates:art-brief`.
- **Marketing site now uses the generated art too, ahead of the create
  flow itself:** the homepage's 4 floating hero cards (`src/app/page.tsx`)
  each have an empty background image (reusing pets' generated
  backgrounds generically — they're just uninhabited rooms, so this works
  across book types as a stopgap); the `/pets` funnel landing page
  (`components/funnel-landing.tsx`) shows a real composited pet
  illustration (`public/marketing/pets-hero.jpg`, from
  `lib/products.ts` `heroImageSrc`); `/kids` and `/couples` show an empty
  background image there too (no real art yet, same stopgap as the
  homepage cards). Verified visually via a live browser check, not just a
  successful build — Next Image `fill` behind flex/absolute-positioned
  text needed a scrim overlay for legibility, tuned after a live look
  (dark text, not coral, on the "+" card).

## Verified end-to-end (pets)

Ran the real `/api/generate-book` route live (not a synthetic test): a
stand-in dog photo → all 24 pages generated, uploaded, and returned
correctly, in ~30s. Confirmed working:

- `describeSubjectAppearance` → `adaptStoryTemplate` → `generateHeroPoses`
  → `compositePage` → Supabase upload, the whole chain.
- Personalised text lands where expected (the story-open dynamic page
  picked up the real story's opening beat).
- The `KookiBooks-previews` bucket now exists for real (created directly —
  the migration file alone hadn't been applied to the live project, which
  would have 500'd the route on first use).
- Hero/background style coherence — see the "subject mode" note above.
- Hero placement/grounding — see the `lib/composer.ts` bottom-anchor note
  above. Caught by the user reviewing the live output (proportions/
  placement were visibly wrong — dog perched on a chest of drawers, on a
  table, floating and bigger than the bed), not by an automated check;
  re-ran the same live route after the fix and confirmed it's fixed too.
  Before/after (both fixes): https://claude.ai/code/artifact/2687897b-038f-426e-acba-77c46c1e98ea

Not yet run live: "face" mode (kids/couples) end-to-end, or the "prose"
narrative-style reflow path.

## Next up

1. **Generate kids + couples backgrounds**, same recipe as pets:
   ```
   node --env-file=.env.local scripts/generate-fal-backgrounds.mjs --sample --only=kids
   ```
   Check the sample (character-free, on-style, matches the scene) before
   running the full 24 — `--only=kids` / `--only=couples` without
   `--sample`. Re-run `npm run templates:art-brief` after if any
   `sceneDescription`s changed, and republish the artifact.
2. **Solve hero/background style coherence for "face" mode too** (kids,
   couples) before generating their backgrounds for real — Flux PuLID's
   render style hasn't been checked against `fast-sdxl` backgrounds yet,
   and per the pets experience it likely won't match by default. PuLID is
   there specifically for its face-identity lock (pure text-to-image, as
   used for pets, isn't an option for a recognisable human face), so the
   fix will need to be different — e.g. a style-transfer pass after PuLID,
   not simply switching models.
3. **Run the wizard end-to-end for real** for kids/couples too, and for
   the "prose" narrative style — only pets/poem has been live-tested.
4. **Decide what to commit** — `public/templates/pets-v1/*.jpg` is ~5.6MB
   of real art; the rest is small placeholder SVGs. Review before
   committing (see the git-history-bloat discussion this was built under —
   compressed-and-committed was the agreed approach).

## Before this goes live for real customers

- Replace **all** bootstrapped fal.ai backgrounds (pets included) with real
  art per the brief — they were always meant as a stand-in, not final
  assets.
- Review/edit the story copy in `lib/templates/*.json` — it's a first
  draft, not final brand copy (per the plan, easy to hand-edit the JSON
  text without touching code).
- Print quality: backgrounds are JPEG quality 78 at 1600×1600, hero renders
  at 1024×1024 upscaled — check that's acceptable at actual print size/DPI
  before real orders go out (see the existing caveat in `lib/pdf.ts` about
  source-resolution limits).
- No abuse/cost guardrail on `/api/generate-book` beyond what the fixed
  pipeline itself bounds (~5–10 fal.ai calls/request now, vs. up to 24
  before) — worth a rate limit if this sees real traffic before Stripe
  gates it.
- Consider using the API's returned `title` (currently ignored by
  `book-wizard.tsx`, which builds its own title string) for the cart
  item/cover instead.
- Grounding is a bootstrap-quality heuristic (one shared floor line, not
  per-background calibration) — worth revisiting once real artist
  backgrounds exist, since those can be drawn *knowing* the floor line and
  will place/scale better than any generic heuristic can.
