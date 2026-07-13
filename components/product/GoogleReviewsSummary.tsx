import { Star } from "lucide-react";
import GoogleLogo from "@/components/GoogleLogo";
import HappyCustomersLine from "@/components/HappyCustomersLine";
import { REVIEW_AGGREGATE } from "@/lib/reviewsData";
import { GBP_CID_URL } from "@/lib/constants";
import type { Language } from "@/i18n";

/**
 * Closing Google-reviews block at the very END of the ficha.
 *
 * Deliberately a SUMMARY (aggregate + link to the GBP listing) instead of
 * repeating the same 3 review cards already shown after Order Now — no
 * duplicated copy. It reads REVIEW_AGGREGATE (real 5.0 / 3), so when the GBP
 * API mirror lands (~jul 2026) the numbers update by themselves. The rating
 * is attributed to the business on Google — it is NOT a product rating and
 * adds NOTHING to the Product schema.
 */
const GoogleReviewsSummary = ({ language = "en" }: { language?: Language }) => {
  if (REVIEW_AGGREGATE.reviewCount === 0) return null; // Amorelia sin reseñas aún
  const isEs = language === "es";
  return (
    <section className="mt-4 mb-8 max-w-3xl mx-auto">
      <div className="rounded-xl border border-border bg-cream/40 px-6 py-10 text-center">
        <span
          className="inline-flex items-center justify-center gap-1 mb-3"
          role="img"
          aria-label={`${REVIEW_AGGREGATE.ratingValue} / 5`}
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </span>
        {/* "5.0 on [Google logo]" — NOT a heading: crawlers that ignore the
            logo's alt would see a truncated H2 ("5.0 on"). Same classes/look,
            demoted to a <p> so the ficha outline stays clean. */}
        <p className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
          {isEs
            ? `${REVIEW_AGGREGATE.ratingValue.toFixed(1)} en`
            : `${REVIEW_AGGREGATE.ratingValue.toFixed(1)} on`}
          <GoogleLogo className="h-6" />
        </p>
        {/* REAL authority datum (shared wording — HappyCustomersLine).
            Styled as a brand statement (wine/primary, semibold) — feedback
            Eric jul 2026: it read too plain in gray. */}
        <p className="font-body text-xs sm:text-sm font-semibold text-primary tracking-wide mb-1 whitespace-nowrap">
          <HappyCustomersLine language={language} />
        </p>
        {/* Opción A (jul 2026): no visible review COUNT — the real 3 stays in
            the LocalBusiness schema and the 3 review cards stay visible. */}
        <p className="font-body text-sm text-muted-foreground mb-5">
          {isEs
            ? "Amorelia Luxury Floral Gifts en Google — reseñas reales de nuestra floristería en Miami."
            : "Amorelia Luxury Floral Gifts on Google — real reviews of our Miami flower shop."}
        </p>
        <a
          href={GBP_CID_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-body text-xs sm:text-sm tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors"
        >
          {isEs ? "Ver todas nuestras reseñas en Google" : "See all our reviews on Google"}
        </a>
      </div>
    </section>
  );
};

export default GoogleReviewsSummary;
