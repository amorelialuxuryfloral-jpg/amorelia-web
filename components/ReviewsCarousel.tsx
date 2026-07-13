import { Star } from "lucide-react";
import { realReviews } from "@/lib/reviewsData";
import ReviewerAvatar from "@/components/ReviewerAvatar";
import GoogleLogo from "@/components/GoogleLogo";
import type { Language } from "@/i18n";

/**
 * Horizontal scroll-snap carousel with the 3 REAL Google reviews
 * (lib/reviewsData.ts, verbatim — RESENAS-REALES.md, CORRECCIONES punto 3).
 *
 * Extracted 1:1 from views/home.tsx so the home and the 48 product fichas
 * share the SAME component/markup. CSS-only (scroll-snap), SSR-safe: every
 * review is in the served HTML; the overflow-x is pure presentation, so it
 * scales to N reviews without stacking when the GBP API mirror lands
 * (~jul 2026). Mobile swipes ~1 card per view, desktop shows ~3. Long
 * reviews scroll inside the card.
 */
const ReviewsCarousel = ({ language = "en" }: { language?: Language }) => {
  if (realReviews.length === 0) return null; // Amorelia sin reseñas aún
  const isEs = language === "es";
  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-5 pb-2 -mx-6 px-6 md:mx-0 md:px-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {realReviews.map((review) => (
        <figure key={review.author} className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[46%] lg:w-[32%] bg-background border border-border rounded-xl p-6 flex flex-col">
          <div className="flex items-center gap-0.5 mb-3" role="img" aria-label="5 out of 5 stars">
            {[...Array(review.rating)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
            ))}
          </div>
          <blockquote className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line flex-1 max-h-60 overflow-y-auto overscroll-contain pr-1">
            {review.text}
          </blockquote>
          {/* Optional review photo — only rendered when the REAL photo
              exists in reviewsData.ts (no placeholder, no gap).
              Sources are 250×250 → rounded square thumb, no upscaling. */}
          {review.photo && (
            <img
              src={review.photo}
              alt={
                isEs
                  ? `Foto de la reseña de ${review.author} — Amorelia Luxury Floral Gifts`
                  : `Amorelia Luxury Floral Gifts review photo — ${review.author}`
              }
              loading="lazy"
              decoding="async"
              width={250}
              height={250}
              className="mt-4 h-28 w-28 rounded-lg object-cover border border-border"
            />
          )}
          {/* Author row — avatar = INITIAL (or real Google profilePhoto when
              the API mirror fills it, ~20 jul 2026). NOT the bouquet photo
              above (feedback Eric jul 2026). */}
          <figcaption className="mt-4 flex items-center gap-3">
            <ReviewerAvatar name={review.author} profilePhoto={review.profilePhoto} size="md" />
            <span className="min-w-0">
              <span className="block font-display text-sm font-semibold text-foreground">{review.author}</span>
              <span className="flex items-center gap-1 font-body text-xs text-muted-foreground font-normal mt-0.5">
                <GoogleLogo className="h-3.5" /> · {review.date}
              </span>
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
};

export default ReviewsCarousel;
