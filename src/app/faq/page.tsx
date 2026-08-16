import type { Metadata } from "next";
import { FaqAccordion } from "@/components/faq-accordion";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "FAQ" };

const FAQS = [
  {
    question: "How long does it take to make a book?",
    answer:
      "Creating and previewing a book takes about five minutes. Once you order, we typically print, pack, and dispatch within 2-4 working days.",
  },
  {
    question: "Can I edit the story before I buy?",
    answer:
      "Yes — after your preview generates, you can click into any page and edit the text directly. We keep editing to text only so the print layout never breaks.",
  },
  {
    question: "What photo should I upload?",
    answer:
      "A single, clear, front-facing, well-lit photo works best. Avoid sunglasses, heavy shadows, or group shots — our illustration engine uses it purely as a likeness reference.",
  },
  {
    question: "Is this appropriate for kids?",
    answer:
      "Kookibooks is a family-friendly platform. Every story — including our pet and couples books — is written to be warm, funny, and kind, never mean-spirited or inappropriate.",
  },
  {
    question: "What sizes and formats are available?",
    answer:
      'Every book is an 8×8" square, 10-page illustrated storybook, available as a matte softcover (£24.99) or a durable case-bound hardcover (£34.99), plus a flat £3.50 UK shipping fee.',
  },
  {
    question: "Do you charge VAT?",
    answer:
      "Printed books are zero-rated for VAT in the UK, so the price you see is the price you pay — no VAT added at checkout.",
  },
  {
    question: "Can I order more than one copy?",
    answer:
      "Yes — set the quantity on the preview screen before adding it to your basket.",
  },
  {
    question: "What if I'm not happy with my book?",
    answer:
      "Reach out via our contact page within 30 days of delivery and we'll make it right — a reprint or a refund, whichever makes sense.",
  },
];

export default function FaqPage() {
  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Questions"
        title="Frequently asked questions"
        className="mb-10"
      />
      <div className="mx-auto max-w-2xl">
        <FaqAccordion items={FAQS} />
      </div>
    </Container>
  );
}
