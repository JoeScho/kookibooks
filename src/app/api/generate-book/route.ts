import { NextResponse } from "next/server";
import {
  describeSubjectAppearance,
  generateStoryFromNarrative,
  generateStoryScript,
  illustratePages,
} from "@/lib/ai";
import {
  BOOK_TYPES,
  type BookTypeId,
  getBookType,
  NARRATIVE_STYLES,
  type NarrativeStyleId,
} from "@/lib/products";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      bookType,
      subjectName,
      partnerName,
      traits,
      story,
      photoUrl,
      narrativeStyle,
    } = body as {
      bookType?: BookTypeId;
      subjectName?: string;
      partnerName?: string;
      traits?: string[];
      story?: string;
      photoUrl?: string;
      narrativeStyle?: NarrativeStyleId;
    };

    if (!bookType || !BOOK_TYPES.some((b) => b.id === bookType)) {
      return NextResponse.json(
        { error: "Unknown book type." },
        { status: 400 },
      );
    }
    const book = getBookType(bookType)!;
    const style = NARRATIVE_STYLES.some((s) => s.id === narrativeStyle)
      ? narrativeStyle
      : "poem";

    if (!subjectName?.trim()) {
      return NextResponse.json(
        { error: "A name is required." },
        { status: 400 },
      );
    }
    if (!photoUrl) {
      return NextResponse.json(
        { error: "A photo is required." },
        { status: 400 },
      );
    }

    // Ground the illustrations in what's actually in the photo — only
    // needed for "subject" mode (e.g. pets); Flux PuLID ("face" mode)
    // already locks identity from the photo itself via face embeddings.
    // Best-effort: if this fails, generation still proceeds without it
    // rather than blocking the whole book over a description call.
    let appearanceDescription: string | undefined;
    if (book.illustrationMode === "subject") {
      try {
        appearanceDescription = await describeSubjectAppearance(photoUrl);
      } catch (err) {
        console.error(
          "Appearance description failed, continuing without it:",
          err,
        );
      }
    }

    let script: Awaited<ReturnType<typeof generateStoryScript>>;

    if (book.inputMode === "story") {
      // Couples: the buyer (subjectName) writes about their loved one
      // (partnerName) — that loved one is illustrated. Pets: there's no
      // "written by" person — the pet itself (subjectName) is both the
      // illustrated subject and the story's protagonist.
      const illustratedName = book.partnerLabel
        ? partnerName?.trim()
        : subjectName.trim();
      const fromName = book.partnerLabel ? subjectName.trim() : undefined;
      const cleanStory = story?.trim() ?? "";

      if (!illustratedName) {
        return NextResponse.json(
          { error: "A name is required." },
          { status: 400 },
        );
      }
      if (cleanStory.length < 20) {
        return NextResponse.json(
          {
            error:
              "Tell us a bit more of the story (at least a sentence or two).",
          },
          { status: 400 },
        );
      }

      script = await generateStoryFromNarrative(illustratedName, cleanStory, {
        fromName,
        appearanceDescription,
        style,
      });
    } else {
      const cleanTraits = (traits ?? []).map((t) => t.trim()).filter(Boolean);
      if (cleanTraits.length === 0) {
        return NextResponse.json(
          { error: "Add at least one trait or quirk." },
          { status: 400 },
        );
      }

      script = await generateStoryScript(subjectName.trim(), cleanTraits, {
        genre: bookType as "kids" | "pets",
        style,
      });
    }

    const pages = await illustratePages(
      script,
      photoUrl,
      book.illustrationMode,
    );

    return NextResponse.json({ pages });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong generating your book.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
