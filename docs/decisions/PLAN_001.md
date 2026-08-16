# 📖 KOOKIBOOKS — Project System Architecture & Business Plan

## 1. Executive Summary & Brand Overview
* **Brand Name:** Kookibooks (Primary Domain: `kookibooks.com` or `kookibooks.co.uk`)
* **Tagline:** *"Every quirk has a story."*
* **Core Product:** An AI-powered, print-on-demand micro-SaaS platform that converts user-uploaded photos and specific personal quirks/traits into custom-written, illustrated storybooks.
* **Business & Financial Model:** 100% variable-cost unit economics. Zero upfront inventory, zero warehousing, and low fixed monthly overheads (~£0–£10/month on serverless tiers). The customer pays upfront, triggering automated AI generation and print-on-demand dropshipping via API.

---

## 2. Market Strategy & Multi-Funnel Architecture
To maximize conversion without rebuilding technical infrastructure, **Kookibooks** uses a **"Single Tech Engine, Multi-Landing Page"** funnel approach. One Next.js backend powers distinct marketing pages:

1. **Route A (`/couples` or `/beige-flags`):** **The "Beige Flags" & Relationship Book**
   * *Angle:* Viral TikTok humor. Partners upload photos and 3 “beige flags” (weird quirks/inside jokes).
   * *Target:* Anniversaries, Valentine’s Day, partner birthdays.
2. **Route B (`/pets`):** **The Pet Quirks Book**
   * *Angle:* Custom stories from the pet's perspective rationalizing their strange habits (e.g., barking at vacuums).
   * *Target:* Pet parents, Christmas gifts, pet birthdays.
3. **Route C (`/kids`):** **Custom Children's Storybooks**
   * *Angle:* Bedtime stories featuring real-life child traits, favorite toys, and names.

---

## 3. Financial Model & Unit Economics (UK Market Focus)

Because physical printed books qualify for **0% VAT in the UK**, profit margins remain high post-sale:

| Line Item | Softcover (8x8" Square) | Hardcover (8x8" Square) | Notes / Vendor |
| :--- | :--- | :--- | :--- |
| **Retail Price** | **£24.99** | **£34.99** | Customer pays £3.50 shipping separately |
| **UK VAT Rate** | 0% | 0% | Zero-rated goods in the UK |
| **Printing & Binding** | ~£6.50 – £7.50 | ~£11.50 – £12.50 | Gelato / Prodigi API |
| **AI Generation (Gemini/Claude + fal.ai)** | ~£0.20 | ~£0.20 | Gemini Flash text + Flux PuLID images |
| **Stripe Processing Fee** | ~£0.62 | ~£0.82 | 1.5% + £0.20 standard UK rate |
| **Direct Production Cost** | **~£7.82** | **~£13.02** | Paid only after receiving customer cash |
| **Gross Margin (Pre-Ads)** | **£17.17 (68%)** | **£21.97 (62%)** | Reinvested into TikTok/Meta performance ads |

---

## 4. Technical Architecture & Tech Stack

```
[ Frontend: Next.js (App Router) + Tailwind CSS ]
                        │
                        ▼
[ Backend: Next.js API Routes / Server Actions ]
                        │
       ┌────────────────┼────────────────┬────────────────┐
       ▼                ▼                ▼                ▼
[ Supabase ]       [ Gemini API ]   [ fal.ai API ]     [ Stripe API ]
 (DB + Storage)   (Story Engine)   (Flux PuLID)      (Checkout)
                        │                                 │
                        └────────────────┬────────────────┘
                                         ▼
                             [ Gelato / Prodigi API ]
                             (Automated Fulfillment)
```

* **Frontend Framework:** Next.js (TypeScript, Tailwind CSS, Lucide React). Path alias `@/*` mapped to root via `tsconfig.json`.
* **Database & Storage:** Supabase (PostgreSQL for order logs + Public Bucket `book-photos` for user uploads).
* **AI Text Generation Engine (Cost MVP):** Google Gemini 2.5 Flash / Flash-Lite via `@google/genai` (utilizing Google AI Studio free tier for low-cost testing).
* **AI Text Generation Engine (Production Upgrade):** Anthropic Claude 3.5 Sonnet (`@anthropic-ai/sdk`) for superior rhyming cadence, literary meter, and comedic timing.
* **AI Image Generation Engine:** `fal.ai` (`@fal-ai/client`) using **Flux PuLID** for identity-consistent, face-matched 3D-animated character rendering across all 10 pages (human subjects only — see below for non-human subjects, e.g. pets).
* **Payments:** Stripe Checkout API & Webhook processing (`whsec_...` signature verification).
* **Fulfillment API:** Gelato REST API (automating 8x8" square softcover/hardcover print orders upon payment capture).

---

## 5. End-to-End Execution Flow

1. **User Onboarding:**
   * User inputs target name, partner/pet/child name, and 3 specific traits/quirks (e.g., *"Always forgets to close cabinets, obsessed with iced coffee"*).
   * User uploads 1 clear front-facing face photo.
2. **Storage & Assets:**
   * Next.js frontend uploads the photo to Supabase Storage bucket (`book-photos`) and retrieves a public URL.
3. **Text & Script Generation (Gemini / Claude):**
   * Backend sends structured prompt to LLM to return a strict 10-page JSON array containing:
     * `pageNumber`: (1 to 10)
     * `storyText`: (2–4 lines of rhyming prose)
     * `imagePrompt`: (Detailed visual scene description including artist style tags)
4. **Image Rendering (fal.ai - Flux PuLID):**
   * System loops through the 10 scene prompts in parallel using `fal-ai/flux-pulid`. Passes the uploaded face image as the identity reference to maintain facial consistency across every scene.
5. **Preview & Editing:**
   * Web page renders a flip-through preview. Users can click to reword or tweak text lines (no complex canvas editing to prevent layout/print errors).
6. **Checkout & Auto-Fulfillment:**
   * User checks out via Stripe (£24.99 + shipping).
   * Stripe Webhook triggers order event $\rightarrow$ Backend generates/compiles print-ready 300 DPI PDF $\rightarrow$ Dispatches order payload to Gelato REST API $\rightarrow$ Gelato prints, packs, and drop-ships directly to the customer.

---

## 6. UI/UX Design Guidelines

* **Brand Aesthetics:** Clean, warm, and approachable.
* **Color Palette:**
  * Background: Warm pastel cream/yellow (`#FFFBF0`)
  * Primary Text: Deep charcoal/navy (`#1E293B`)
  * Accent / CTA: Vibrant coral/orange (`#FF6B52`)
  * Surface Cards: Clean white (`#FFFFFF`) with subtle soft borders (`border-gray-100`)
* **Typography:** Modern rounded sans-serif (e.g., *Plus Jakarta Sans* or *Outfit*) for interface text, paired with a playful display serif for book titles and headers.
* **Layout Integrity:** Locked aspect-ratio image containers (1:1 square) to strictly match physical print bounds (8x8 inches).

---

## 7. Current Project Directory Structure

```
storybook-app/
├── app/
│   ├── api/
│   │   ├── checkout/route.ts        # Stripe Session initialization
│   │   ├── generate-book/route.ts   # Core AI orchestration pipeline
│   │   └── webhooks/stripe/route.ts # Auto-fulfillment webhooks
│   ├── layout.tsx                   # Global app shell & styles
│   └── page.tsx                     # Kookibooks creator interface
├── lib/
│   ├── ai.ts                        # Gemini / Claude & fal.ai API logic
│   ├── gelato.ts                    # Print-on-Demand order dispatcher
│   └── supabase.ts                  # Supabase DB & Storage client
├── .env.local                       # Private API keys
├── package.json
└── tsconfig.json                    # Contains "@/*": ["./*"] path mappings
```

---

## 8. Required Environment Variables

```env
# AI Services
GEMINI_API_KEY="AIzaSy..."
ANTHROPIC_API_KEY="sk-ant-..."
FAL_KEY="fal_..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[your-project-id].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGci..."
SUPABASE_SECRET_KEY="sb_secret_..." # Backend only! (Supabase's current name for the old "service_role" key)

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Print Fulfillment
GELATO_API_KEY="[your-gelato-key]"

# General
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```