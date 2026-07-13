import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import JsonLd, { localBusinessSchema, breadcrumbSchema } from "@/components/JsonLd";
import { zodiacFlowerSigns, ZODIAC_FLOWERS_PATH } from "@/lib/zodiacFlowersData";
import { BIRTH_FLOWERS_PATH } from "@/lib/birthFlowersData";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * /flowers-by-zodiac-sign — CORRECCIONES punto 32: the zodiac opportunity is
 * INFORMATIONAL ("zodiac flowers" 2,400/mo MEDIUM; "zodiac bouquet" = 0), so
 * the SEO lives in this guide — 12 H2s, one per sign, each with the mandatory
 * correa a producto to the REAL Amorelia zodiac bouquet + the matching rose
 * color collection. Same pattern as /birth-flowers-by-month. EN-only canonical.
 */

export const revalidate = 3600;

const TITLE = "Flowers by Zodiac Sign — Every Sign's Flower & Bouquet | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Zodiac flowers guide: the traditional flower of all 12 zodiac signs, what it means — and the zodiac bouquet we hand-tie for each sign in Miami, same-day before 3PM.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: ZODIAC_FLOWERS_PATH,
    type: "article",
    noAlternateEs: true,
  });
}

export default function FlowersByZodiacSignPage() {
  const selfUrl = `https://amorelialuxuryfloral.com${ZODIAC_FLOWERS_PATH}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Flowers by Zodiac Sign: The Complete Guide",
    description: DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    author: { "@type": "Organization", name: "Amorelia Luxury Floral Gifts" },
    publisher: {
      "@type": "Organization",
      name: "Amorelia Luxury Floral Gifts",
      logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": selfUrl },
    url: selfUrl,
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://amorelialuxuryfloral.com" },
    { name: "Flowers by Zodiac Sign", url: selfUrl },
  ]);

  const toc: TocItem[] = zodiacFlowerSigns.map((s) => ({
    id: s.id,
    label: `${s.sign} — ${s.flower}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[localBusinessSchema(), articleLd, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Flowers by Zodiac Sign" }]} />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            Flowers by Zodiac Sign: The Complete Guide
          </h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">
            Every zodiac sign has a flower traditionally associated with it — a pairing that comes
            from centuries of flower lore and astrology. This guide covers all twelve zodiac
            flowers and what they mean, and for each sign we show you the zodiac bouquet we
            actually hand-tie at our Miami atelier: the sign&apos;s color, its glyph and baby&apos;s
            breath, from 50 to 200 roses, with same-day delivery for orders before 3PM.
          </p>

          <TableOfContents items={toc} heading="Jump to a sign" />

          <div className="space-y-14 mt-10">
            {zodiacFlowerSigns.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-1">{s.h2}</h2>
                <p className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-4">{s.dates}</p>
                {s.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-3"
                  >
                    {p}
                  </p>
                ))}
                {/* Correa a producto — REAL Amorelia links, every sign */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    href={s.bouquetLink.href}
                    className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full px-4 py-2 font-body text-sm text-primary transition-colors"
                  >
                    <Gift className="w-4 h-4" /> {s.bouquetLink.label}
                  </Link>
                  <Link
                    href={s.colorLink.href}
                    className="inline-flex items-center gap-2 bg-cream/60 hover:bg-cream border border-border rounded-full px-4 py-2 font-body text-sm text-primary transition-colors"
                  >
                    {s.colorLink.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* Related guide + closing CTA */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mt-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-3">
              Send their zodiac bouquet in Miami today
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              Pick their sign&apos;s bouquet or build a custom arrangement in their sign&apos;s
              color — 50 to 200 premium roses, delivered same-day across Miami for orders before
              3PM. Born-month more your style? See our{" "}
              <Link href={BIRTH_FLOWERS_PATH} className="text-primary underline underline-offset-2">
                birth flowers by month
              </Link>{" "}
              guide.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/bouquets/zodiac"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Shop all zodiac bouquets <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/bouquets/personalizar"
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors"
              >
                Build a custom bouquet <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
