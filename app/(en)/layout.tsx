import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";
import "../globals.css";

/**
 * EN root layout — all English routes live in this (en) route group.
 * The Spanish tree has its own root layout at app/es/layout.tsx
 * (multiple root layouts → correct `<html lang>` per language in the
 * server HTML, no client-side patching).
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://amorelialuxuryfloral.com"),
  authors: [{ name: "Amorelia Luxury Floral Gifts" }],
  verification: {
    google: "Z80PyWF7gS-jGNjBCf9cJDttt0abHTsiDf5vHBNOdH0",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function EnRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument language="en">{children}</RootDocument>;
}
