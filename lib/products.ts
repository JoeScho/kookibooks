// Shared catalogue data: the three storybook "funnels" from the plan, and the
// two physical editions every book is printed in. Prices are in pence (GBP)
// so Stripe can consume them directly.

export type BookTypeId = "kids" | "pets" | "couples";

export type NarrativeStyleId = "poem" | "prose";

export interface NarrativeStyle {
  id: NarrativeStyleId;
  label: string;
  description: string;
}

export const NARRATIVE_STYLES: NarrativeStyle[] = [
  {
    id: "poem",
    label: "Rhyming poem",
    description: "Playful, rhythmic verse — read-aloud, bedtime-story energy.",
  },
  {
    id: "prose",
    label: "Storytelling",
    description:
      "Flowing prose, no forced rhyme — a warmer, more narrative voice.",
  },
];

export interface BookType {
  id: BookTypeId;
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  heroEmoji: string;
  // Used on the funnel landing page in place of heroEmoji. Ideally a real
  // generated sample (background + composited hero character, see
  // scripts/generate-fal-backgrounds.mjs and lib/composer.ts) — that's what
  // pets uses. Where that doesn't exist yet, an empty (character-free)
  // background is an acceptable stopgap (kids/couples currently do this);
  // undefined falls back to the plain heroEmoji treatment.
  heroImageSrc?: string;
  accent: "sun" | "mint" | "coral";
  targetLabel: string;
  subjectLabel: string; // what we call the "hero" of the book
  partnerLabel?: string; // second subject, e.g. loved one's name for couples
  traitPrompt: string; // heading shown above the details step / example cards
  // Every book type now collects both: a few short quirks/traits AND a
  // free-text story, always about the illustrated subject (the loved one,
  // for couples — not the buyer). A fixed 24-page story template (see
  // lib/templates/) is adapted to weave both in — see lib/story-engine.ts.
  traitPlaceholder: string;
  storyPlaceholder: string;
  // "face" uses Flux PuLID for identity-locked human faces — it hard-fails
  // (no face detected) on anything without one, so non-human subjects need
  // "subject": a general image-to-image restyle instead (see lib/ai.ts).
  illustrationMode: "face" | "subject";
  examplePrompts: string[];
  steps: string[];
}

export const BOOK_TYPES: BookType[] = [
  {
    id: "kids",
    slug: "kids",
    name: "Custom Kids' Storybook",
    tagline: "Bedtime stories starring your own kid",
    blurb:
      "A rhyming, illustrated adventure that turns your child's real name, favourite toy, and funniest habits into the hero of their own book.",
    heroEmoji: "🧸",
    // No kids-specific art generated yet — reusing an empty (character-free)
    // background from the pets template as a stopgap so the funnel page
    // isn't just a flat colour + emoji. Swap for a real kids composite once
    // that template has generated art — see PLAN_003.md.
    heroImageSrc: "/templates/pets-v1/page-01-bg.jpg",
    accent: "sun",
    targetLabel: "For little ones",
    subjectLabel: "Child's name",
    traitPrompt: "What makes them, them?",
    illustrationMode: "face",
    traitPlaceholder: "e.g. forgets shoes, loves dinosaurs, hates broccoli",
    storyPlaceholder:
      "e.g. The time they insisted their stuffed dinosaur, Rex, needed his own seatbelt in the car — and wouldn't budge until he had one...",
    examplePrompts: [
      "Refuses to sleep without their pet dinosaur, Rex",
      "Thinks broccoli is secretly plotting against them",
      "Insists on wearing wellies indoors, rain or shine",
    ],
    steps: [
      "Tell us their name, 3 quirks, and a real story",
      "Upload one clear photo",
      "We weave it into a 24-page storybook",
      "Preview, tweak the words, and print",
    ],
  },
  {
    id: "pets",
    slug: "pets",
    name: "Pet Quirks Book",
    tagline: "Told from your pet's point of view",
    blurb:
      "Ever wonder what's going through your dog's head when it barks at the vacuum? We write the story from your pet's perspective — chaos included.",
    heroEmoji: "🐾",
    heroImageSrc: "/marketing/pets-hero.jpg",
    accent: "mint",
    targetLabel: "For pet parents",
    subjectLabel: "Pet's name",
    traitPrompt: "What makes them, them?",
    illustrationMode: "subject",
    traitPlaceholder: "e.g. barks at the vacuum, steals socks, afraid of cats",
    storyPlaceholder:
      "e.g. Barkley is our very good, very silly black Labrador who firmly believes the vacuum cleaner is his mortal enemy — the second it comes out, he barks at it from the safety of behind the sofa...",
    examplePrompts: [
      "Their long-running vendetta against the vacuum cleaner (or the postman)",
      "The one time they got away with something they really shouldn't have",
      "Their weirdly specific bedtime routine you've come to love",
    ],
    steps: [
      "Tell us their name, 3 quirks, and a real story",
      "Upload one clear photo",
      "We turn it into a 24-page story from their POV",
      "Preview, tweak the words, and print",
    ],
  },
  {
    id: "couples",
    slug: "couples",
    name: "Beige Flags Book",
    tagline: "Every quirk has a story",
    blurb:
      "Tell us one real story about your loved one — an inside joke, a first-date disaster, the way they order coffee — and we'll expand it into a full illustrated storybook with that story as the heart of it.",
    heroEmoji: "💛",
    // Same stopgap as kids — see the note there.
    heroImageSrc: "/templates/pets-v1/page-21-bg.jpg",
    accent: "coral",
    targetLabel: "For couples",
    subjectLabel: "Your name",
    partnerLabel: "Your loved one's name",
    traitPrompt: "What makes them, them?",
    illustrationMode: "face",
    traitPlaceholder:
      "e.g. narrates their own cooking show, terrible at parking, world's loudest sneeze",
    storyPlaceholder:
      "e.g. The time they tried to cook a fancy dinner for our anniversary and set off the smoke alarm twice, then ordered pizza and pretended that was the plan all along...",
    examplePrompts: [
      "The time they tried to cook a fancy dinner and set off the smoke alarm twice",
      "How you actually met — the real, slightly embarrassing version",
      "Their weirdly specific morning routine you've come to love",
    ],
    steps: [
      "Tell us both your names, 3 quirks, and a real story",
      "Upload a photo of your loved one",
      "We turn it into a full 24-page illustrated storybook",
      "Preview, tweak the words, and print",
    ],
  },
];

export function getBookType(slug: string): BookType | undefined {
  return BOOK_TYPES.find((b) => b.slug === slug);
}

export type EditionId = "softcover" | "hardcover";

export interface Edition {
  id: EditionId;
  name: string;
  description: string;
  priceP: number; // price in pence
}

export const EDITIONS: Edition[] = [
  {
    id: "softcover",
    name: "Softcover",
    description: '8×8" square, matte laminated cover, 24 pages',
    priceP: 2499,
  },
  {
    id: "hardcover",
    name: "Hardcover",
    description: '8×8" square, durable case-bound cover, 24 pages',
    priceP: 3499,
  },
];

export const SHIPPING_P = 350; // £3.50 flat rate, UK

export function getEdition(id: string): Edition | undefined {
  return EDITIONS.find((e) => e.id === id);
}
