// Publishable client-side API keys (restricted by HTTP referrer)
export const GOOGLE_MAPS_API_KEY = "AIzaSyC0LmYmsnkDvaYrPZsYgMUL2HYju2sZfJc";

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

// Main hero cover image. Self-hosted in public/ — re-encoded WebP q80 (~47%
// lighter than the Shopify CDN original, visually identical) and served
// same-origin, so mobile LCP loads faster with no extra cdn.shopify.com hop.
export const FOTO_DE_PORTADA = "/hero-portada-1280.webp";
// 828w so mobile (100vw ≈ 720 device px) picks a ~50KB image instead of the
// 1280w (~94KB); desktop still gets 1280/1920 for full sharpness.
export const FOTO_DE_PORTADA_SRCSET = [640, 828, 1280, 1920]
  .map((w) => `/hero-portada-${w}.webp ${w}w`)
  .join(", ");
