# Kookibooks — Background Art Brief

Generated from `lib/templates/*.json` — do not hand-edit this file, edit the
templates and re-run `node scripts/generate-art-brief.mjs` instead.

Every book type shares the same 24-page structure: one fixed background per
page, with a single hero character (rendered separately per buyer from their
uploaded photo, see `lib/ai.ts` `generateHeroPoses`) composited on top at
the given slot. Art style: simple, soft, gently-shaded storybook
illustration in the spirit of classic *Winnie-the-Pooh* — warm muted
colours, calm and timeless, not flat vector, not busy or hyper-rendered.

## Kids — Custom Kids' Storybook

Template ID: `kids-wonder-full-day-v1`
Title: {{SUBJECT_NAME}}'s Big Wonder-Full Day

Each page below needs one background illustration, 1600×1600px, saved to the given path. **Leave the composite slot area visually open** (no character already drawn there) — the hero character is layered on top of this background separately at render time, at the position/size given.

### Page 1

- **File path:** `public/templates/kids-v1/page-01-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} waking up in a cosy bedroom, sunlight streaming in, stretching and grinning at the day ahead.
- **Page text (for context/tone — not to be illustrated literally):**
  > In a cosy little room where the morning light creeps in,
  > Lived {{SUBJECT_NAME}} — and the day was about to begin!

### Page 2

- **File path:** `public/templates/kids-v1/page-02-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} at the breakfast table, humming, looking thoughtfully out the window, planning the day.
- **Page text (for context/tone — not to be illustrated literally):**
  > Some days start slow, with a yawn and a stretch,
  > But {{SUBJECT_NAME}}'s days always come with a fetch —
  > Something to wonder, something to find,
  > A whole day of adventure, still left to unwind.

### Page 3 — Dynamic — adapted from the opening of their real story

- **File path:** `public/templates/kids-v1/page-03-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} pausing at the front door, hand on the handle, a hint of something exciting about to unfold.
- **Page text (for context/tone — not to be illustrated literally):**
  > And today was no ordinary day at all,
  > Because something was about to happen — big or small.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 4

- **File path:** `public/templates/kids-v1/page-04-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} striding down a garden path or street, backpack or toy in hand.
- **Page text (for context/tone — not to be illustrated literally):**
  > Out the door and down the path, {{SUBJECT_NAME}} would go,
  > Wherever the wondering took them — fast or slow.

### Page 5

- **File path:** `public/templates/kids-v1/page-05-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** Neighbours or friends waving hello as {{SUBJECT_NAME}} passes by.
- **Page text (for context/tone — not to be illustrated literally):**
  > The whole street seemed to know their name,
  > Every wave and 'good morning!' was never quite the same.

### Page 6

- **File path:** `public/templates/kids-v1/page-06-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} pausing curiously, peering around a corner or up at the sky.
- **Page text (for context/tone — not to be illustrated literally):**
  > But {{SUBJECT_NAME}} had a feeling, right down in their toes,
  > That today held a secret nobody else knows.

### Page 7 — Dynamic — adapted for Trait 1

- **File path:** `public/templates/kids-v1/page-07-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A signature quirky moment for {{SUBJECT_NAME}} in full swing — playful, a little silly, entirely them.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because {{SUBJECT_NAME}} was never quite like anyone else —
  > And that's exactly why this story's worth itself.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 8

- **File path:** `public/templates/kids-v1/page-08-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** The joyful aftermath — toys scattered, laughter, a happy little mess.
- **Page text (for context/tone — not to be illustrated literally):**
  > Wherever that led — however peculiar it seemed —
  > It turned an ordinary morning into something dreamed.

### Page 9

- **File path:** `public/templates/kids-v1/page-09-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** Friends or family gathering round, delighted, laughing with {{SUBJECT_NAME}}.
- **Page text (for context/tone — not to be illustrated literally):**
  > Friends came running when they heard the commotion,
  > 'That's so {{SUBJECT_NAME}}!' — with total devotion.

### Page 10

- **File path:** `public/templates/kids-v1/page-10-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} looking at a small puzzle — a stuck door, a tangled kite string.
- **Page text (for context/tone — not to be illustrated literally):**
  > Then — uh oh — a puzzle popped up out of nowhere,
  > Something tricky, something that needed some care.

### Page 11

- **File path:** `public/templates/kids-v1/page-11-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} actively solving the puzzle, hands-on, determined and cheerful.
- **Page text (for context/tone — not to be illustrated literally):**
  > But {{SUBJECT_NAME}} never once thought to give up,
  > They rolled up their sleeves and figured it up.

### Page 12 — Dynamic — adapted for Trait 2

- **File path:** `public/templates/kids-v1/page-12-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A second, distinct signature quirky moment for {{SUBJECT_NAME}}.
- **Page text (for context/tone — not to be illustrated literally):**
  > And just when you'd think the day had run out of surprise,
  > Another little {{SUBJECT_NAME}}-ism opened everyone's eyes.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 13

- **File path:** `public/templates/kids-v1/page-13-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** The ripple effect of the quirk spreading warmth and fun through the setting.
- **Page text (for context/tone — not to be illustrated literally):**
  > It turned the afternoon quite delightfully strange,
  > In the best possible, {{SUBJECT_NAME}}-shaped kind of way.

### Page 14

- **File path:** `public/templates/kids-v1/page-14-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** A tender quiet pause — {{SUBJECT_NAME}} sitting still, maybe with a pet or toy, soft light.
- **Page text (for context/tone — not to be illustrated literally):**
  > For just one moment, the whole world went quiet,
  > And {{SUBJECT_NAME}} sat still, in the hush after the riot.

### Page 15

- **File path:** `public/templates/kids-v1/page-15-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} setting off again, energised, heading toward a bigger open space.
- **Page text (for context/tone — not to be illustrated literally):**
  > Then up they popped, with a brand new plan,
  > The best adventures always outrun a nap!

### Page 16

- **File path:** `public/templates/kids-v1/page-16-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} exploring a bigger outdoor scene — trees, a stream, or a hill.
- **Page text (for context/tone — not to be illustrated literally):**
  > Further and further, past the garden gate,
  > To see how much wonder one day could hold, at any rate.

### Page 17 — Dynamic — adapted for Trait 3

- **File path:** `public/templates/kids-v1/page-17-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A third signature quirky moment, in this bigger outdoor setting.
- **Page text (for context/tone — not to be illustrated literally):**
  > And it wouldn't be a proper {{SUBJECT_NAME}} day, not one bit,
  > Without one more quirk to go with it.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 18

- **File path:** `public/templates/kids-v1/page-18-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** A triumphant beat — {{SUBJECT_NAME}} celebrating mid-action, arms up or laughing.
- **Page text (for context/tone — not to be illustrated literally):**
  > It was silly, it was brave, it was entirely their own —
  > A {{SUBJECT_NAME}}-sized moment, for the whole world to be shown.

### Page 19

- **File path:** `public/templates/kids-v1/page-19-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** Golden-hour scene, {{SUBJECT_NAME}} and loved ones gathering, anticipation building.
- **Page text (for context/tone — not to be illustrated literally):**
  > As the sun leaned low and the sky turned gold,
  > The very best part of the day was about to unfold.

### Page 20 — Dynamic — adapted from the emotional high point of their real story

- **File path:** `public/templates/kids-v1/page-20-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** The emotional high point — {{SUBJECT_NAME}} at the centre of a warm, specific real moment.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because the very best stories aren't the loud, big kind —
  > They're the small true moments that stay in your mind.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 21

- **File path:** `public/templates/kids-v1/page-21-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** A joyful gathering — friends and family cheering, celebratory.
- **Page text (for context/tone — not to be illustrated literally):**
  > Everyone cheered — the whole street, it seemed! —
  > For a day that turned out better than {{SUBJECT_NAME}} had dreamed.

### Page 22

- **File path:** `public/templates/kids-v1/page-22-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} walking home under a dusky, starry sky.
- **Page text (for context/tone — not to be illustrated literally):**
  > And as the stars blinked on, one by one by one,
  > {{SUBJECT_NAME}} headed home — the day's work was done.

### Page 23

- **File path:** `public/templates/kids-v1/page-23-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} in bed, cosy, smiling sleepily, maybe hugging a toy.
- **Page text (for context/tone — not to be illustrated literally):**
  > Pyjamas on, teeth brushed, tucked in tight,
  > {{SUBJECT_NAME}} looked back on a truly wonder-full night.

### Page 24

- **File path:** `public/templates/kids-v1/page-24-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** Final goodnight image — {{SUBJECT_NAME}} peacefully asleep, moonlight, warm and cosy.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because there's only one you in the whole wide world,
  > And every quirk and story is a flag you've unfurled.
  > Goodnight, {{SUBJECT_NAME}} — sweet dreams, sleep tight,
  > Tomorrow's another wonder-full day in sight.

---

## Pets — Pet Quirks Book

Template ID: `pets-very-important-business-v1`
Title: {{SUBJECT_NAME}}'s Very Important Business

Each page below needs one background illustration, 1600×1600px, saved to the given path. **Leave the composite slot area visually open** (no character already drawn there) — the hero character is layered on top of this background separately at render time, at the position/size given.

### Page 1

- **File path:** `public/templates/pets-v1/page-01-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} waking up in their favourite spot, stretching, ready for a big day of very important jobs.
- **Page text (for context/tone — not to be illustrated literally):**
  > Every morning, right on cue,
  > {{SUBJECT_NAME}} wakes with jobs to do.

### Page 2

- **File path:** `public/templates/pets-v1/page-02-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} surveying the house or garden importantly, like a tiny supervisor.
- **Page text (for context/tone — not to be illustrated literally):**
  > A patrol of the house, a sniff of the air,
  > Making sure everything's properly there.

### Page 3 — Dynamic — adapted from the opening of their real story

- **File path:** `public/templates/pets-v1/page-03-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} pausing at the door or window, ears up, sensing something's about to happen.
- **Page text (for context/tone — not to be illustrated literally):**
  > But today was no ordinary patrol at all —
  > Because something rather important was about to befall.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 4

- **File path:** `public/templates/pets-v1/page-04-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} trotting off purposefully down the hall or garden path.
- **Page text (for context/tone — not to be illustrated literally):**
  > Off they trotted, official and proud,
  > On business too important to say out loud.

### Page 5

- **File path:** `public/templates/pets-v1/page-05-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** Family members greeting {{SUBJECT_NAME}} fondly as they pass by on patrol.
- **Page text (for context/tone — not to be illustrated literally):**
  > Everyone knew the patrol routine —
  > The most important pet they'd ever seen.

### Page 6

- **File path:** `public/templates/pets-v1/page-06-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} pausing, head tilted, hearing or spotting something suspicious.
- **Page text (for context/tone — not to be illustrated literally):**
  > Then a sound! A shape! A rustling thing!
  > {{SUBJECT_NAME}}'s ears went straight up, alert to everything.

### Page 7 — Dynamic — adapted for Trait 1

- **File path:** `public/templates/pets-v1/page-07-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A signature quirky pet moment in full swing.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because nobody does 'important business' quite like {{SUBJECT_NAME}} does —
  > And that's exactly why this story deserves applause.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 8

- **File path:** `public/templates/pets-v1/page-08-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** The aftermath — mild happy chaos, tail wagging, pure joy.
- **Page text (for context/tone — not to be illustrated literally):**
  > It wasn't tidy, it wasn't neat,
  > But it was {{SUBJECT_NAME}}'s finest feat.

### Page 9

- **File path:** `public/templates/pets-v1/page-09-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** The family laughing, delighted, gathering round {{SUBJECT_NAME}}.
- **Page text (for context/tone — not to be illustrated literally):**
  > 'That's so them!' the family cried,
  > With so much love, and so much pride.

### Page 10

- **File path:** `public/templates/pets-v1/page-10-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} facing a small mystery — an object out of place, a closed door.
- **Page text (for context/tone — not to be illustrated literally):**
  > Then — a mystery! Right there in the hall!
  > Something that needed inspecting, that's all.

### Page 11

- **File path:** `public/templates/pets-v1/page-11-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} investigating determinedly, pawing or sniffing at the mystery.
- **Page text (for context/tone — not to be illustrated literally):**
  > With a sniff and a paw and a very serious stare,
  > {{SUBJECT_NAME}} cracked the case, right then and there.

### Page 12 — Dynamic — adapted for Trait 2

- **File path:** `public/templates/pets-v1/page-12-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A second, distinct signature quirky pet moment.
- **Page text (for context/tone — not to be illustrated literally):**
  > Case closed — but the day wasn't nearly through,
  > There was still one more {{SUBJECT_NAME}}-thing left to do.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 13

- **File path:** `public/templates/pets-v1/page-13-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** The ripple effect — toys scattered, a happy mess, everyone amused.
- **Page text (for context/tone — not to be illustrated literally):**
  > It turned the afternoon upside down,
  > In the very best way a pet's ever found.

### Page 14

- **File path:** `public/templates/pets-v1/page-14-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** A quiet nap moment — {{SUBJECT_NAME}} curled up in a sunbeam or favourite spot.
- **Page text (for context/tone — not to be illustrated literally):**
  > Even very important pets need rest,
  > So {{SUBJECT_NAME}} curled up — patrol paused, at best.

### Page 15

- **File path:** `public/templates/pets-v1/page-15-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} waking up and heading out to a bigger space, refreshed.
- **Page text (for context/tone — not to be illustrated literally):**
  > But naps don't last — there's too much to see! —
  > So off {{SUBJECT_NAME}} went, business-bound and free.

### Page 16

- **File path:** `public/templates/pets-v1/page-16-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} exploring a bigger outdoor scene — garden, park, or field.
- **Page text (for context/tone — not to be illustrated literally):**
  > Further out, past the fence, past the tree,
  > To see how big a patrol could really be.

### Page 17 — Dynamic — adapted for Trait 3

- **File path:** `public/templates/pets-v1/page-17-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A third signature quirky pet moment, in the bigger outdoor setting.
- **Page text (for context/tone — not to be illustrated literally):**
  > And no patrol of {{SUBJECT_NAME}}'s would ever be complete,
  > Without one final, unmistakably-them feat.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 18

- **File path:** `public/templates/pets-v1/page-18-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** A triumphant, joyful moment — {{SUBJECT_NAME}} mid-zoomies or a victorious pose.
- **Page text (for context/tone — not to be illustrated literally):**
  > It was silly, it was brave, it was entirely their own —
  > A {{SUBJECT_NAME}}-sized moment for the whole world to be shown.

### Page 19

- **File path:** `public/templates/pets-v1/page-19-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** Golden hour, family gathering in the garden, {{SUBJECT_NAME}} the centre of attention.
- **Page text (for context/tone — not to be illustrated literally):**
  > As the sun dipped low and the sky turned gold,
  > The best part of the patrol was about to unfold.

### Page 20 — Dynamic — adapted from the emotional high point of their real story

- **File path:** `public/templates/pets-v1/page-20-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** The emotional high point — a warm, specific real moment between {{SUBJECT_NAME}} and their person.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because the very best pet stories aren't the loud, big kind —
  > They're the small true moments that stick in your mind.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 21

- **File path:** `public/templates/pets-v1/page-21-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** Everyone cheering and laughing, celebrating {{SUBJECT_NAME}}.
- **Page text (for context/tone — not to be illustrated literally):**
  > Everyone cheered — the whole house, it seemed! —
  > For a patrol that went better than anyone dreamed.

### Page 22

- **File path:** `public/templates/pets-v1/page-22-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} heading back inside as evening falls.
- **Page text (for context/tone — not to be illustrated literally):**
  > And as the stars blinked on, one by one by one,
  > {{SUBJECT_NAME}} headed in — the patrol was done.

### Page 23

- **File path:** `public/templates/pets-v1/page-23-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} curling up in their bed or basket, sleepy and content.
- **Page text (for context/tone — not to be illustrated literally):**
  > Bed all fluffed and paws tucked tight,
  > {{SUBJECT_NAME}} settled in for the night.

### Page 24

- **File path:** `public/templates/pets-v1/page-24-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** Final goodnight image — {{SUBJECT_NAME}} fast asleep, moonlight through the window.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because there's only one {{SUBJECT_NAME}} in the whole wide world,
  > And every quirk and story is a flag they've unfurled.
  > Goodnight, {{SUBJECT_NAME}} — patrol complete,
  > Tomorrow brings more business, important and sweet.

---

## Couples — Beige Flags Book

Template ID: `couples-book-of-you-v1`
Title: The Book of {{SUBJECT_NAME}}, According to {{FROM_NAME}}

Each page below needs one background illustration, 1600×1600px, saved to the given path. **Leave the composite slot area visually open** (no character already drawn there) — the hero character is layered on top of this background separately at render time, at the position/size given.

### Page 1

- **File path:** `public/templates/couples-v1/page-01-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} in a warm, everyday home moment — making coffee, reading, ordinary morning charm.
- **Page text (for context/tone — not to be illustrated literally):**
  > Once upon an ordinary morning, at home, at ease,
  > Was {{SUBJECT_NAME}} — doing exactly as they please.

### Page 2

- **File path:** `public/templates/couples-v1/page-02-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} going about their day, a small idiosyncratic habit visible.
- **Page text (for context/tone — not to be illustrated literally):**
  > Now, {{FROM_NAME}} could tell you a thousand small things,
  > About the particular joy that {{SUBJECT_NAME}} brings.

### Page 3 — Dynamic — adapted from the opening of their real story

- **File path:** `public/templates/couples-v1/page-03-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} paused mid-moment, about to do something characteristic and charming.
- **Page text (for context/tone — not to be illustrated literally):**
  > But there's one story {{FROM_NAME}} tells again and again —
  > The one that explains, more than most, exactly when...
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 4

- **File path:** `public/templates/couples-v1/page-04-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} heading out the door or into a scene, purposeful and warm.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because {{SUBJECT_NAME}} has a way of turning any old day,
  > Into something worth telling, in their own particular way.

### Page 5

- **File path:** `public/templates/couples-v1/page-05-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** Friends or family greeting {{SUBJECT_NAME}} warmly.
- **Page text (for context/tone — not to be illustrated literally):**
  > Everyone who meets them ends up feeling the same —
  > That the world's a little brighter since {{SUBJECT_NAME}} came.

### Page 6

- **File path:** `public/templates/couples-v1/page-06-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} pausing, thoughtful, noticing something small and lovely.
- **Page text (for context/tone — not to be illustrated literally):**
  > {{FROM_NAME}} noticed it early — that particular knack,
  > For noticing beauty that others might overlook, or lack.

### Page 7 — Dynamic — adapted for Trait 1

- **File path:** `public/templates/couples-v1/page-07-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A signature charming quirk moment in full swing.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because nobody does it quite like {{SUBJECT_NAME}} does —
  > And that's exactly why this story deserves a round of applause.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 8

- **File path:** `public/templates/couples-v1/page-08-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** The warm ripple effect of the quirk — laughter, closeness.
- **Page text (for context/tone — not to be illustrated literally):**
  > It wasn't perfect, it wasn't neat,
  > But it was {{SUBJECT_NAME}}'s most lovable feat.

### Page 9

- **File path:** `public/templates/couples-v1/page-09-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** Friends gathered, laughing fondly, retelling the moment.
- **Page text (for context/tone — not to be illustrated literally):**
  > 'That's so them!' the whole room cried,
  > With so much love, and so much pride.

### Page 10

- **File path:** `public/templates/couples-v1/page-10-bg.jpg`
- **Hero pose on this page:** curious
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** A small everyday hiccup — a mix-up, a mishap.
- **Page text (for context/tone — not to be illustrated literally):**
  > Then — a wobble! A moment gone slightly wrong!
  > The kind that becomes a favourite story before long.

### Page 11

- **File path:** `public/templates/couples-v1/page-11-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} handling the mishap with their particular grace or humour.
- **Page text (for context/tone — not to be illustrated literally):**
  > But {{SUBJECT_NAME}} handled it their own particular way,
  > Turning a mishap into the best part of the day.

### Page 12 — Dynamic — adapted for Trait 2

- **File path:** `public/templates/couples-v1/page-12-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A second, distinct signature quirk moment.
- **Page text (for context/tone — not to be illustrated literally):**
  > And just when you'd think the story had run its course,
  > One more {{SUBJECT_NAME}}-ism came, right from the source.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 13

- **File path:** `public/templates/couples-v1/page-13-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** The warmth spreading — a shared laugh, a tender look.
- **Page text (for context/tone — not to be illustrated literally):**
  > It turned an ordinary evening quite delightfully strange,
  > In the best possible, {{SUBJECT_NAME}}-shaped kind of way.

### Page 14

- **File path:** `public/templates/couples-v1/page-14-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** A quiet tender moment — {{SUBJECT_NAME}} and {{FROM_NAME}} sitting close, soft light.
- **Page text (for context/tone — not to be illustrated literally):**
  > For just one moment, the whole world went quiet,
  > And there they sat, together, past the riot.

### Page 15

- **File path:** `public/templates/couples-v1/page-15-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} setting off on a small adventure or outing.
- **Page text (for context/tone — not to be illustrated literally):**
  > Then up they got, with a brand new plan,
  > The best kind of love always outruns a nap.

### Page 16

- **File path:** `public/templates/couples-v1/page-16-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} out in a bigger scene — a walk, a trip, an outing.
- **Page text (for context/tone — not to be illustrated literally):**
  > Further and further, hand in hand,
  > To see how much love one day could hold, unplanned.

### Page 17 — Dynamic — adapted for Trait 3

- **File path:** `public/templates/couples-v1/page-17-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** A third signature quirk moment, in the bigger outing setting.
- **Page text (for context/tone — not to be illustrated literally):**
  > And it wouldn't be a proper {{SUBJECT_NAME}} story, not one bit,
  > Without one more quirk to go with it.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 18

- **File path:** `public/templates/couples-v1/page-18-bg.jpg`
- **Hero pose on this page:** playing
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** A joyful triumphant beat — {{SUBJECT_NAME}} laughing, mid-moment.
- **Page text (for context/tone — not to be illustrated literally):**
  > It was silly, it was warm, it was entirely their own —
  > A {{SUBJECT_NAME}}-sized moment, for the whole world to be shown.

### Page 19

- **File path:** `public/templates/couples-v1/page-19-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=140, y=920, width=360, height=520 (of a 1600×1600 canvas)
- **Scene to depict:** Golden hour, {{SUBJECT_NAME}} and {{FROM_NAME}} together, anticipation of something meaningful.
- **Page text (for context/tone — not to be illustrated literally):**
  > As the sun leaned low and the sky turned gold,
  > The very best part of their story was about to unfold.

### Page 20 — Dynamic — adapted from the emotional high point of their real story

- **File path:** `public/templates/couples-v1/page-20-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=570, y=780, width=460, height=660 (of a 1600×1600 canvas)
- **Scene to depict:** The emotional high point — the real story's payoff, {{SUBJECT_NAME}} and {{FROM_NAME}} together.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because the very best love stories aren't the loud, big kind —
  > They're the small true moments that stay in your mind.
  _(This page's text is personalised per buyer — the scene above is what stays fixed and must match the artwork.)_

### Page 21

- **File path:** `public/templates/couples-v1/page-21-bg.jpg`
- **Hero pose on this page:** greeting
- **Composite slot (leave this area open):** x=1100, y=920, width=360, height=520, mirrored horizontally (of a 1600×1600 canvas)
- **Scene to depict:** A joyful celebratory scene — friends or family, warmth all around.
- **Page text (for context/tone — not to be illustrated literally):**
  > Everyone smiled — the whole room, it seemed! —
  > For a story better than anyone had dreamed.

### Page 22

- **File path:** `public/templates/couples-v1/page-22-bg.jpg`
- **Hero pose on this page:** walking
- **Composite slot (leave this area open):** x=670, y=1060, width=260, height=380 (of a 1600×1600 canvas)
- **Scene to depict:** {{SUBJECT_NAME}} and {{FROM_NAME}} heading home together under an evening sky.
- **Page text (for context/tone — not to be illustrated literally):**
  > And as the stars blinked on, one by one by one,
  > They headed home together — the day's adventure done.

### Page 23

- **File path:** `public/templates/couples-v1/page-23-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** A cosy evening in — {{SUBJECT_NAME}} settled in, content, warm light.
- **Page text (for context/tone — not to be illustrated literally):**
  > Curled up together, the evening winding down,
  > {{FROM_NAME}} thought: what a wonderful person I've found.

### Page 24

- **File path:** `public/templates/couples-v1/page-24-bg.jpg`
- **Hero pose on this page:** cozy
- **Composite slot (leave this area open):** x=540, y=700, width=520, height=740 (of a 1600×1600 canvas)
- **Scene to depict:** Final tender image — {{SUBJECT_NAME}} peaceful, warm, loved.
- **Page text (for context/tone — not to be illustrated literally):**
  > Because there's only one {{SUBJECT_NAME}} in the whole wide world,
  > And every quirk and story is a flag they've unfurled.
  > Here's to you, {{SUBJECT_NAME}} — this book, this life, this view,
  > {{FROM_NAME}} is endlessly grateful it's you.

