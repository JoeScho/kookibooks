import type { MetadataRoute } from "next";
import { BOOK_TYPES } from "@/lib/products";

const STATIC_ROUTES = [
  "",
  "/kids",
  "/pets",
  "/couples",
  "/how-it-works",
  "/faq",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/shipping-returns",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...BOOK_TYPES.map((book) => ({
      url: `${base}/create/${book.slug}`,
      lastModified: new Date(),
    })),
  ];
}
