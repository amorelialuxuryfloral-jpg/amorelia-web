import { Star } from "lucide-react";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import GoogleLogo from "@/components/GoogleLogo";
import HappyCustomersLine from "@/components/HappyCustomersLine";
import { REVIEW_AGGREGATE } from "@/lib/reviewsData";
import { GBP_CID_URL } from "@/lib/constants";
import type { Language } from "@/i18n";

/**
 * Google reviews section on the ficha — right AFTER the Order Now button.
 * Same carousel component/style as the home (components/ReviewsCarousel.tsx,
 * the 3 REAL Google reviews, verbatim). Aggregate line = the real 5.0 / 3
 * business rating, clearly attributed to Google and linked to the GBP CID.
 *
 * id="reviews" — anchor target for the ProductRatingBar link under the
 * gallery (smooth in-page scroll; scroll-mt clears the fixed Navbar).
 */
const ProductReviewsSection = ({ language = "en" }: { language?: Language }) => {
  if (REVIEW_AGGREGATE.reviewCount === 0) return null; // Amorelia sin reseñas aún
  const isEs = language === "es";
  return (
    <section id="reviews" className="mt-14 lg:mt-20 max-w-6xl mx-auto scroll-mt-28">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
          {isEs ? "Lo Que Dicen Nuestros Clientes" : "What Our Clients Say"}
        </h2>
        <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${REVIEW_AGGREGATE.ratingValue} / 5`}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-primary text-primary" />
            ))}
          </span>
          <span className="font-semibold text-foreground">{REVIEW_AGGREGATE.ratingValue.toFixed(1)}</span>
          {/* Opción A (jul 2026): "★★★★★ 5.0 on Google" without shouting the
              review count (real 3 lives in the LocalBusiness schema only). */}
          <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
            {isEs ? "reseñas reales en" : "real reviews on"}
            <GoogleLogo className="h-4" />
          </a>
        </p>
        {/* REAL authority datum (shared wording — HappyCustomersLine): own
            line under the rating so it never wraps mid-sentence on mobile.
            Styled as a brand statement (wine/primary, semibold) — feedback
            Eric jul 2026: it read too plain in gray. */}
        <p className="font-body text-xs sm:text-sm font-semibold text-primary tracking-wide mt-1 whitespace-nowrap">
          <HappyCustomersLine language={language} />
        </p>
      </div>
      <ReviewsCarousel language={language} />
    </section>
  );
};

export default ProductReviewsSection;
