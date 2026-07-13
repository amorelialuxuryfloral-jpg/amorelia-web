/**
 * SEO slugs for bouquet product pages (keyword-first, EN + ES).
 *
 * IMPORTANT (do NOT change without an explicit SEO + redirect plan):
 *  - The KEY is the product `shopifyHandle` — it is NEVER changed and is the
 *    stable identifier used by the cart, Shopify variants, seoData, the manual
 *    order tool and tracking.
 *  - `slug`   = English web URL segment  -> /bouquets/<slug>
 *  - `slugEs` = Spanish web URL segment   -> /es/bouquets/<slugEs>
 *
 * The OLD URLs (/bouquets/all/<handle>, /bouquets/:type/<handle>) are kept alive
 * as 301 redirects to /bouquets/<slug> (see App.tsx BouquetSlugResolver).
 *
 * All 48 slugs (EN and ES) are unique. Collisions in the underlying `color`
 * field were resolved with a short differentiator taken from the internal name
 * (e.g. `-bicolor`, `-elegant`, `-dawn`, `-citrus`, `-tricolor`).
 */

export interface BouquetSlug {
  slug: string;
  slugEs: string;
  /**
   * OPTIONAL keyword-phrase override for the visible H1 / schema / breadcrumb.
   * Fórmula de Romuald (jul 2026): bicolor fichas read as natural keywords —
   * "Red and White Roses Bouquet" ("and" lowercase), color order taken from
   * the REAL keyword in Documentos/KEYWORD-RESEARCH-REAL.md (volume cited
   * inline). When absent, the phrase is derived from the slug (titleCase).
   */
  keywordEn?: string;
  keywordEs?: string;
}

/** handle -> { slug (EN), slugEs (ES) } */
export const BOUQUET_SLUGS: Record<string, BouquetSlug> = {
  // "red and white roses bouquet" 1.900 · "ramo de rosas blancas y rojas" 320
  "bicolor-passion": { slug: "white-red-roses-bouquet-bicolor", slugEs: "ramo-rosas-blancas-rojas-bicolor", keywordEn: "Red and White Roses Bouquet", keywordEs: "Ramo de Rosas Blancas y Rojas" },
  "soft-pink": { slug: "pink-roses-bouquet", slugEs: "ramo-de-rosas-pink" },
  "elegant-contrast": { slug: "white-hot-pink-black-roses-bouquet", slugEs: "ramo-rosas-blancas-hotpink-negras" },
  "radiant-sun": { slug: "yellow-roses-bouquet", slugEs: "ramo-de-rosas-amarillas" },
  "magic-pastel": { slug: "white-pink-purple-roses-bouquet", slugEs: "ramo-rosas-blancas-pink-moradas" },
  "blue-sky": { slug: "blue-roses-bouquet", slugEs: "ramo-de-rosas-azules" },
  // "yellow and white roses bouquet" 170 (real EN order)
  "spring-garden": { slug: "white-yellow-roses-bouquet", slugEs: "ramo-rosas-blancas-amarillas", keywordEn: "Yellow and White Roses Bouquet", keywordEs: "Ramo de Rosas Blancas y Amarillas" },
  "total-passion": { slug: "red-roses-bouquet", slugEs: "ramo-de-rosas-rojas" },
  "fire-sun": { slug: "yellow-red-purple-roses-bouquet", slugEs: "ramo-rosas-amarillas-rojas-moradas" },
  "green-fresh": { slug: "green-roses-bouquet", slugEs: "ramo-de-rosas-verdes" },
  // "white and black roses bouquet" 210
  "night-day": { slug: "white-black-roses-bouquet", slugEs: "ramo-rosas-blancas-negras", keywordEn: "White and Black Roses Bouquet", keywordEs: "Ramo de Rosas Blancas y Negras" },
  "orange-citrus": { slug: "white-orange-roses-bouquet", slugEs: "ramo-rosas-blancas-naranjas", keywordEn: "White and Orange Roses Bouquet", keywordEs: "Ramo de Rosas Blancas y Naranjas" },
  "hot-pink-blush": { slug: "hot-pink-roses-bouquet", slugEs: "ramo-de-rosas-hot-pink" },
  "classic-tricolor": { slug: "red-white-pink-roses-bouquet", slugEs: "ramo-rosas-rojas-blancas-pink" },
  "red-sweetness": { slug: "light-pink-hot-pink-roses-bouquet", slugEs: "ramo-rosas-rosa-claro-hotpink", keywordEn: "Light Pink and Hot Pink Roses Bouquet", keywordEs: "Ramo de Rosas Rosa Claro y Hot Pink" },
  "deep-night": { slug: "black-roses-bouquet", slugEs: "ramo-de-rosas-negras" },
  "warm-sunset": { slug: "white-orange-hot-pink-roses-bouquet", slugEs: "ramo-rosas-blancas-naranjas-hotpink" },
  // "sunflower and red rose bouquet" 880 · "ramo de rosas y girasol" 210
  "sunflowers-passion": { slug: "sunflowers-red-roses-bouquet", slugEs: "ramo-girasoles-rosas-rojas", keywordEn: "Sunflower and Red Rose Bouquet", keywordEs: "Ramo de Rosas y Girasol" },
  "orange-sunset": { slug: "orange-roses-bouquet", slugEs: "ramo-de-rosas-naranjas" },
  "dark-romance": { slug: "red-hot-pink-roses-bouquet", slugEs: "ramo-rosas-rojas-hot-pink", keywordEn: "Red and Hot Pink Roses Bouquet", keywordEs: "Ramo de Rosas Rojas y Hot Pink" },
  "soft-spring": { slug: "white-light-pink-yellow-roses-bouquet", slugEs: "ramo-rosas-blancas-rosa-claro-amarillas" },
  "pure-white": { slug: "white-roses-bouquet", slugEs: "ramo-de-rosas-blancas" },
  // "blue and white roses bouquet" 320
  "white-ocean": { slug: "blue-white-roses-bouquet", slugEs: "ramo-rosas-azules-blancas", keywordEn: "Blue and White Roses Bouquet", keywordEs: "Ramo de Rosas Azules y Blancas" },
  // "yellow and red roses bouquet" 390
  "iberian-passion": { slug: "yellow-red-roses-bouquet", slugEs: "ramo-rosas-amarillas-rojas", keywordEn: "Yellow and Red Roses Bouquet", keywordEs: "Ramo de Rosas Amarillas y Rojas" },
  "purple-charm": { slug: "purple-roses-bouquet", slugEs: "ramo-de-rosas-moradas" },
  "imperial-bee": { slug: "white-yellow-black-roses-bouquet", slugEs: "ramo-rosas-blancas-amarillas-negras" },
  "pink-white-dawn": { slug: "hot-pink-white-roses-bouquet-dawn", slugEs: "ramo-rosas-hotpink-blancas-dawn", keywordEn: "Hot Pink and White Roses Bouquet", keywordEs: "Ramo de Rosas Hot Pink y Blancas" },
  "intense-romance": { slug: "red-white-purple-roses-bouquet", slugEs: "ramo-rosas-rojas-blancas-moradas" },
  "dark-pink-elegance": { slug: "pink-black-roses-bouquet", slugEs: "ramo-rosas-pink-negras", keywordEn: "Pink and Black Roses Bouquet", keywordEs: "Ramo de Rosas Rosadas y Negras" },
  "citrus-refresh": { slug: "orange-yellow-roses-bouquet-citrus", slugEs: "ramo-rosas-naranjas-amarillas-citrus", keywordEn: "Orange and Yellow Roses Bouquet", keywordEs: "Ramo de Rosas Naranjas y Amarillas" },
  "light-citrus": { slug: "orange-yellow-white-roses-bouquet", slugEs: "ramo-rosas-naranjas-amarillas-blancas" },
  // "pink and red roses bouquet" 1.000 · "ramo de rosas rojas y rosadas" 140
  "passionate-love": { slug: "red-pink-roses-bouquet", slugEs: "ramo-rosas-rojas-pink", keywordEn: "Pink and Red Roses Bouquet", keywordEs: "Ramo de Rosas Rojas y Rosadas" },
  // "pink and white roses bouquet" 1.300 · "ramo de rosas rosadas y blancas" 140
  "infinite-tenderness": { slug: "pink-white-roses-bouquet", slugEs: "ramo-rosas-pink-blancas", keywordEn: "Pink and White Roses Bouquet", keywordEs: "Ramo de Rosas Rosadas y Blancas" },
  "tricolor-love": { slug: "red-pink-white-roses-bouquet-tricolor", slugEs: "ramo-rosas-rojas-pink-blancas-tricolor" },
  "pink-symphony": { slug: "hot-pink-light-pink-white-red-roses-bouquet", slugEs: "ramo-rosas-hotpink-rosa-claro-blancas-rojas" },
  // "white red rose bouquet" 1.900 · "rosas rojas y blancas" 110 — reverse
  // order vs bicolor-passion so the two white+red fichas do NOT share an H1.
  "elegant-passion": { slug: "white-red-roses-bouquet-elegant", slugEs: "ramo-rosas-blancas-rojas-elegant", keywordEn: "White and Red Roses Bouquet", keywordEs: "Ramo de Rosas Rojas y Blancas" },
  "aries-bouquet": { slug: "aries-zodiac-bouquet", slugEs: "ramo-zodiaco-aries" },
  "taurus-bouquet": { slug: "taurus-zodiac-bouquet", slugEs: "ramo-zodiaco-tauro" },
  "gemini-bouquet": { slug: "gemini-zodiac-bouquet", slugEs: "ramo-zodiaco-geminis" },
  "cancer-bouquet": { slug: "cancer-zodiac-bouquet", slugEs: "ramo-zodiaco-cancer" },
  "leo-bouquet": { slug: "leo-zodiac-bouquet", slugEs: "ramo-zodiaco-leo" },
  "virgo-bouquet": { slug: "virgo-zodiac-bouquet", slugEs: "ramo-zodiaco-virgo" },
  "libra-bouquet": { slug: "libra-zodiac-bouquet", slugEs: "ramo-zodiaco-libra" },
  "scorpio-bouquet": { slug: "scorpio-zodiac-bouquet", slugEs: "ramo-zodiaco-escorpio" },
  "sagittarius-bouquet": { slug: "sagittarius-zodiac-bouquet", slugEs: "ramo-zodiaco-sagitario" },
  "capricorn-bouquet": { slug: "capricorn-zodiac-bouquet", slugEs: "ramo-zodiaco-capricornio" },
  "aquarius-bouquet": { slug: "aquarius-zodiac-bouquet", slugEs: "ramo-zodiaco-acuario" },
  "pisces-bouquet": { slug: "pisces-zodiac-bouquet", slugEs: "ramo-zodiaco-piscis" },
};

/**
 * Zodiac fichas — PLAN-EJECUCION-DIRECTORES §1 (Romuald): the 12 zodiac
 * bouquet fichas + the /bouquets/zodiac hub stay LIVE (users/PPC) but are
 * noindex,follow and OUT of the sitemap (thin variants of the same product,
 * zero search volume for "zodiac bouquet" terms in the real research).
 */
export const isZodiacBouquetHandle = (handle: string): boolean =>
  /^(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)-bouquet$/.test(
    handle,
  );

/** Reverse maps for O(1) lookup from a URL slug back to the handle. */
const SLUG_TO_HANDLE: Record<string, string> = {};
const SLUG_ES_TO_HANDLE: Record<string, string> = {};
for (const [handle, { slug, slugEs }] of Object.entries(BOUQUET_SLUGS)) {
  SLUG_TO_HANDLE[slug] = handle;
  SLUG_ES_TO_HANDLE[slugEs] = handle;
}

/** EN web slug for a handle. Falls back to the handle itself if unmapped. */
export const slugForHandle = (handle?: string): string =>
  (handle && BOUQUET_SLUGS[handle]?.slug) || handle || "";

/** ES web slug for a handle. Falls back to the EN slug, then the handle. */
export const slugEsForHandle = (handle?: string): string =>
  (handle && BOUQUET_SLUGS[handle]?.slugEs) || slugForHandle(handle);

/**
 * Differentiator suffixes appended to slugs purely to keep them unique
 * (see header note). They are NOT part of the search keyword, so they are
 * stripped before building the visible H1 / SEO keyword phrase.
 */
const SLUG_DIFFERENTIATORS = new Set([
  "bicolor",
  "elegant",
  "dawn",
  "citrus",
  "tricolor",
]);

const titleCaseEn = (slug: string): string =>
  slug
    .split("-")
    .filter((w) => w && !SLUG_DIFFERENTIATORS.has(w))
    .map((w) => (w === "and" ? "&" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

// ES connector words that must stay lowercase in a Title Case phrase.
const ES_LOWER = new Set(["de", "y", "la", "las", "el", "los"]);

const titleCaseEs = (slug: string): string =>
  slug
    .split("-")
    .filter((w) => w && !SLUG_DIFFERENTIATORS.has(w))
    .map((w, i) =>
      i > 0 && ES_LOWER.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1),
    )
    .join(" ");

/**
 * Keyword-first EN H1 phrase: the per-ficha `keywordEn` override when set
 * (bicolor real keywords with lowercase "and"), otherwise derived from the
 * (already keyword-researched) web slug, e.g. "white-roses-bouquet" ->
 * "White Roses Bouquet". Falls back to the raw handle words if unknown.
 */
export const h1ForHandle = (handle?: string): string =>
  (handle && BOUQUET_SLUGS[handle]?.keywordEn) || titleCaseEn(slugForHandle(handle));

/**
 * Keyword-first ES H1 phrase: `keywordEs` override when set, otherwise
 * derived from the ES web slug, e.g. "ramo-de-rosas-blancas" ->
 * "Ramo de Rosas Blancas".
 */
export const h1EsForHandle = (handle?: string): string =>
  (handle && BOUQUET_SLUGS[handle]?.keywordEs) || titleCaseEs(slugEsForHandle(handle));

/**
 * Resolve a URL segment (EN slug, ES slug, or — for back-compat — a raw handle)
 * back to the canonical shopifyHandle. Returns undefined if unknown.
 */
export const handleFromSlug = (slug?: string): string | undefined => {
  if (!slug) return undefined;
  return SLUG_TO_HANDLE[slug] || SLUG_ES_TO_HANDLE[slug] || (BOUQUET_SLUGS[slug] ? slug : undefined);
};
