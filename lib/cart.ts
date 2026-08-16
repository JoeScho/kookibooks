import type { BookTypeId, EditionId } from "@/lib/products";

export interface GeneratedPage {
  pageNumber: number;
  storyText: string;
  imageUrl?: string;
}

export interface CartItem {
  id: string;
  bookType: BookTypeId;
  title: string;
  subjectName: string;
  edition: EditionId;
  quantity: number;
  unitAmountP: number; // pence, per book
  coverImageUrl?: string;
  // Full generated book, carried through checkout so the print-ready PDF
  // can be compiled once the order is paid (see lib/pdf.ts).
  pages?: GeneratedPage[];
  // Storage path in the private "KookiBooks-pdfs" bucket — deliberately not
  // a fetchable URL. The compiled PDF is a paid, print-ready file; nothing
  // in the app should expose a permanent public link to it. A short-lived
  // signed URL is minted from this path only at the moment of Gelato
  // dispatch (see lib/pdf.ts createSignedPdfUrl).
  pdfPath?: string;
}

export const CART_STORAGE_KEY = "kookibooks:cart";

export function readCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

export function cartSubtotalP(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.unitAmountP * item.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
