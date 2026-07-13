import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { getTranslator } from "@/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * Flowers index — /collections/flowers.
 *
 * SPEC §4 rewrite of the SPA's FlowerTypesIndexPage: the SPA listed 16 flower
 * types, most of them EMPTY "notify me" pages (tulips, peonies, orchids…).
 * Those are NOT migrated (no empty transactional pages in routes/menu/
 * sitemap), so this hub lists only what Amorelia REALLY sells today:
 *   - Ramo Buchón (the whole catalog qualifies — 27,100/mo ES keyword)
 *   - Floral Arrangements (74,000/mo — hung with the real catalog)
 *   - The 9 indexable rose color collections (real products)
 * When a flower type gets real product in Shopify, it is added back here and
 * to /collections/<slug> in the same commit.
 */

export const revalidate = 3600;

const TITLE = "Flowers by Type Miami | Rose Bouquets, Ramo Buchón & Arrangements | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Every flower we deliver across Miami today: rose bouquets in 9 colors, oversized ramo buchón and handcrafted floral arrangements. Same-day delivery before 3PM.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/collections/flowers",
    pathEs: "/collections/flores",
  });
}

export default function FlowersIndexPage() {
  const { t } = getTranslator("en");

  const collections: Array<{ href: string; name: string; tag: string }> = [
    { href: "/collections/ramo-buchon", name: "Ramo Buchón — Oversized Rose Bouquet", tag: "Signature" },
    { href: "/collections/floral-arrangements", name: "Floral Arrangements Miami", tag: "Catalog" },
    ...COLOR_COLLECTIONS.map((c) => ({
      href: `/bouquets/${c.slug}`,
      name: t(`nav.${c.color}Roses`),
      tag: "Roses",
    })),
  ];

  const itemList = itemListSchema(
    collections.map((c) => ({ name: c.name, url: `https://amorelialuxuryfloral.com${c.href}` })),
    "Flower types",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://amorelialuxuryfloral.com" },
    { name: "Flowers", url: "https://amorelialuxuryfloral.com/collections/flowers" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[itemList, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Flowers" }]} />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">Flowers by Type</h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            Everything we hand-tie and deliver across Miami today — premium rose bouquets in every color,
            the oversized ramo buchón, and made-to-order floral arrangements. Every collection below is
            stocked with real product, ready for same-day delivery when you order before 3PM.
          </p>

          <section className="mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">Shop by flower</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {collections.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="flex items-center justify-between gap-3 bg-cream/50 hover:bg-cream rounded-md px-4 py-3 transition-colors"
                  >
                    <p className="font-body text-sm text-foreground hover:text-primary transition-colors">{c.name}</p>
                    <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">{c.tag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-cream rounded-lg p-6 md:p-8">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-2">Can&apos;t find your flower?</h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-4">
              Our custom builder lets you design the exact bouquet — 50 to 200 roses, your colors, natural,
              glitter or painted finish, with an AI preview before you pay.
            </p>
            <Link
              href="/bouquets/personalizar"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm hover:bg-primary/90 transition-colors"
            >
              Build a custom bouquet
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
