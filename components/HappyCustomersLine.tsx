import type { Language } from "@/i18n";

/**
 * REAL authority datum, shared wording (jul 2026): the physical Amorelia store
 * has served 70,000+ customers in total over the years — confirmed by the
 * owner. Shopify's 358 was only the recent online part. NADA INVENTADO.
 *
 * Used in the ProductRatingBar (48 PDPs + room decors), the "What Our Clients
 * Say" header (home + ficha) and the closing GoogleReviewsSummary block.
 *
 * Responsive: "in Miami" / "en Miami" is hidden on mobile (<640px) so the
 * whole line — "★★★★★ 5.0 · 10,000+ happy customers served" — fits on ONE
 * line at 390px without wrapping or horizontal overflow.
 */
const HappyCustomersLine = ({ language = "en" }: { language?: Language }) => {
  const isEs = language === "es";
  return (
    <>
      {isEs ? "+70.000 clientes atendidos y felices" : "70,000+ happy customers served"}
      <span className="hidden sm:inline">{isEs ? " en Miami" : " in Miami"}</span>
    </>
  );
};

export default HappyCustomersLine;
