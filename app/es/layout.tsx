import type { Metadata } from "next";
import RootDocument from "@/components/RootDocument";
import "../globals.css";

/**
 * ES root layout — the whole Spanish tree lives under /es with its own root
 * layout so the server HTML ships `<html lang="es">` (the SPA patched
 * document.documentElement.lang client-side; here it is correct at the
 * source). Chrome (Navbar/Footer/CookieBanner/CartDrawer) renders in Spanish.
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

export default function EsRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <RootDocument language="es">{children}</RootDocument>;
}
