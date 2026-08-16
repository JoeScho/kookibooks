import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BookWizard } from "@/components/creator/book-wizard";
import { SectionHeading } from "@/components/section-heading";
import { Container } from "@/components/ui/container";
import { BOOK_TYPES, getBookType } from "@/lib/products";

export function generateStaticParams() {
  return BOOK_TYPES.map((book) => ({ type: book.slug }));
}

export async function generateMetadata(
  props: PageProps<"/create/[type]">,
): Promise<Metadata> {
  const { type } = await props.params;
  const book = getBookType(type);
  return { title: book ? `Create — ${book.name}` : "Create your book" };
}

export default async function CreatePage(props: PageProps<"/create/[type]">) {
  const { type } = await props.params;
  const book = getBookType(type);
  if (!book) notFound();

  return (
    <Container className="py-12 sm:py-16">
      <SectionHeading
        eyebrow={book.name}
        title="Let's build their book"
        subtitle="Takes about five minutes. You'll get a full preview before you pay."
        className="mb-10"
      />
      <BookWizard book={book} />
    </Container>
  );
}
