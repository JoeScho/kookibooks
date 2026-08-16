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
  accent: "sun" | "mint" | "coral";
  targetLabel: string;
  subjectLabel: string; // what we call the "hero" of the book
  partnerLabel?: string; // second subject, e.g. loved one's name for couples
  traitPrompt: string; // heading shown above the details step / example cards
  // "traits" mode: 3 short quirks, woven into a story we invent.
  // "story" mode: one free-text anecdote, expanded into the story itself.
  inputMode: "traits" | "story";
  traitPlaceholder?: string; // traits mode only
  storyPlaceholder?: string; // story mode only
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
    accent: "sun",
    targetLabel: "For little ones",
    subjectLabel: "Child's name",
    traitPrompt: "What makes them, them?",
    inputMode: "traits",
    illustrationMode: "face",
    traitPlaceholder: "e.g. forgets shoes, loves dinosaurs, hates broccoli",
    examplePrompts: [
      "Refuses to sleep without their pet dinosaur, Rex",
      "Thinks broccoli is secretly plotting against them",
      "Insists on wearing wellies indoors, rain or shine",
    ],
    steps: [
      "Tell us their name and 3 quirks",
      "Upload one clear photo",
      "We write & illustrate a 10-page story",
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
    accent: "mint",
    targetLabel: "For pet parents",
    subjectLabel: "Pet's name",
    traitPrompt: "Tell us a story about them",
    inputMode: "story",
    illustrationMode: "subject",
    storyPlaceholder:
      "e.g. Barkley is our very good, very silly black Labrador who firmly believes the vacuum cleaner is his mortal enemy — the second it comes out, he barks at it from the safety of behind the sofa...",
    examplePrompts: [
      "Their long-running vendetta against the vacuum cleaner (or the postman)",
      "The one time they got away with something they really shouldn't have",
      "Their weirdly specific bedtime routine you've come to love",
    ],
    steps: [
      "Tell us their name and one real story",
      "Upload one clear photo",
      "We expand it into a story from their POV",
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
    accent: "coral",
    targetLabel: "For couples",
    subjectLabel: "Your name",
    partnerLabel: "Your loved one's name",
    traitPrompt: "Tell us a story about your loved one",
    inputMode: "story",
    illustrationMode: "face",
    storyPlaceholder:
      "e.g. The time they tried to cook a fancy dinner for our anniversary and set off the smoke alarm twice, then ordered pizza and pretended that was the plan all along...",
    examplePrompts: [
      "The time they tried to cook a fancy dinner and set off the smoke alarm twice",
      "How you actually met — the real, slightly embarrassing version",
      "Their weirdly specific morning routine you've come to love",
    ],
    steps: [
      "Tell us both your names and one real story",
      "Upload a photo of your loved one",
      "We expand it into a full illustrated storybook",
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
