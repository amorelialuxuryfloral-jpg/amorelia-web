import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import JsonLd, { localBusinessSchema, breadcrumbSchema } from "@/components/JsonLd";
import {
  birthFlowerMonths,
  BIRTH_FLOWERS_PATH,
  BIRTHDAY_COLLECTION_HREF,
} from "@/lib/birthFlowersData";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * /birth-flowers-by-month — PLAN-EJECUCION-DIRECTORES §7: informational
 * pillar (sonda). 12 H2s, one per month, ordered by real volume; each month
 * educates on the TRUE birth flower and bridges to a REAL Amorelia product
 * (rose color collection + birthday collection). A month only graduates to
 * its own URL if Search Console shows a signal — no subpages now.
 * EN-only canonical.
 */

export const revalidate = 3600;

const TITLE = "Birth Flowers by Month — Every Month's Flower & Meaning | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "The complete guide to birth flowers by month: every month's flower, its meaning and history — plus the rose palette to gift for each birthday, hand-tied in Miami.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: BIRTH_FLOWERS_PATH,
    type: "article",
    noAlternateEs: true,
  });
}

export default function BirthFlowersByMonthPage() {
  const selfUrl = `https://amorelialuxuryfloral.com${BIRTH_FLOWERS_PATH}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Birth Flowers by Month: The Complete Guide",
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
    { name: "Birth Flowers by Month", url: selfUrl },
  ]);

  const toc: TocItem[] = birthFlowerMonths.map((m) => ({
    id: m.id,
    label: `${m.month} — ${m.flower}`,
  }));

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[localBusinessSchema(), articleLd, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Birth Flowers by Month" }]} />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            Birth Flowers by Month: The Complete Guide
          </h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">
            Every month of the year has its own birth flower, with a meaning and a history behind
            it — a tradition that goes back to the Victorian language of flowers. This guide covers
            all twelve, and for each month we show you the rose palette that carries the same
            message, hand-tied to order at our Miami atelier with same-day delivery before 3PM.
          </p>

          <TableOfContents items={toc} heading="Jump to a month" />

          <div className="space-y-14 mt-10">
            {birthFlowerMonths.map((m) => (
              <section key={m.id} id={m.id} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">{m.h2}</h2>
                {m.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-3"
                  >
                    {p}
                  </p>
                ))}
                {/* Correa a producto — REAL Amorelia links, every month */}
                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    href={m.colorLink.href}
                    className="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full px-4 py-2 font-body text-sm text-primary transition-colors"
                  >
                    <Gift className="w-4 h-4" /> {m.colorLink.label}
                  </Link>
                  <Link
                    href={BIRTHDAY_COLLECTION_HREF}
                    className="inline-flex items-center gap-2 bg-cream/60 hover:bg-cream border border-border rounded-full px-4 py-2 font-body text-sm text-primary transition-colors"
                  >
                    Birthday flowers — same-day Miami delivery <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </section>
            ))}
          </div>

          {/* Closing CTA */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mt-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-3">
              Send birthday flowers in Miami today
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              Whatever their month, we build the bouquet around their birth flower&apos;s palette —
              50 to 200 premium roses, delivered same-day across Miami for orders before 3PM. More
              into astrology? See our{" "}
              <Link href="/flowers-by-zodiac-sign" className="text-primary underline underline-offset-2">
                flowers by zodiac sign
              </Link>{" "}
              guide.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href={BIRTHDAY_COLLECTION_HREF}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Shop birthday flowers <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/bouquets/personalizar"
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors"
              >
                Build a custom bouquet
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
