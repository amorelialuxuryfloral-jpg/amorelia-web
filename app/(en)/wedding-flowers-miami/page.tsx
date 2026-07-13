import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { localBusinessSchema, breadcrumbSchema } from "@/components/JsonLd";
import { NAP_PHONE_DISPLAY, NAP_PHONE_TEL } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";

/**
 * /wedding-flowers-miami — PLAN-EJECUCION-DIRECTORES §6 (Romuald+Dani).
 *
 * PÁGINA LEAD (high-ticket): the "wedding flowers miami" SERP is service /
 * lead intent + directories — NOT an add-to-cart grid. CTA = request a quote
 * (contact form + phone), no cart. "Bridal bouquet" (22.200 national) is an
 * H2 here, NOT a subpage (plan §6). Replaces /collections/wedding-flowers
 * (301 in next.config.ts; retired copy in lib/retiredOccasionDrafts.ts —
 * the body copy below is that validated copy, restructured to the plan's H2s).
 *
 * KW (KEYWORD-RESEARCH-REAL): wedding flowers 33.100 · wedding bouquets
 * 27.100 · bridal bouquet(s) 22.200 · bridesmaid bouquets 5.400 · wedding
 * florist near me 9.900 (near-me = GBP listing, not this page).
 * EN-only canonical (lead page, like the barrio landings).
 */

export const revalidate = 3600;

const PATH = "/wedding-flowers-miami";
const TITLE = "Wedding Flowers Miami | Bridal Bouquets & Ceremony | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Wedding flowers in Miami: bridal bouquets, bridesmaid pieces, boutonnieres, ceremony arrangements and centerpieces, made by hand from premium Ecuadorian roses. Request a quote.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    noAlternateEs: true,
  });
}

const SECTIONS = [
  {
    id: "bridal-bouquets",
    h2: "Bridal bouquets",
    body: "The timeless bridal bouquet: 30–50 stems of premium white roses, hand-tied with silk or linen ribbon and sized to the bride's frame — we match the white tone to the dress so they don't fight in photos. Prefer color? Hot pink, blush, deep red or a white-and-rose-gold bicolor: we build the exact palette, and you can preview it in our custom builder before we hand-finish it in the workshop.",
  },
  {
    id: "bridesmaids-boutonnieres",
    h2: "Bridesmaid bouquets & boutonnieres",
    body: "Bridesmaid bouquets are scaled-down echoes of the bridal piece, coordinated to the same palette so the wedding party photographs as one story. We complete the personal flowers with boutonnieres for the groom and groomsmen, tied to the same rose and ribbon selection.",
  },
  {
    id: "ceremony-centerpieces",
    h2: "Ceremony arrangements & reception centerpieces",
    body: "Ceremony arrangements, sweetheart-table centerpieces and reception roses — one cohesive palette across the whole day. Most brides book 4–8 weeks out; rush orders inside two weeks are possible on availability. For full wedding orders (10+ pieces) we quote the complete set and schedule a visual sample if needed.",
  },
] as const;

export default function WeddingFlowersMiamiPage() {
  const selfUrl = `https://amorelialuxuryfloral.com${PATH}`;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Wedding flowers in Miami",
    serviceType: "Wedding florist",
    provider: { "@id": "https://amorelialuxuryfloral.com/#localbusiness" },
    areaServed: { "@type": "City", name: "Miami" },
    description: DESCRIPTION,
    url: selfUrl,
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://amorelialuxuryfloral.com" },
    { name: "Wedding Flowers Miami", url: selfUrl },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[localBusinessSchema(), serviceSchema, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Wedding Flowers Miami" }]} />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            Wedding Flowers in Miami — Bridal Bouquets &amp; Ceremony Florals
          </h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-10">
            Wedding flowers are the one thing you don&apos;t risk on an online template. Amorelia
            Flowers makes bridal bouquets, bridesmaid pieces and ceremony arrangements by hand in
            our Miami atelier, from premium Ecuadorian roses — one palette, one florist, delivered
            and ready on the day. Tell us your date and venue and we send you a quote.
          </p>

          {/* Lead sections — bridal bouquet is an H2, not a subpage (plan §6) */}
          <div className="space-y-10 mb-14">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">{s.h2}</h2>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>

          {/* Request a quote — LEAD CTA (no add-to-cart) */}
          <section id="request-a-quote" className="scroll-mt-28 bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mb-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-3">Request a quote</h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              Send us your wedding date, venue, approximate piece count and color palette — we reply
              with a quote and, for full wedding orders, schedule a visual sample.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Request a quote <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={NAP_PHONE_TEL}
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors"
              >
                <Phone className="w-4 h-4" /> {NAP_PHONE_DISPLAY}
              </a>
            </div>
          </section>

          {/* Related (link direction: lead page → money pages) */}
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              While you plan, you may also like:
            </h2>
            <ul className="flex flex-wrap gap-3">
              {[
                { href: "/bouquets/white-roses", label: "White Roses" },
                { href: "/collections/anniversary-flowers", label: "Anniversary Flowers" },
                { href: "/flower-shop-miami", label: "Miami Flower Shop" },
                { href: "/bouquets/personalizar", label: "Custom bouquet builder (AI preview)" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 bg-cream/60 hover:bg-cream border border-border rounded-full px-4 py-2 font-body text-sm text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
