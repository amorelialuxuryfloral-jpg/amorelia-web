import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CollectionLanding from "@/components/CollectionLanding";
import { sameDayDeliveryPage } from "@/lib/sameDayCollectionData";
import { flowerTypePages } from "@/lib/flowerTypePagesData";
import { occasionPages, type OccasionPage } from "@/lib/occasionPagesData";
import { buildMetadata } from "@/lib/seo";

/**
 * /collections/<slug> — transactional collection landings (SPEC §4/§6).
 *
 * Phase 2 shipped the two money pages (same-day-delivery, ramo-buchon).
 * Phase 3 adds:
 *   - The 23 OCCASION pages (occasionPagesData) — each with a REAL product
 *     grid (live Shopify collection when populated, real rose catalog as the
 *     guaranteed-not-empty fallback). SPEC §4: no empty transactional pages.
 *   - /collections/floral-arrangements ("floral arrangements" 74,000/mo) —
 *     hung with the real catalog (every Amorelia bouquet IS a hand-tied floral
 *     arrangement; nothing invented).
 *
 * NOT routed (SPEC §4 — kept as draft copy only): flower-type pages with zero
 *   product (tulips, peonies, lilies, orchids, money-bouquet, bridal-bouquets,
 *   flower-subscription…). They stay OUT of routes, menu and
 *   sitemap until real product exists → real 404 here.
 *
 * Canonicalization: a native ES slug requested under the EN tree 301s to the
 * EN collection (the /es tree ships in phase 4 with native slugs).
 */

export const revalidate = 600;
// ES-slug redirects resolve at runtime.
export const dynamicParams = true;

const ramoBuchonPage = flowerTypePages.find((p) => p.slug === "ramo-buchon")!;
const floralArrangementsPage = flowerTypePages.find((p) => p.slug === "floral-arrangements")!;

interface CollectionEntry {
  page: OccasionPage;
  parent?: { path: string; url: string; label: string };
}

const FLOWERS_PARENT = {
  path: "/collections/flowers",
  url: "https://amorelialuxuryfloral.com/collections/flowers",
  label: "Flowers",
};

const COLLECTION_PAGES: Record<string, CollectionEntry> = {
  "same-day-delivery": {
    page: sameDayDeliveryPage,
    // Parent = the informational delivery hub (SPEC §4: linked from home + delivery).
    parent: { path: "/delivery", url: "https://amorelialuxuryfloral.com/delivery", label: "Delivery" },
  },
  "ramo-buchon": { page: ramoBuchonPage, parent: FLOWERS_PARENT },
  "floral-arrangements": { page: floralArrangementsPage, parent: FLOWERS_PARENT },
  // Occasion pages — parent defaults to the occasions index inside CollectionLanding.
  ...Object.fromEntries(occasionPages.map((page) => [page.slug, { page }])),
};

/** Native ES slug → EN slug (301 when requested under the EN tree). */
const ES_TO_EN: Record<string, string> = Object.fromEntries(
  Object.values(COLLECTION_PAGES)
    .filter((e) => e.page.slugEs !== e.page.slug)
    .map((e) => [e.page.slugEs, e.page.slug]),
);

export function generateStaticParams() {
  return Object.keys(COLLECTION_PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = COLLECTION_PAGES[slug];
  if (!entry) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: entry.page.title.en,
    description: entry.page.description.en,
    path: `/collections/${entry.page.slug}`,
    pathEs: `/collections/${entry.page.slugEs}`,
  });
}

export default async function CollectionSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = COLLECTION_PAGES[slug];
  if (!entry) {
    if (ES_TO_EN[slug]) permanentRedirect(`/collections/${ES_TO_EN[slug]}`);
    notFound();
  }
  return <CollectionLanding page={entry.page} language="en" parent={entry.parent} />;
}
