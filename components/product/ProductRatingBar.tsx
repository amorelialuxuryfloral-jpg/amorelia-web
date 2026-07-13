import { Star } from "lucide-react";
import { realReviews, REVIEW_AGGREGATE } from "@/lib/reviewsData";
import HappyCustomersLine from "@/components/HappyCustomersLine";
import ReviewerAvatar from "@/components/ReviewerAvatar";
import GoogleLogo from "@/components/GoogleLogo";
import type { Language } from "@/i18n";

/**
 * Rating + trust bar shown BETWEEN the product gallery and the title on every
 * ficha (48 PDPs).
 *
 * NADA INVENTADO:
 *  - The rating is the REAL business aggregate — 5.0 / 3 Google reviews from
 *    lib/reviewsData.ts — and it is explicitly labeled as the BUSINESS's
 *    Google reviews ("Amorelia Luxury Floral Gifts on Google"), never as a product rating.
 *    The link scrolls to the reviews section (#reviews) on the SAME page —
 *    the external GBP link lives in GoogleReviewsSummary at the end of the
 *    ficha. No aggregateRating is added to any schema here (it lives ONLY on
 *    the LocalBusiness node).
 *  - Avatars = reviewer INITIALS (ReviewerAvatar), or the real Google
 *    profilePhoto once the API mirror fills it (~20 jul 2026). Never the
 *    bouquet photo attached to the review, never a stock face (feedback
 *    Eric jul 2026).
 *  - Trust stickers (full variant) are the 3 Amorelia wine-colored badges under
 *    the rating line: Same Day Delivery / Freshness 100% Guaranteed / The Best
 *    Value — validated claims only, shown as one row of 3 on mobile & desktop.
 *
 * variant="compact" (CartDrawer, under "Continue to Secure Checkout"): ONE
 * clean line — ONLY the 5 stars + the 10,000+ happy customers authority line
 * (HappyCustomersLine, REAL datum). No Google logo, no avatars, no trust
 * chips, no link (nothing pulls the customer away from checkout) — feedback
 * Eric jul 2026: "solo las estrellas y después +10,000 customers".
 */
const ProductRatingBar = ({
  language = "en",
  align = "left",
  variant = "full",
}: {
  language?: Language;
  align?: "left" | "center";
  variant?: "full" | "compact";
}) => {
  if (REVIEW_AGGREGATE.reviewCount === 0) return null; // Amorelia sin reseñas aún
  const isEs = language === "es";
  const compact = variant === "compact";
  const centered = align === "center";
  // Opción A (jul 2026): "★★★★★ 5.0 on Google" — the review COUNT (real 3)
  // is deliberately NOT shouted in the visible text; it stays truthful in the
  // LocalBusiness schema (JsonLd) and the 3 real review cards remain visible.
  const attribution = (
    <>
      {isEs ? "Amorelia Luxury Floral Gifts en" : "Amorelia Luxury Floral Gifts on"}
      <GoogleLogo className="h-4" />
    </>
  );
  // Wine-colored circular badges (public/stickers/). Same alt as the current
  // web (ProductTrustBlock): validated claims, EN alt works for ES too.
  const stickers: Array<{ src: string; alt: string }> = [
    { src: "/stickers/same-day.webp", alt: "Same Day Delivery" },
    { src: "/stickers/freshness.webp", alt: "Freshness 100% Guaranteed" },
    { src: "/stickers/best-value.webp", alt: "The Best Value" },
  ];

  if (compact) {
    /* Cart drawer: ONE clean line — stars + "10,000+ happy customers served"
       in the brand wine color. Nothing else (no 5.0, no Google logo, no
       avatars) — feedback Eric jul 2026. */
    return (
      <div className={`flex items-center gap-2 whitespace-nowrap ${centered ? "justify-center" : ""}`}>
        <span
          className="inline-flex items-center gap-0.5"
          role="img"
          aria-label={`${REVIEW_AGGREGATE.ratingValue} / 5`}
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-primary text-primary" />
          ))}
        </span>
        <span className="font-body text-xs sm:text-sm font-semibold text-primary tracking-wide">
          <HappyCustomersLine language={language} />
        </span>
      </div>
    );
  }

  return (
    <div className={`mb-4 space-y-2.5 ${centered ? "flex flex-col items-center" : ""}`}>
      <div className={`flex items-center gap-2 flex-wrap ${centered ? "justify-center" : ""}`}>
        {/* Stars + 5.0 + authority line grouped in ONE non-wrapping span so on
            mobile it reads "★★★★★ 5.0 · 10,000+ happy customers served" on a
            single line ("in Miami" is desktop-only — HappyCustomersLine);
            avatars + Google attribution may wrap below. */}
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span
            className="inline-flex items-center gap-0.5"
            role="img"
            aria-label={`${REVIEW_AGGREGATE.ratingValue} / 5`}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </span>
          <span className="font-body text-sm font-semibold text-foreground">
            {REVIEW_AGGREGATE.ratingValue.toFixed(1)}
          </span>
          {/* REAL authority datum styled as a brand statement (wine/primary,
              semibold) — shared wording lives in HappyCustomersLine
              (NADA INVENTADO). */}
          <span className="font-body text-xs sm:text-sm text-muted-foreground">
            ·{" "}
            <span className="font-semibold text-primary tracking-wide">
              <HappyCustomersLine language={language} />
            </span>
          </span>
        </span>
        {/* Reviewer avatars — initials (or real profilePhoto when the API
            mirror fills it). NOT the bouquet photo attached to the review. */}
        <span className="flex -space-x-2 items-center" aria-hidden="true">
          {realReviews.map((r) => (
            <ReviewerAvatar
              key={r.author}
              name={r.author}
              profilePhoto={r.profilePhoto}
              size="sm"
              className="border-2 border-background"
            />
          ))}
        </span>
        {/* Native anchor → smooth-scrolls (CSS scroll-behavior) to the
            reviews section after Order Now on this SAME page. */}
        <a
          href="#reviews"
          className="font-body text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          {attribution}
        </a>
      </div>
      <div className={`flex items-center gap-3 sm:gap-4 ${centered ? "justify-center" : ""}`}>
        {stickers.map(({ src, alt }) => (
          <img
            key={src}
            src={src}
            alt={alt}
            width={80}
            height={80}
            loading="lazy"
            decoding="async"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
        ))}
      </div>
    </div>
  );
};

export default ProductRatingBar;
