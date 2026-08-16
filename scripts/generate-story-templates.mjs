// Generator for lib/templates/{kids,pets,couples}.json — the source of
// truth for both the 24-page story arcs and each page's compositeSlot
// geometry. Not part of the app build — a content/authoring tool, run
// on-demand:
//   node scripts/generate-story-templates.mjs
//
// Re-run this after changing SLOTS/SLOT_BY_PAGE below (compositeSlot
// tuning) or any page's story text/scene/pose. It always regenerates all
// three templates in full — this is the only source for
// lib/templates/*.json, don't hand-edit those files directly.

import { writeFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.resolve(import.meta.dirname, "..", "lib", "templates");

// compositeSlot presets, all sharing one bottom edge (FLOOR_Y) so the hero
// "stands" at the same height on every page regardless of which preset a
// page uses — see lib/composer.ts's `position: "bottom"` resize, which is
// what actually anchors the hero's feet to a slot's bottom edge. This is a
// deliberate simplification: the AI-bootstrapped background art isn't
// authored with a known floor line, so there's no real per-background
// "correct" placement to target — a single consistent baseline across all
// 24 pages reads far better than 5 differently-anchored boxes scattered at
// arbitrary heights (which is what shipped first, and looked like the
// hero was floating/oversized on several pages — see the corresponding
// TODO/PLAN note). Real artist backgrounds, authored *for* this floor
// line, will land even better; this is the best a bootstrap can do.
const CANVAS = 1600;
const FLOOR_Y = 1440;
const slotAt = (width, height, x, flip) => ({
  x,
  y: FLOOR_Y - height,
  width,
  height,
  ...(flip ? { flip: true } : {}),
});
const SLOTS = {
  leftMedium: slotAt(360, 520, 140),
  rightMedium: slotAt(360, 520, CANVAS - 140 - 360, true),
  centerLarge: slotAt(460, 660, (CANVAS - 460) / 2),
  centerSmall: slotAt(260, 380, (CANVAS - 260) / 2),
  closeUpCenter: slotAt(520, 740, (CANVAS - 520) / 2),
};

// Shared per-page layout rhythm across all three templates: which preset
// slot to composite the hero pose into. Bookkeeping only — content/pose
// per page still varies by template.
const SLOT_BY_PAGE = [
  "leftMedium",
  "rightMedium",
  "centerLarge",
  "centerSmall",
  "leftMedium",
  "rightMedium",
  "centerLarge",
  "leftMedium",
  "rightMedium",
  "centerSmall",
  "leftMedium",
  "centerLarge",
  "rightMedium",
  "closeUpCenter",
  "centerSmall",
  "leftMedium",
  "centerLarge",
  "rightMedium",
  "leftMedium",
  "centerLarge",
  "rightMedium",
  "centerSmall",
  "closeUpCenter",
  "closeUpCenter",
];

// Pages 3, 7, 12, 17, 20 are dynamic (5 of 24) — spread across the arc:
// an early story-open beat, the three trait beats, and a late story-climax
// beat. Shared page numbers across templates for readability; not a hard
// requirement of the schema.
const DYNAMIC_BY_PAGE = {
  3: { anchor: "story-open" },
  7: { anchor: "trait", traitIndex: 0 },
  12: { anchor: "trait", traitIndex: 1 },
  17: { anchor: "trait", traitIndex: 2 },
  20: { anchor: "story-climax" },
};

function buildTemplate({
  templateId,
  bookType,
  titleTemplate,
  dirName,
  pages,
}) {
  const out = {
    templateId,
    bookType,
    titleTemplate,
    pages: pages.map((p, i) => {
      const pageNumber = i + 1;
      const slotName = SLOT_BY_PAGE[i];
      const page = {
        pageNumber,
        sceneDescription: p.scene,
        baseImageAsset: `/templates/${dirName}/page-${String(pageNumber).padStart(2, "0")}-bg.jpg`,
        textTemplate: p.text,
        pose: p.pose,
        compositeSlot: SLOTS[slotName],
      };
      if (DYNAMIC_BY_PAGE[pageNumber])
        page.dynamic = DYNAMIC_BY_PAGE[pageNumber];
      return page;
    }),
  };
  if (out.pages.length !== 24) {
    throw new Error(
      `${templateId}: expected 24 pages, got ${out.pages.length}`,
    );
  }
  return out;
}

const kids = buildTemplate({
  templateId: "kids-wonder-full-day-v1",
  bookType: "kids",
  titleTemplate: "{{SUBJECT_NAME}}'s Big Wonder-Full Day",
  dirName: "kids-v1",
  pages: [
    {
      scene:
        "{{SUBJECT_NAME}} waking up in a cosy bedroom, sunlight streaming in, stretching and grinning at the day ahead.",
      text: "In a cosy little room where the morning light creeps in,\nLived {{SUBJECT_NAME}} — and the day was about to begin!",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} at the breakfast table, humming, looking thoughtfully out the window, planning the day.",
      text: "Some days start slow, with a yawn and a stretch,\nBut {{SUBJECT_NAME}}'s days always come with a fetch —\nSomething to wonder, something to find,\nA whole day of adventure, still left to unwind.",
      pose: "curious",
    },
    {
      scene:
        "{{SUBJECT_NAME}} pausing at the front door, hand on the handle, a hint of something exciting about to unfold.",
      text: "And today was no ordinary day at all,\nBecause something was about to happen — big or small.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} striding down a garden path or street, backpack or toy in hand.",
      text: "Out the door and down the path, {{SUBJECT_NAME}} would go,\nWherever the wondering took them — fast or slow.",
      pose: "walking",
    },
    {
      scene:
        "Neighbours or friends waving hello as {{SUBJECT_NAME}} passes by.",
      text: "The whole street seemed to know their name,\nEvery wave and 'good morning!' was never quite the same.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} pausing curiously, peering around a corner or up at the sky.",
      text: "But {{SUBJECT_NAME}} had a feeling, right down in their toes,\nThat today held a secret nobody else knows.",
      pose: "curious",
    },
    {
      scene:
        "A signature quirky moment for {{SUBJECT_NAME}} in full swing — playful, a little silly, entirely them.",
      text: "Because {{SUBJECT_NAME}} was never quite like anyone else —\nAnd that's exactly why this story's worth itself.",
      pose: "playing",
    },
    {
      scene:
        "The joyful aftermath — toys scattered, laughter, a happy little mess.",
      text: "Wherever that led — however peculiar it seemed —\nIt turned an ordinary morning into something dreamed.",
      pose: "playing",
    },
    {
      scene:
        "Friends or family gathering round, delighted, laughing with {{SUBJECT_NAME}}.",
      text: "Friends came running when they heard the commotion,\n'That's so {{SUBJECT_NAME}}!' — with total devotion.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} looking at a small puzzle — a stuck door, a tangled kite string.",
      text: "Then — uh oh — a puzzle popped up out of nowhere,\nSomething tricky, something that needed some care.",
      pose: "curious",
    },
    {
      scene:
        "{{SUBJECT_NAME}} actively solving the puzzle, hands-on, determined and cheerful.",
      text: "But {{SUBJECT_NAME}} never once thought to give up,\nThey rolled up their sleeves and figured it up.",
      pose: "playing",
    },
    {
      scene: "A second, distinct signature quirky moment for {{SUBJECT_NAME}}.",
      text: "And just when you'd think the day had run out of surprise,\nAnother little {{SUBJECT_NAME}}-ism opened everyone's eyes.",
      pose: "playing",
    },
    {
      scene:
        "The ripple effect of the quirk spreading warmth and fun through the setting.",
      text: "It turned the afternoon quite delightfully strange,\nIn the best possible, {{SUBJECT_NAME}}-shaped kind of way.",
      pose: "playing",
    },
    {
      scene:
        "A tender quiet pause — {{SUBJECT_NAME}} sitting still, maybe with a pet or toy, soft light.",
      text: "For just one moment, the whole world went quiet,\nAnd {{SUBJECT_NAME}} sat still, in the hush after the riot.",
      pose: "cozy",
    },
    {
      scene:
        "{{SUBJECT_NAME}} setting off again, energised, heading toward a bigger open space.",
      text: "Then up they popped, with a brand new plan,\nThe best adventures always outrun a nap!",
      pose: "walking",
    },
    {
      scene:
        "{{SUBJECT_NAME}} exploring a bigger outdoor scene — trees, a stream, or a hill.",
      text: "Further and further, past the garden gate,\nTo see how much wonder one day could hold, at any rate.",
      pose: "walking",
    },
    {
      scene: "A third signature quirky moment, in this bigger outdoor setting.",
      text: "And it wouldn't be a proper {{SUBJECT_NAME}} day, not one bit,\nWithout one more quirk to go with it.",
      pose: "playing",
    },
    {
      scene:
        "A triumphant beat — {{SUBJECT_NAME}} celebrating mid-action, arms up or laughing.",
      text: "It was silly, it was brave, it was entirely their own —\nA {{SUBJECT_NAME}}-sized moment, for the whole world to be shown.",
      pose: "playing",
    },
    {
      scene:
        "Golden-hour scene, {{SUBJECT_NAME}} and loved ones gathering, anticipation building.",
      text: "As the sun leaned low and the sky turned gold,\nThe very best part of the day was about to unfold.",
      pose: "greeting",
    },
    {
      scene:
        "The emotional high point — {{SUBJECT_NAME}} at the centre of a warm, specific real moment.",
      text: "Because the very best stories aren't the loud, big kind —\nThey're the small true moments that stay in your mind.",
      pose: "cozy",
    },
    {
      scene: "A joyful gathering — friends and family cheering, celebratory.",
      text: "Everyone cheered — the whole street, it seemed! —\nFor a day that turned out better than {{SUBJECT_NAME}} had dreamed.",
      pose: "greeting",
    },
    {
      scene: "{{SUBJECT_NAME}} walking home under a dusky, starry sky.",
      text: "And as the stars blinked on, one by one by one,\n{{SUBJECT_NAME}} headed home — the day's work was done.",
      pose: "walking",
    },
    {
      scene:
        "{{SUBJECT_NAME}} in bed, cosy, smiling sleepily, maybe hugging a toy.",
      text: "Pyjamas on, teeth brushed, tucked in tight,\n{{SUBJECT_NAME}} looked back on a truly wonder-full night.",
      pose: "cozy",
    },
    {
      scene:
        "Final goodnight image — {{SUBJECT_NAME}} peacefully asleep, moonlight, warm and cosy.",
      text: "Because there's only one you in the whole wide world,\nAnd every quirk and story is a flag you've unfurled.\nGoodnight, {{SUBJECT_NAME}} — sweet dreams, sleep tight,\nTomorrow's another wonder-full day in sight.",
      pose: "cozy",
    },
  ],
});

const pets = buildTemplate({
  templateId: "pets-very-important-business-v1",
  bookType: "pets",
  titleTemplate: "{{SUBJECT_NAME}}'s Very Important Business",
  dirName: "pets-v1",
  pages: [
    {
      scene:
        "{{SUBJECT_NAME}} waking up in their favourite spot, stretching, ready for a big day of very important jobs.",
      text: "Every morning, right on cue,\n{{SUBJECT_NAME}} wakes with jobs to do.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} surveying the house or garden importantly, like a tiny supervisor.",
      text: "A patrol of the house, a sniff of the air,\nMaking sure everything's properly there.",
      pose: "curious",
    },
    {
      scene:
        "{{SUBJECT_NAME}} pausing at the door or window, ears up, sensing something's about to happen.",
      text: "But today was no ordinary patrol at all —\nBecause something rather important was about to befall.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} trotting off purposefully down the hall or garden path.",
      text: "Off they trotted, official and proud,\nOn business too important to say out loud.",
      pose: "walking",
    },
    {
      scene:
        "Family members greeting {{SUBJECT_NAME}} fondly as they pass by on patrol.",
      text: "Everyone knew the patrol routine —\nThe most important pet they'd ever seen.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} pausing, head tilted, hearing or spotting something suspicious.",
      text: "Then a sound! A shape! A rustling thing!\n{{SUBJECT_NAME}}'s ears went straight up, alert to everything.",
      pose: "curious",
    },
    {
      scene: "A signature quirky pet moment in full swing.",
      text: "Because nobody does 'important business' quite like {{SUBJECT_NAME}} does —\nAnd that's exactly why this story deserves applause.",
      pose: "playing",
    },
    {
      scene: "The aftermath — mild happy chaos, tail wagging, pure joy.",
      text: "It wasn't tidy, it wasn't neat,\nBut it was {{SUBJECT_NAME}}'s finest feat.",
      pose: "playing",
    },
    {
      scene:
        "The family laughing, delighted, gathering round {{SUBJECT_NAME}}.",
      text: "'That's so them!' the family cried,\nWith so much love, and so much pride.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} facing a small mystery — an object out of place, a closed door.",
      text: "Then — a mystery! Right there in the hall!\nSomething that needed inspecting, that's all.",
      pose: "curious",
    },
    {
      scene:
        "{{SUBJECT_NAME}} investigating determinedly, pawing or sniffing at the mystery.",
      text: "With a sniff and a paw and a very serious stare,\n{{SUBJECT_NAME}} cracked the case, right then and there.",
      pose: "playing",
    },
    {
      scene: "A second, distinct signature quirky pet moment.",
      text: "Case closed — but the day wasn't nearly through,\nThere was still one more {{SUBJECT_NAME}}-thing left to do.",
      pose: "playing",
    },
    {
      scene:
        "The ripple effect — toys scattered, a happy mess, everyone amused.",
      text: "It turned the afternoon upside down,\nIn the very best way a pet's ever found.",
      pose: "playing",
    },
    {
      scene:
        "A quiet nap moment — {{SUBJECT_NAME}} curled up in a sunbeam or favourite spot.",
      text: "Even very important pets need rest,\nSo {{SUBJECT_NAME}} curled up — patrol paused, at best.",
      pose: "cozy",
    },
    {
      scene:
        "{{SUBJECT_NAME}} waking up and heading out to a bigger space, refreshed.",
      text: "But naps don't last — there's too much to see! —\nSo off {{SUBJECT_NAME}} went, business-bound and free.",
      pose: "walking",
    },
    {
      scene:
        "{{SUBJECT_NAME}} exploring a bigger outdoor scene — garden, park, or field.",
      text: "Further out, past the fence, past the tree,\nTo see how big a patrol could really be.",
      pose: "walking",
    },
    {
      scene:
        "A third signature quirky pet moment, in the bigger outdoor setting.",
      text: "And no patrol of {{SUBJECT_NAME}}'s would ever be complete,\nWithout one final, unmistakably-them feat.",
      pose: "playing",
    },
    {
      scene:
        "A triumphant, joyful moment — {{SUBJECT_NAME}} mid-zoomies or a victorious pose.",
      text: "It was silly, it was brave, it was entirely their own —\nA {{SUBJECT_NAME}}-sized moment for the whole world to be shown.",
      pose: "playing",
    },
    {
      scene:
        "Golden hour, family gathering in the garden, {{SUBJECT_NAME}} the centre of attention.",
      text: "As the sun dipped low and the sky turned gold,\nThe best part of the patrol was about to unfold.",
      pose: "greeting",
    },
    {
      scene:
        "The emotional high point — a warm, specific real moment between {{SUBJECT_NAME}} and their person.",
      text: "Because the very best pet stories aren't the loud, big kind —\nThey're the small true moments that stick in your mind.",
      pose: "cozy",
    },
    {
      scene: "Everyone cheering and laughing, celebrating {{SUBJECT_NAME}}.",
      text: "Everyone cheered — the whole house, it seemed! —\nFor a patrol that went better than anyone dreamed.",
      pose: "greeting",
    },
    {
      scene: "{{SUBJECT_NAME}} heading back inside as evening falls.",
      text: "And as the stars blinked on, one by one by one,\n{{SUBJECT_NAME}} headed in — the patrol was done.",
      pose: "walking",
    },
    {
      scene:
        "{{SUBJECT_NAME}} curling up in their bed or basket, sleepy and content.",
      text: "Bed all fluffed and paws tucked tight,\n{{SUBJECT_NAME}} settled in for the night.",
      pose: "cozy",
    },
    {
      scene:
        "Final goodnight image — {{SUBJECT_NAME}} fast asleep, moonlight through the window.",
      text: "Because there's only one {{SUBJECT_NAME}} in the whole wide world,\nAnd every quirk and story is a flag they've unfurled.\nGoodnight, {{SUBJECT_NAME}} — patrol complete,\nTomorrow brings more business, important and sweet.",
      pose: "cozy",
    },
  ],
});

const couples = buildTemplate({
  templateId: "couples-book-of-you-v1",
  bookType: "couples",
  titleTemplate: "The Book of {{SUBJECT_NAME}}, According to {{FROM_NAME}}",
  dirName: "couples-v1",
  pages: [
    {
      scene:
        "{{SUBJECT_NAME}} in a warm, everyday home moment — making coffee, reading, ordinary morning charm.",
      text: "Once upon an ordinary morning, at home, at ease,\nWas {{SUBJECT_NAME}} — doing exactly as they please.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} going about their day, a small idiosyncratic habit visible.",
      text: "Now, {{FROM_NAME}} could tell you a thousand small things,\nAbout the particular joy that {{SUBJECT_NAME}} brings.",
      pose: "curious",
    },
    {
      scene:
        "{{SUBJECT_NAME}} paused mid-moment, about to do something characteristic and charming.",
      text: "But there's one story {{FROM_NAME}} tells again and again —\nThe one that explains, more than most, exactly when...",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} heading out the door or into a scene, purposeful and warm.",
      text: "Because {{SUBJECT_NAME}} has a way of turning any old day,\nInto something worth telling, in their own particular way.",
      pose: "walking",
    },
    {
      scene: "Friends or family greeting {{SUBJECT_NAME}} warmly.",
      text: "Everyone who meets them ends up feeling the same —\nThat the world's a little brighter since {{SUBJECT_NAME}} came.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} pausing, thoughtful, noticing something small and lovely.",
      text: "{{FROM_NAME}} noticed it early — that particular knack,\nFor noticing beauty that others might overlook, or lack.",
      pose: "curious",
    },
    {
      scene: "A signature charming quirk moment in full swing.",
      text: "Because nobody does it quite like {{SUBJECT_NAME}} does —\nAnd that's exactly why this story deserves a round of applause.",
      pose: "playing",
    },
    {
      scene: "The warm ripple effect of the quirk — laughter, closeness.",
      text: "It wasn't perfect, it wasn't neat,\nBut it was {{SUBJECT_NAME}}'s most lovable feat.",
      pose: "playing",
    },
    {
      scene: "Friends gathered, laughing fondly, retelling the moment.",
      text: "'That's so them!' the whole room cried,\nWith so much love, and so much pride.",
      pose: "greeting",
    },
    {
      scene: "A small everyday hiccup — a mix-up, a mishap.",
      text: "Then — a wobble! A moment gone slightly wrong!\nThe kind that becomes a favourite story before long.",
      pose: "curious",
    },
    {
      scene:
        "{{SUBJECT_NAME}} handling the mishap with their particular grace or humour.",
      text: "But {{SUBJECT_NAME}} handled it their own particular way,\nTurning a mishap into the best part of the day.",
      pose: "playing",
    },
    {
      scene: "A second, distinct signature quirk moment.",
      text: "And just when you'd think the story had run its course,\nOne more {{SUBJECT_NAME}}-ism came, right from the source.",
      pose: "playing",
    },
    {
      scene: "The warmth spreading — a shared laugh, a tender look.",
      text: "It turned an ordinary evening quite delightfully strange,\nIn the best possible, {{SUBJECT_NAME}}-shaped kind of way.",
      pose: "playing",
    },
    {
      scene:
        "A quiet tender moment — {{SUBJECT_NAME}} and {{FROM_NAME}} sitting close, soft light.",
      text: "For just one moment, the whole world went quiet,\nAnd there they sat, together, past the riot.",
      pose: "cozy",
    },
    {
      scene: "{{SUBJECT_NAME}} setting off on a small adventure or outing.",
      text: "Then up they got, with a brand new plan,\nThe best kind of love always outruns a nap.",
      pose: "walking",
    },
    {
      scene:
        "{{SUBJECT_NAME}} out in a bigger scene — a walk, a trip, an outing.",
      text: "Further and further, hand in hand,\nTo see how much love one day could hold, unplanned.",
      pose: "walking",
    },
    {
      scene: "A third signature quirk moment, in the bigger outing setting.",
      text: "And it wouldn't be a proper {{SUBJECT_NAME}} story, not one bit,\nWithout one more quirk to go with it.",
      pose: "playing",
    },
    {
      scene:
        "A joyful triumphant beat — {{SUBJECT_NAME}} laughing, mid-moment.",
      text: "It was silly, it was warm, it was entirely their own —\nA {{SUBJECT_NAME}}-sized moment, for the whole world to be shown.",
      pose: "playing",
    },
    {
      scene:
        "Golden hour, {{SUBJECT_NAME}} and {{FROM_NAME}} together, anticipation of something meaningful.",
      text: "As the sun leaned low and the sky turned gold,\nThe very best part of their story was about to unfold.",
      pose: "greeting",
    },
    {
      scene:
        "The emotional high point — the real story's payoff, {{SUBJECT_NAME}} and {{FROM_NAME}} together.",
      text: "Because the very best love stories aren't the loud, big kind —\nThey're the small true moments that stay in your mind.",
      pose: "cozy",
    },
    {
      scene:
        "A joyful celebratory scene — friends or family, warmth all around.",
      text: "Everyone smiled — the whole room, it seemed! —\nFor a story better than anyone had dreamed.",
      pose: "greeting",
    },
    {
      scene:
        "{{SUBJECT_NAME}} and {{FROM_NAME}} heading home together under an evening sky.",
      text: "And as the stars blinked on, one by one by one,\nThey headed home together — the day's adventure done.",
      pose: "walking",
    },
    {
      scene:
        "A cosy evening in — {{SUBJECT_NAME}} settled in, content, warm light.",
      text: "Curled up together, the evening winding down,\n{{FROM_NAME}} thought: what a wonderful person I've found.",
      pose: "cozy",
    },
    {
      scene: "Final tender image — {{SUBJECT_NAME}} peaceful, warm, loved.",
      text: "Because there's only one {{SUBJECT_NAME}} in the whole wide world,\nAnd every quirk and story is a flag they've unfurled.\nHere's to you, {{SUBJECT_NAME}} — this book, this life, this view,\n{{FROM_NAME}} is endlessly grateful it's you.",
      pose: "cozy",
    },
  ],
});

for (const [name, tpl] of [
  ["kids", kids],
  ["pets", pets],
  ["couples", couples],
]) {
  writeFileSync(
    path.join(OUT_DIR, `${name}.json`),
    JSON.stringify(tpl, null, 2) + "\n",
  );
  console.log(`wrote ${name}.json (${tpl.pages.length} pages)`);
}
