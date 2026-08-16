import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  title: {
    default: "Kookibooks — Every quirk has a story",
    template: "%s | Kookibooks",
  },
  description:
    "Turn your kid, your pet, or your other half into the hero of a custom, illustrated storybook. Written and printed just for them.",
  openGraph: {
    title: "Kookibooks — Every quirk has a story",
    description:
      "Custom, illustrated storybooks starring your kid, your pet, or your other half.",
    siteName: "Kookibooks",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFBF0",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
