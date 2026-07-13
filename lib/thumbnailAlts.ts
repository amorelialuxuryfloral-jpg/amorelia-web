/**
 * Per-photo transactional ALT text for the 48 product-page galleries
 * (CORRECCIONES punto 9 — Dani Mód.04 paso 42: "thumbnail 1..5" is a wasted
 * alt; every photo gets a DIFFERENT transactional keyword, by color/type).
 *
 * NADA INVENTADO — every root keyword below is in the REAL Keyword Planner
 * research (KEYWORD-RESEARCH-REAL.md, geo US 2840, 2026-07-11):
 *   "<color> roses bouquet"      e.g. red 9,900 · pink 6,600 · white 5,400 ·
 *                                blue/black 1,900
 *   "100 roses bouquet"          5,400  ("100 rose bouquet" 1,600)
 *   "long stem roses near me"    1,000
 *   "dozen roses near me"        1,000
 *   "same day flower delivery"   90,500 (root)
 *   "<sign> flowers" / "zodiac flowers" 2,400 (informational root, LOW/MED)
 * Composed phrases (root + Miami geo / commercial modifier) follow the same
 * TSR rule as productTransactionalSeo.ts: the cited volume belongs to the
 * ROOT; the composition is editorial.
 */

const ZODIAC_RE =
  /\b(aries|taurus|gemini|cancer|leo|virgo|libra|scorpio|sagittarius|capricorn|aquarius|pisces)\b/i;

/**
 * Distinct transactional alt for gallery photo `idx` (0-based) of a product
 * whose EN keyword phrase is `productKeywordEn` (e.g. "Red Roses Bouquet",
 * "White Red Roses Bouquet", "Aries Bouquet").
 */
export function galleryImageAlt(productKeywordEn: string, idx: number): string {
  const zodiac = productKeywordEn.match(ZODIAC_RE);
  if (zodiac) {
    const sign = zodiac[0];
    const variants = [
      `${sign} zodiac bouquet Miami`,
      `zodiac flowers — ${sign} rose bouquet`,
      `${sign} birthday flowers Miami`,
      `zodiac sign bouquet for ${sign}`,
      `${sign} bouquet same-day delivery Miami`,
    ];
    return variants[idx % variants.length];
  }

  // "Red Roses Bouquet" -> "Red Roses"; multi-color phrases keep every color.
  const colorPhrase = productKeywordEn.replace(/\s*Bouquet\s*$/i, "").trim() || productKeywordEn;
  const single = /^[A-Za-z-]+(?: Pink)? Roses$/i.test(colorPhrase); // "Red Roses", "Hot Pink Roses"…

  const variants = single
    ? [
        `${colorPhrase} Bouquet Miami`,
        `Dozen ${colorPhrase} Miami`,
        `100 ${colorPhrase} Bouquet`,
        `Long Stem ${colorPhrase} Miami`,
        `${colorPhrase} Same-Day Delivery Miami`,
      ]
    : [
        `${productKeywordEn} Miami`,
        `Bouquet of ${colorPhrase} Miami`,
        `100 Roses Bouquet — ${colorPhrase}`,
        `${colorPhrase} Flower Bouquet Miami`,
        `${colorPhrase} Same-Day Delivery Miami`,
      ];
  return variants[idx % variants.length];
}
