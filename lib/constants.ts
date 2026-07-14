// (La Google Maps API key NO va en el código: vive solo en Supabase como
// secreto y la usan las Edge Functions en servidor. El frontend nunca la ve.)

// GBP listing embed (spec §2.7 — the business's own Google Business Profile
// map with name + reviews, NOT a generic locator). Same src the live site uses.
export const GBP_EMBED_SRC =
  "https://www.google.com/maps?q=7257+NW+12th+St,+Miami,+FL+33126&output=embed";

// GBP listing "Get directions / Cómo llegar" deep link (CID of the Amorelia
// Flowers listing — CORRECCIONES punto 19: web ↔ ficha bridge, dani-autoridad-gbp).
export const GBP_CID_URL =
  "https://www.google.com/maps/search/?api=1&query=7257+NW+12th+St+Miami+FL+33126";

// NAP — normalized to the exact GBP listing form (never re-format).
// Phone: the REAL Amorelia number (904 — do NOT change the number). Display
// always carries the US country prefix "+1"; tel:/schema use E.164.
export const NAP_ADDRESS = "7257 NW 12th St, Miami, FL 33126";
export const NAP_PHONE_DISPLAY = "+1 786-494-8647";
export const NAP_PHONE_TEL = "tel:+17864948647";

// Main hero cover image (Amorelia — rosas, 2026-07-14). Self-hosted in public/,
// re-encoded WebP: 640w=40KB, 828w=58KB, 1199w=90KB. Native source is 1199px
// wide, so we don't upscale beyond it (would only add weight + softness).
export const FOTO_DE_PORTADA = "/hero-portada-1199.webp";
// 640w for mobile (LCP ~40KB), 828 for tablets, 1199 (native max) for desktop.
export const FOTO_DE_PORTADA_SRCSET = [640, 828, 1199]
  .map((w) => `/hero-portada-${w}.webp ${w}w`)
  .join(", ");
