import Link from "next/link";
import LazyMapEmbed from "@/components/LazyMapEmbed";
import { ArrowRight, MapPin, Truck, Store, Clock, Sparkles, Phone, Navigation } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { localBusinessSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { GBP_EMBED_SRC, GBP_CID_URL, NAP_ADDRESS, NAP_PHONE_DISPLAY, NAP_PHONE_TEL } from "@/lib/constants";
import type { LandingPageData } from "@/lib/landingPagesData";

/**
 * Root-level landing pages (barrios + hub + niche) — Server Component port of
 * the SPA's LandingPage extended layout, upgraded per SPEC:
 *  - §2.7 map = the GBP LISTING embed (business name + reviews), not a locator.
 *  - §6 barrio: zones as H3 (non-clickable), unique cost/hours per barrio,
 *    FAQ, NAP, GBP embed. The duplicated delivery boilerplate (~70% identical
 *    across barrios, audit item d) now lives ONCE as a standard-facts block;
 *    the paragraph keeps only each barrio's UNIQUE distance/cost data.
 *  - Audit item (c): "popular occasions" were plain text → occasion mentions
 *    now LINK to their transactional collection page (link direction: local
 *    landing → money page).
 *  - §3 canibalizaciones: internal links pointing at the three 301'd seasonal
 *    landings are remapped to their surviving URLs.
 */

interface Props {
  page: LandingPageData;
}

// §3 fusion targets — never emit an internal link to a redirected URL.
// Only Wynwood (0 searches) stays degraded (CORRECCIONES puntos 16/35).
const SLUG_REMAP: Record<string, string> = {
  "valentines-day-flowers-miami": "/collections/valentines-flowers",
  "mothers-day-bouquets-miami": "/mothers-day",
  "quinceanera-bouquets-miami": "/collections/quinceanera-bouquet",
  "flower-delivery-wynwood": "/",
};

const internalHref = (slug: string): string => SLUG_REMAP[slug] ?? `/${slug}`;

// Occasion-phrase → transactional collection (first match wins).
const OCCASION_LINKS: Array<{ re: RegExp; href: string }> = [
  { re: /mother'?s day|d[ií]a de las madres/i, href: "/mothers-day" },
  { re: /valentine'?s/i, href: "/collections/valentines-flowers" },
  { re: /quincea[nñ]era|quinces/i, href: "/collections/quinceanera-bouquet" },
  { re: /wedding|bridal/i, href: "/wedding-flowers-miami" },
  { re: /birthday|cumplea[nñ]os/i, href: "/collections/birthday-flowers" },
  { re: /anniversar\w+|aniversarios? de boda/i, href: "/collections/anniversary-flowers" },
  { re: /sympathy|funeral|coronas funerarias/i, href: "/funeral-sympathy-flowers-miami" },
  { re: /get-well/i, href: "/collections/get-well-flowers" },
  { re: /graduation/i, href: "/collections/graduation-flowers" },
  { re: /romantic surprises?/i, href: "/collections/romance-flowers" },
  { re: /gender reveal/i, href: "/gender-reveal-flowers-miami" },
  { re: /father'?s day|d[ií]a del padre/i, href: "/collections/fathers-day-flowers" },
  { re: /client appreciation|teacher appreciation/i, href: "/collections/thank-you-flowers" },
];

/** Wrap the first matched occasion phrase of `text` in a real <a> (unless it
 *  would self-link the current page). */
function linkifyOccasion(text: string, currentPath: string): React.ReactNode {
  for (const { re, href } of OCCASION_LINKS) {
    if (href === currentPath) continue;
    const m = text.match(re);
    if (m && m.index !== undefined) {
      const before = text.slice(0, m.index);
      const after = text.slice(m.index + m[0].length);
      return (
        <>
          {before}
          <Link href={href} className="text-primary hover:underline">
            {m[0]}
          </Link>
          {after}
        </>
      );
    }
  }
  return text;
}

const LandingPageView = ({ page }: Props) => {
  const seo = page.seo!;
  const currentPath = `/${page.slug}`;
  const breadcrumbLabel = page.h1.split("|")[0].split("—")[0].trim();

  const localBusiness = {
    ...localBusinessSchema(),
    areaServed: { "@type": "Place", name: seo.areaServed },
  };
  // Service schema (SPEC: LocalBusiness/Service on barrios): the delivery
  // service scoped to this page's area, with the REAL published base rate.
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: breadcrumbLabel,
    serviceType: "Flower delivery",
    provider: { "@id": "https://amorelialuxuryfloral.com/#localbusiness" },
    areaServed: { "@type": "Place", name: seo.areaServed },
    url: `https://amorelialuxuryfloral.com${currentPath}`,
    offers: { "@type": "Offer", price: "25.00", priceCurrency: "USD" },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          localBusiness,
          serviceSchema,
          faqSchema(seo.faqs.map((f) => ({ question: f.question, answer: f.answer }))),
          breadcrumbSchema([
            { name: "Home", url: "https://amorelialuxuryfloral.com" },
            { name: breadcrumbLabel, url: `https://amorelialuxuryfloral.com${currentPath}` },
          ]),
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: breadcrumbLabel }]} />
          <div className="max-w-3xl mx-auto">
            <h1 className="font-title-retro text-3xl md:text-5xl text-foreground mb-6">{page.h1}</h1>
            <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed mb-12">{page.intro}</p>

            {/* Why we deliver here */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{seo.whyTitle}</h2>
              <p className="font-body text-base text-foreground leading-relaxed">{seo.whyParagraph}</p>
            </section>

            {/* Zones — H3 per zone, non-clickable (SPEC §6 barrio) */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{seo.zonesTitle}</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">{seo.zonesIntro}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {seo.zones.map((zone) => {
                  const label = typeof zone === "string" ? zone : zone.label;
                  return (
                    <div key={label} className="flex items-start gap-2 bg-cream/50 rounded-md px-3 py-2">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <h3 className="font-body text-sm text-foreground font-normal">
                        {typeof zone === "string" ? (
                          label
                        ) : (
                          // Hub "Neighborhoods we deliver to": REAL <a> to the barrio page.
                          <Link href={`/${zone.slug}`} className="text-primary hover:underline">
                            {label}
                          </Link>
                        )}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Occasions — each mention LINKS to its collection (audit item c) */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{seo.occasionsTitle}</h2>
              <p className="font-body text-sm text-muted-foreground mb-4">{seo.occasionsIntro}</p>
              <ul className="space-y-2">
                {seo.occasions.map((o) => (
                  <li key={o} className="flex items-start gap-2 font-body text-sm md:text-base text-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{linkifyOccasion(o, currentPath)}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Delivery info — unique per-area paragraph + shared standard facts */}
            <section className="mb-16 bg-card border border-border rounded-lg p-6">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> {seo.deliveryTitle}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{seo.deliveryParagraph}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">$25</p>
                    <p className="font-body text-xs text-muted-foreground">First 0–5 miles</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">2 hours</p>
                    <p className="font-body text-xs text-muted-foreground">Min. preparation</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Store className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">Free pickup</p>
                    <p className="font-body text-xs text-muted-foreground">7257 NW 12th St</p>
                  </div>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4">
                <Link href="/collections/same-day-delivery" className="text-primary hover:underline">
                  Same-day delivery
                </Link>{" "}
                for orders before 3PM Miami time · Mon–Fri 8AM–7PM · Sat 8AM–5PM · Sun closed
              </p>
              <div className="mt-2">
                <Link href="/shipping-policy" className="font-body text-xs text-primary hover:underline">
                  See full shipping policy →
                </Link>
              </div>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">{seo.faqTitle}</h2>
              <div className="space-y-4">
                {seo.faqs.map((faq) => (
                  <div key={faq.question} className="border border-border rounded-xl p-5">
                    <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-1.5">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Internal links (§3-safe hrefs) */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">{seo.internalLinksTitle}</h2>
              <ul className="flex flex-wrap gap-3">
                {seo.internalLinks.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={internalHref(link.slug)}
                      className="inline-flex items-center gap-1 bg-cream/60 hover:bg-cream border border-border rounded-full px-4 py-2 font-body text-sm text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* NAP + GBP listing embed (SPEC §2.7 / §6) */}
            <section className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4">
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" /> Amorelia Luxury Floral Gifts — {NAP_ADDRESS}
                </p>
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={NAP_PHONE_TEL} className="hover:text-primary transition-colors">
                    {NAP_PHONE_DISPLAY}
                  </a>
                </p>
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary shrink-0" />
                  <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Get directions
                  </a>
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden h-[300px]">
                <LazyMapEmbed
                  title={`Amorelia Luxury Floral Gifts Miami — ${seo.areaServed} delivery area`}
                  src={GBP_EMBED_SRC}
                  className="absolute inset-0 block w-full h-full rounded-lg align-top"
                  placeholderLabel="Map"
                />
              </div>
            </section>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/bouquets"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
              >
                {seo.ctaLabel} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/bouquets/personalizar"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-lg"
              >
                Custom Bouquet <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageView;
