/**
 * Self-hosted fonts via next/font (no render-blocking Google Fonts request).
 * Same 4 families as the SPA; exposed as CSS variables consumed by
 * tailwind.config.ts (font-display / font-body / font-title-retro /
 * font-subtitle-script). Shared by BOTH root layouts (EN + /es).
 */
import { Playfair_Display, Lato, Righteous, Great_Vibes } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
  display: "swap",
});

export const righteous = Righteous({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-righteous",
  display: "swap",
});

export const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
});

export const fontClassNames = () =>
  `${playfair.variable} ${lato.variable} ${righteous.variable} ${greatVibes.variable}`;
