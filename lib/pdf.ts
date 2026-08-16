import "server-only";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { GeneratedPage } from "@/lib/cart";
import { createAdminClient } from "@/lib/supabase/admin";

// 8" square at 72pt/inch — matches Gelato's 8×8" softcover/hardcover trim
// size used elsewhere in the app (see lib/products.ts EDITIONS).
const PAGE_SIZE = 576;
const TEXT_BAND_HEIGHT = 150;
const MARGIN = 24;
const PDF_BUCKET = "KookiBooks-pdfs";

async function fetchImageBytes(
  url: string,
): Promise<{ bytes: Uint8Array; format: "jpg" | "png" }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download page image (${res.status})`);
  const bytes = new Uint8Array(await res.arrayBuffer());

  // Sniff the format from magic bytes rather than trusting a content-type
  // header — the fal.ai CDN doesn't always set one we can rely on.
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47;
  return { bytes, format: isPng ? "png" : "jpg" };
}

/**
 * Compiles a book's pages into a print-ready square PDF: one full-bleed
 * illustration per page with the story text overlaid in a band at the
 * bottom, matching the plan's "generate/compile print-ready PDF" step.
 *
 * Caveat: this renders at whatever resolution the source illustrations came
 * back at (fal.ai's `square_hd`, ~1024px) — fine to preview and order, but
 * short of a true 300 DPI production file. Worth a higher-res render pass
 * before printing at real volume.
 */
export async function generateBookPdf(
  title: string,
  pages: GeneratedPage[],
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);

  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const labelFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  const ordered = [...pages].sort((a, b) => a.pageNumber - b.pageNumber);

  for (const page of ordered) {
    const pdfPage = pdf.addPage([PAGE_SIZE, PAGE_SIZE]);

    if (page.imageUrl) {
      try {
        const { bytes, format } = await fetchImageBytes(page.imageUrl);
        const image =
          format === "png"
            ? await pdf.embedPng(bytes)
            : await pdf.embedJpg(bytes);
        pdfPage.drawImage(image, {
          x: 0,
          y: 0,
          width: PAGE_SIZE,
          height: PAGE_SIZE,
        });
      } catch (err) {
        // Don't fail the whole book over one bad image — ship a text-only
        // page and let whoever's reviewing the order notice it's short an
        // illustration, rather than losing the other nine pages too.
        console.error(
          `Couldn't embed illustration for page ${page.pageNumber}:`,
          err,
        );
      }
    }

    // Translucent white band so story text stays legible over any
    // illustration underneath it.
    pdfPage.drawRectangle({
      x: 0,
      y: 0,
      width: PAGE_SIZE,
      height: TEXT_BAND_HEIGHT,
      color: rgb(1, 1, 1),
      opacity: 0.85,
    });
    pdfPage.drawText(page.storyText, {
      x: MARGIN,
      y: TEXT_BAND_HEIGHT - MARGIN - 16,
      size: 16,
      font: bodyFont,
      lineHeight: 20,
      maxWidth: PAGE_SIZE - MARGIN * 2,
      color: rgb(0.12, 0.16, 0.22),
    });
    pdfPage.drawText(String(page.pageNumber), {
      x: PAGE_SIZE - MARGIN - 10,
      y: MARGIN / 2,
      size: 10,
      font: labelFont,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  return pdf.save();
}

/**
 * Uploads a compiled PDF to Supabase Storage and returns its storage path
 * (not a URL). This bucket must be PRIVATE — the file is a paid, print-ready
 * artifact and should never be reachable by a permanent public link. Use
 * `createSignedPdfUrl` to get a short-lived fetchable URL when one is
 * actually needed (i.e. handing it to Gelato).
 */
export async function uploadBookPdf(
  orderId: string,
  itemId: string,
  bytes: Uint8Array,
): Promise<string> {
  const admin = createAdminClient();
  const path = `${orderId}/${itemId}.pdf`;

  const { error } = await admin.storage
    .from(PDF_BUCKET)
    .upload(path, bytes, { contentType: "application/pdf", upsert: true });

  if (error) throw new Error(`PDF upload failed: ${error.message}`);

  return path;
}

/**
 * Mints a time-limited signed URL for a stored PDF. Call this right before
 * handing the URL to Gelato — don't persist the result anywhere; it expires,
 * and the underlying file should stay private otherwise.
 */
export async function createSignedPdfUrl(
  path: string,
  expiresInSeconds = 60 * 60 * 24,
): Promise<string> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage
    .from(PDF_BUCKET)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data)
    throw new Error(`Couldn't create a signed PDF URL: ${error?.message}`);

  return data.signedUrl;
}
