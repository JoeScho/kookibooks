# 📖 KOOKIBOOKS — Modular Story & Composite Preview Specification

## 1. Overview & Architectural Shift

### The Problem
Generating 10+ full AI images per visitor during the preview stage creates two critical issues:
1. **High Cost Leak:** Unconverted traffic burns image API credits (~£0.30–£0.50 per visitor) before a sale is made.
2. **Quality & Consistency Issues:** Pure AI generation struggles with multi-page facial consistency, lighting, and layout stability.

### The Solution: Modular Story & Composite Personalization
Shift from full-page AI generation to a **hybrid template model**:
* **Fixed Narrative Arc & Artwork:** Base story arcs and scene artwork are pre-crafted.
* **Dynamic Text Injection:** LLMs (Gemini/Claude) dynamically adapt rhyming verses on specific pages to weave in user-provided traits/quirks.
* **Partial Preview:** The web app displays only the first **3 pages** as a free preview.
* **Deferred Post-Purchase Generation:** Full-book image rendering and final PDF compilation occur **only after Stripe payment confirmation**.

---

## 2. Updated User Journey & Preview Mechanics

```
[ User Inputs Name, Traits & Uploads Photo ]
                     │
                     ▼
[ Instant Modular Text Adaptor (Gemini ~£0.001) ]
                     │
                     ▼
[ Render Pages 1–3 Preview (Composite / Watermarked) ]
                     │
                     ▼
[ Gated Page 4+: "Unlock Full 10-Page Book for £24.99" ]
                     │
                     ▼
[ Stripe Payment Capture ] ──► [ Background Job: Render Full Book & Send to Gelato ]
```

### Preview Rules
1. **Limited Preview:** Render pages 1, 2, and 3 only on the web interface.
2. **Locked Pages (4–10):** Display blurred card overlays with lock icons and a call-to-action banner: *"Unlock [Name]'s full 10-page adventure for £24.99"*.
3. **Instant Loading:** Because base scenes are pre-rendered assets, preview rendering drops from 45 seconds to **under 2 seconds**.

---

## 3. Image Strategy & Artist Pipeline

The system is designed to support three distinct visual pipelines:

### Pipeline A: Layered Composite (Default MVP)
* **Base Art:** Designed by an independent artist or pre-crafted vector templates.
* **Compositing:** Node.js (`sharp` / HTML Canvas) overlays dynamic elements (hair color, skin tone, avatar frame, or face mask cutout) onto fixed base background scenes.
* **Cost:** **£0.00** per preview.

### Pipeline B: Single Hero Image + Template Pages
* **Hero Page (Cover / Page 1):** Uses an AI styling API (`fal.ai` / ControlNet) to stylize the user's face onto the main character once.
* **Pages 2–10:** Use fixed artist-crafted background scenes with composite character overlays.
* **Cost:** Cuts image API calls from 10 to **1 per order**.

### Pipeline C: Post-Purchase Full Inpainting
* **Preview:** Renders composited mockups for pages 1–3.
* **Post-Purchase:** Runs AI inpainting on fixed background templates only after payment is captured via Stripe Webhook.

---

## 4. Base Story Template Structure

Instead of generating stories from scratch, use structured templates with token placeholders (`{{CHILD_NAME}}`, `{{TRAIT_1}}`, `{{TRAIT_2}}`, `{{TRAIT_3}}`).

### Example Story Template: *"The Great Quirk Mystery"*

```json
{
  "templateId": "quirk-mystery-v1",
  "title": "The Great Quirk Mystery of {{CHILD_NAME}}",
  "pages": [
    {
      "pageNumber": 1,
      "baseImageAsset": "/templates/quirk-mystery/page-1-bg.png",
      "textTemplate": "In a cozy small house on a bright sunny street,\nLived {{CHILD_NAME}}, the most curious person you'd meet!",
      "isDynamicTraitPage": false
    },
    {
      "pageNumber": 2,
      "baseImageAsset": "/templates/quirk-mystery/page-2-bg.png",
      "textTemplate": "Every morning began with a funny routine,\nThe most peculiar sights that you ever have seen.",
      "isDynamicTraitPage": false
    },
    {
      "pageNumber": 3,
      "baseImageAsset": "/templates/quirk-mystery/page-3-bg.png",
      "textTemplate": "For instance, whenever {{TRAIT_1}} happened nearby,\n{{CHILD_NAME}} would just smile with a wink of an eye!",
      "isDynamicTraitPage": true,
      "traitKey": "TRAIT_1"
    },
    {
      "pageNumber": 4,
      "baseImageAsset": "/templates/quirk-mystery/page-4-bg.png",
      "textTemplate": "And don't get us started on how things would go,\nWhen {{TRAIT_2}} turned the day into quite a big show!",
      "isDynamicTraitPage": true,
      "traitKey": "TRAIT_2"
    }
  ]
}
```

---

## 5. Required Code Updates for Implementation

### A. Modular Story Adaptor (`lib/story-engine.ts`)
Creates a light LLM wrapper that injects user traits into the template's rhyming scheme without rewriting the whole story.

```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function adaptStoryTemplate(
  childName: string,
  traits: string[],
  baseTemplate: any
) {
  const prompt = `
    You are an editor for Kookibooks.
    Take this base story template for a book titled "${baseTemplate.title}":
    ${JSON.stringify(baseTemplate.pages)}

    Adapt the text for pages where "isDynamicTraitPage" is true.
    Format the user's quirks naturally into rhyming AABB or ABCB verse:
    - Child Name: ${childName}
    - Quirks/Traits: ${traits.join(', ')}

    Return strictly a JSON object with an updated "pages" array containing all 10 pages.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: prompt,
    config: { responseMimeType: 'application/json' },
  });

  return JSON.parse(response.text);
}
```

### B. Image Compositor Utility (`lib/composer.ts`)
Uses `sharp` to combine background scene templates with dynamic character layers.

```typescript
import sharp from 'sharp';

export async function createPageComposite(
  bgPath: string,
  avatarPath: string,
  outputPath: string
) {
  // Resize avatar and overlay onto pre-designated coordinates in the base template
  const avatarBuffer = await sharp(avatarPath)
    .resize(300, 300, { fit: 'cover' })
    .toBuffer();

  await sharp(bgPath)
    .composite([
      {
        input: avatarBuffer,
        top: 200,  // Adjust based on artist template coordinates
        left: 150,
      },
    ])
    .toFile(outputPath);
}
```

### C. Updated Preview Component (`app/page.tsx`)
Updates the frontend preview to display pages 1–3 while locking pages 4–10 behind a paywall card.

```tsx
// Partial page rendering logic inside app/page.tsx
{pages.map((page, index) => {
  const isLocked = index >= 3; // Lock page 4 onwards (index 3+)

  return (
    <div key={page.pageNumber} className="relative border rounded-xl overflow-hidden bg-white shadow-sm">
      {isLocked ? (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center text-white">
          <LockIcon className="w-10 h-10 mb-2 text-coral-400"/>
          <h3 className="font-bold text-lg">Page {page.pageNumber} Locked</h3>
          <p className="text-sm text-slate-200 mb-4">Unlock all 10 pages with your custom printed book.</p>
          <button
            onClick={handleCheckout}
            className="bg-coral-500 hover:bg-coral-600 text-white font-bold px-6 py-2 rounded-lg text-sm transition"
          >
            Unlock Full Book (£24.99)
          </button>
        </div>
      ) : null}

      <img
        src={page.imageUrl}
        alt={`Page ${page.pageNumber}`}
        className={`w-full aspect-square object-cover ${isLocked ? 'filter blur-sm' : ''}`}
      />
      <div className="p-4">
        <p className="font-semibold text-xs text-gray-400 mb-1">Page {page.pageNumber}</p>
        <p className="text-gray-800 italic">"{page.storyText}"</p>
      </div>
    </div>
  );
})}
```

---

## 6. Action Items for Claude Code

When implementing this update, execute the following steps in order:

1. **Install Compositing Dependency:** Run `npm install sharp` in the root directory.
2. **Create Template Registry:** Create `lib/templates/quirk-mystery.json` containing base story arcs and page background asset references.
3. **Update Story API Route (`app/api/generate-book/route.ts`):**
   * Replace full-generation logic with `adaptStoryTemplate()`.
   * Return only pages 1–3 image paths for initial preview rendering.
4. **Update Frontend (`app/page.tsx`):**
   * Implement the 3-page preview limit with blurred lock overlays for pages 4–10.
5. **Update Stripe Webhook (`app/api/webhooks/stripe/route.ts`):**
   * Ensure full 10-page PDF generation and Gelato fulfillment dispatch occur in the background **after** `checkout.session.completed` fires.