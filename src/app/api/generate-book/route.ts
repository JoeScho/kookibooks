import { NextResponse } from "next/server";
import { describeSubjectAppearance, generateHeroPoses } from "@/lib/ai";
import { compositePage, fetchImageBuffer } from "@/lib/composer";
import {
  type BookTypeId,
  getBookType,
  NARRATIVE_STYLES,
  type NarrativeStyleId,
} from "@/lib/products";
import { adaptStoryTemplate, getStoryTemplate } from "@/lib/story-engine";
import { createAdminClient } from "@/lib/supabase/admin";

const PREVIEWS_BUCKET = "KookiBooks-previews";

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

    const book = bookType ? getBookType(bookType) : undefined;
    if (!book) {
      return NextResponse.json(
        { error: "Unknown book type." },
        { status: 400 },
      );
    }
    const style =
      NARRATIVE_STYLES.find((s) => s.id === narrativeStyle)?.id ?? "poem";

    const cleanSubjectName = subjectName?.trim() ?? "";
    const cleanPartnerName = partnerName?.trim() ?? "";
    if (!cleanSubjectName) {
      return NextResponse.json(
        { error: "A name is required." },
        { status: 400 },
      );
    }
    if (book.partnerLabel && !cleanPartnerName) {
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

    // Every book type now collects both: a few real traits/quirks and a
    // short free-text story, both about whoever is illustrated (the loved
    // one, for couples — not the buyer). See lib/story-engine.ts.
    const illustratedName = book.partnerLabel
      ? cleanPartnerName
      : cleanSubjectName;
    const fromName = book.partnerLabel ? cleanSubjectName : undefined;
    const cleanTraits = (traits ?? []).map((t) => t.trim()).filter(Boolean);
    const cleanStory = story?.trim() ?? "";

    if (cleanTraits.length === 0) {
      return NextResponse.json(
        { error: "Add at least one trait or quirk." },
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

    // Ground the hero render in what's actually in the photo — only needed
    // for "subject" mode (e.g. pets); Flux PuLID ("face" mode) already
    // locks identity from the photo itself via face embeddings. Unlike
    // "face" mode, "subject" mode's hero render is pure text-to-image (see
    // lib/ai.ts generateHeroPoseCutout) — the photo itself never reaches
    // the image model, so this description is the only identity signal
    // there is. A failure here can't be shrugged off as best-effort
    // anymore; it has to fail the request.
    let appearanceDescription: string | undefined;
    if (book.illustrationMode === "subject") {
      try {
        appearanceDescription = await describeSubjectAppearance(photoUrl);
      } catch (err) {
        console.error("Appearance description failed:", err);
        return NextResponse.json(
          {
            error:
              "Couldn't get a good look at the photo. Please try a clearer one.",
          },
          { status: 400 },
        );
      }
    }

    const template = getStoryTemplate(book.id);

    const { title, pages } = await adaptStoryTemplate(book.id, {
      subjectName: illustratedName,
      fromName,
      traits: cleanTraits,
      story: cleanStory,
      style,
    });

    const posesNeeded = template.pages.map((p) => p.pose);
    const heroPoseUrls = await generateHeroPoses(
      posesNeeded,
      photoUrl,
      book.illustrationMode,
      appearanceDescription,
    );
    const heroPoseBuffers = Object.fromEntries(
      await Promise.all(
        Object.entries(heroPoseUrls).map(async ([pose, url]) => [
          pose,
          await fetchImageBuffer(url),
        ]),
      ),
    );

    const admin = createAdminClient();
    const sessionId = crypto.randomUUID();

    const composited = await Promise.all(
      template.pages.map(async (templatePage, i) => {
        const heroCutout = heroPoseBuffers[templatePage.pose];
        const pageBuffer = await compositePage(
          templatePage.baseImageAsset,
          heroCutout,
          templatePage.compositeSlot,
        );

        const path = `${sessionId}/page-${String(templatePage.pageNumber).padStart(2, "0")}.png`;
        const { error: uploadError } = await admin.storage
          .from(PREVIEWS_BUCKET)
          .upload(path, pageBuffer, { contentType: "image/png" });
        if (uploadError) {
          throw new Error(
            `Preview upload failed for page ${templatePage.pageNumber}: ${uploadError.message}`,
          );
        }
        const { data: publicUrlData } = admin.storage
          .from(PREVIEWS_BUCKET)
          .getPublicUrl(path);

        return {
          pageNumber: templatePage.pageNumber,
          storyText: pages[i].storyText,
          imageUrl: publicUrlData.publicUrl,
        };
      }),
    );

    composited.sort((a, b) => a.pageNumber - b.pageNumber);

    return NextResponse.json({ title, pages: composited });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong generating your book.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
