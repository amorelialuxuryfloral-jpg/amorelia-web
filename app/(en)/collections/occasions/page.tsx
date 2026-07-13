import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { occasionPages } from "@/lib/occasionPagesData";
import { buildMetadata } from "@/lib/seo";

/**
 * Occasions index — /collections/occasions (SPA port, EN; /es/collections/
 * ocasiones ships with the ES tree). Lists every occasion grouped by tier
 * with REAL <a> links in the server HTML (SPEC §2.4). Mother's Day is
 * surfaced first as the dedicated "live collection" card → /mothers-day.
 */

export const revalidate = 3600;

const TITLE = "Flowers by Occasion Miami | Bouquets for Every Moment | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Premium rose bouquets for every occasion: Valentine's, birthdays, anniversaries, sympathy, weddings, Father's Day and more. Same-day delivery in Miami.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/collections/occasions",
    pathEs: "/collections/ocasiones",
  });
}

const TIERS = [
  { tier: 1 as const, title: "The big occasions" },
  { tier: 2 as const, title: "Other occasions" },
  { tier: 3 as const, title: "Small celebrations & moments" },
];

export default function OccasionsIndexPage() {
  const itemList = itemListSchema(
    occasionPages.map((o) => ({
      name: o.h1.en,
      url: `https://amorelialuxuryfloral.com/collections/${o.slug}`,
    })),
    "Occasions",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://amorelialuxuryfloral.com" },
    { name: "Occasions", url: "https://amorelialuxuryfloral.com/collections/occasions" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[itemList, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Occasions" }]} />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">Flowers by Occasion</h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            Flowers by occasion in Miami: every moment calls for a different bouquet, and this is
            the quick guide — from anniversaries to sympathy, birthdays to weddings — with the
            collection that fits each occasion, hand-tied at our atelier with same-day delivery
            before 3PM.
          </p>

          {/* Mother's Day callout — live page, not duplicated here */}
          <Link
            href="/mothers-day"
            className="block mb-10 bg-primary/5 border border-primary/20 rounded-lg p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-primary mb-1">Live collection</p>
                <p className="font-title-retro text-xl text-foreground">Mother&apos;s Day</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  The dedicated Mother&apos;s Day collection with in-stock products.
                </p>
              </div>
            </div>
          </Link>

          {/* Tiered occasion lists */}
          {TIERS.map(({ tier, title: tierTitle }) => {
            const list = occasionPages.filter((o) => o.tier === tier);
            return (
              <section key={tier} className="mb-12">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">{tierTitle}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((o) => (
                    <li key={o.slug}>
                      <Link
                        href={`/collections/${o.slug}`}
                        className="block bg-cream/50 hover:bg-cream rounded-md px-4 py-3 transition-colors"
                      >
                        <p className="font-body text-sm text-foreground hover:text-primary transition-colors">
                          {o.h1.en}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
