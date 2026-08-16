import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-lg">
        <SectionHeading
          eyebrow="Get in touch"
          title="Questions about an order, or just want to say hi?"
          align="left"
          className="mb-8"
        />
        <ContactForm />
      </div>
    </Container>
  );
}
