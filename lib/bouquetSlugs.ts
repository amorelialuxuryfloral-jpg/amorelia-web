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

/**
 * handle -> { slug (EN), slugEs (ES) }
 *
 * AMORELIA: se DERIVA del catálogo real (`bouquetProducts`) en vez de mantener
 * una tabla a mano. Los handles de Amorelia ya son slugs limpios y únicos
 * (blush-petals, sapphire-dream, crimson-and-ivory…), así que slug = slugEs =
 * handle. Esto (a) garantiza que TODO handle del catálogo tiene su slug → la
 * ficha resuelve como `product` y NO entra en el bucle 308 (antes la tabla era
 * de Charls y los handles de Amorelia caían en "handle crudo → 301 a sí mismo");
 * (b) se auto-sincroniza si se añaden/quitan bouquets. El H1/keyword se deriva
 * por titleCase del handle (ej. "blush-petals" → "Blush Petals"). Cuando haya
 * keyword research real de Amorelia (fase 2 SEO) se puede volver a una tabla
 * con `keywordEn`/`keywordEs` + slugs ES nativos y sus 301.
 */
export const BOUQUET_SLUGS: Record<string, BouquetSlug> = {
  "crimson-and-ivory": { slug: "crimson-and-ivory", slugEs: "crimson-and-ivory" },
  "blush-petals": { slug: "blush-petals", slugEs: "blush-petals" },
  "bold-contrast": { slug: "bold-contrast", slugEs: "bold-contrast" },
  "golden-sunshine": { slug: "golden-sunshine", slugEs: "golden-sunshine" },
  "pastel-reverie": { slug: "pastel-reverie", slugEs: "pastel-reverie" },
  "sapphire-dream": { slug: "sapphire-dream", slugEs: "sapphire-dream" },
  "sunlit-meadow": { slug: "sunlit-meadow", slugEs: "sunlit-meadow" },
  "scarlet-devotion": { slug: "scarlet-devotion", slugEs: "scarlet-devotion" },
  "fire-and-gold": { slug: "fire-and-gold", slugEs: "fire-and-gold" },
  "emerald-whisper": { slug: "emerald-whisper", slugEs: "emerald-whisper" },
  "monochrome": { slug: "monochrome", slugEs: "monochrome" },
  "sunkissed": { slug: "sunkissed", slugEs: "sunkissed" },
  "fuchsia-glow": { slug: "fuchsia-glow", slugEs: "fuchsia-glow" },
  "timeless-romance": { slug: "timeless-romance", slugEs: "timeless-romance" },
  "ros-affair": { slug: "ros-affair", slugEs: "ros-affair" },
  "onyx-rose": { slug: "onyx-rose", slugEs: "onyx-rose" },
  "autumn-glow": { slug: "autumn-glow", slugEs: "autumn-glow" },
  "sunflower-romance": { slug: "sunflower-romance", slugEs: "sunflower-romance" },
  "amber-radiance": { slug: "amber-radiance", slugEs: "amber-radiance" },
  "midnight-amour": { slug: "midnight-amour", slugEs: "midnight-amour" },
  "spring-whisper": { slug: "spring-whisper", slugEs: "spring-whisper" },
  "ivory-elegance": { slug: "ivory-elegance", slugEs: "ivory-elegance" },
  "azure-tide": { slug: "azure-tide", slugEs: "azure-tide" },
  "golden-ardor": { slug: "golden-ardor", slugEs: "golden-ardor" },
  "violet-majesty": { slug: "violet-majesty", slugEs: "violet-majesty" },
  "imperial-trio": { slug: "imperial-trio", slugEs: "imperial-trio" },
  "aurora-blush": { slug: "aurora-blush", slugEs: "aurora-blush" },
  "regal-romance": { slug: "regal-romance", slugEs: "regal-romance" },
  "ros-noir": { slug: "ros-noir", slugEs: "ros-noir" },
  "citrus-bloom": { slug: "citrus-bloom", slugEs: "citrus-bloom" },
  "sunburst-duo": { slug: "sunburst-duo", slugEs: "sunburst-duo" },
  "velvet-ardor": { slug: "velvet-ardor", slugEs: "velvet-ardor" },
  "eternal-grace": { slug: "eternal-grace", slugEs: "eternal-grace" },
  "amore-trio": { slug: "amore-trio", slugEs: "amore-trio" },
  "rose-harmony": { slug: "rose-harmony", slugEs: "rose-harmony" },
  "noir-romance": { slug: "noir-romance", slugEs: "noir-romance" },
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
