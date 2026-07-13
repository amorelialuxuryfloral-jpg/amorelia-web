/**
 * REAL Google reviews — Amorelia Luxury Floral Gifts GBP listing, captured 2026-07-11.
 * Source: Documentos/RESENAS-REALES.md (CORRECCIONES puntos 3 & 29).
 *
 * RULES (nada inventado):
 *  - Reviews are shown VERBATIM in their original language (no translation,
 *    no edits, no invented reviews).
 *  - aggregateRating = 5.0 / 3 reviews (all three confirmed 5★ on 2026-07-11)
 *    and lives ONLY on the LocalBusiness node — never on Service, never on
 *    Product (components/JsonLd.tsx localBusinessSchema).
 *  - When the GBP API mirror lands (~jul 2026) this static block is replaced
 *    by the automatic mirror.
 */

export interface RealReview {
  author: string;
  rating: 5;
  /** Approximate month captured from the listing ("Hace un mes" ≈ jun 2026). */
  date: string;
  /** ISO-ish date for schema (month precision). */
  isoDate: string;
  language: "es" | "en";
  /** VERBATIM review text from the GBP listing. */
  text: string;
  /**
   * OPTIONAL photo attached to the review (path under /public, e.g.
   * "/reviews/zayda.webp", or a full https URL from the Google API).
   * Leave it OUT when the reviewer attached none — the card simply renders
   * no image. NEVER fill this with invented/stock photos.
   *
   * Connected 2026-07-12 (real photos from Eric, verified):
   *  - Zayda → /reviews/zayda.webp (her pink/white rose bouquet).
   *  - Louis → /reviews/louis.webp (celebration with the red rose bouquet).
   *    His "inversión Dubái" photo must NOT be used, ever.
   *  - Jesus Pelletier attached no photo → field stays out.
   */
  photo?: string;
  /**
   * OPTIONAL reviewer PROFILE photo (their Google account avatar) — NOT the
   * photo attached to the review. Intentionally EMPTY for now: the avatar
   * next to the name renders the reviewer's INITIAL on a colored circle
   * (components/ReviewerAvatar.tsx). When the Google API mirror lands
   * (~20 jul 2026) and brings the real profile photo URLs, fill this field
   * and the avatars switch to the real photos by themselves. NEVER fill it
   * with the attached bouquet photo or any stock/invented face.
   */
  profilePhoto?: string;
}

// Amorelia arranca SIN reseñas (nada inventado). Cuando tenga reseñas reales
// (Google/GBP), se rellenan aquí y el aggregateRating vuelve solo.
export const REVIEW_AGGREGATE = {
  ratingValue: 0,
  reviewCount: 0,
  bestRating: 5,
} as const;

export const realReviews: RealReview[] = [];
