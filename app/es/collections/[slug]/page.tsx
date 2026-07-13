import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CollectionLanding from "@/components/CollectionLanding";
import { sameDayDeliveryPage } from "@/lib/sameDayCollectionData";
import { flowerTypePages } from "@/lib/flowerTypePagesData";
import { occasionPages, type OccasionPage } from "@/lib/occasionPagesData";
import { buildMetadata } from "@/lib/seo";

/**
 * /es/collections/<slugEs> — ES twin of the EN collection landings (phase 4).
 * Same COLLECTION_PAGES inventory as the EN tree (SPEC §4: only pages with
 * real product), resolved by the NATIVE Spanish slug. An EN slug requested
 * under /es 301s to the ES canonical (mirror of the EN tree's behavior).
 */

export const revalidate = 600;
export const dynamicParams = true;

const ramoBuchonPage = flowerTypePages.find((p) => p.slug === "ramo-buchon")!;
const floralArrangementsPage = flowerTypePages.find((p) => p.slug === "floral-arrangements")!;

interface CollectionEntry {
  page: OccasionPage;
  parent?: { path: string; url: string; label: string };
}

const FLORES_PARENT = {
  path: "/es/collections/flores",
  url: "https://amorelialuxuryfloral.com/es/collections/flores",
  label: "Flores",
};

/** Keyed by the NATIVE ES slug. */
const COLLECTION_PAGES_ES: Record<string, CollectionEntry> = {
  [sameDayDeliveryPage.slugEs]: {
    page: sameDayDeliveryPage,
    parent: { path: "/es/delivery", url: "https://amorelialuxuryfloral.com/es/delivery", label: "Envío" },
  },
  [ramoBuchonPage.slugEs]: { page: ramoBuchonPage, parent: FLORES_PARENT },
  [floralArrangementsPage.slugEs]: { page: floralArrangementsPage, parent: FLORES_PARENT },
  ...Object.fromEntries(occasionPages.map((page) => [page.slugEs, { page }])),
};

/** EN slug → ES slug (301 when requested under the ES tree). */
const EN_TO_ES: Record<string, string> = Object.fromEntries(
  Object.values(COLLECTION_PAGES_ES)
    .filter((e) => e.page.slugEs !== e.page.slug)
    .map((e) => [e.page.slug, e.page.slugEs]),
);

export function generateStaticParams() {
  return Object.keys(COLLECTION_PAGES_ES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = COLLECTION_PAGES_ES[slug];
  if (!entry) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: entry.page.title.es,
    description: entry.page.description.es,
    path: `/collections/${entry.page.slug}`,
    pathEs: `/collections/${entry.page.slugEs}`,
    language: "es",
  });
}

export default async function CollectionSlugPageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = COLLECTION_PAGES_ES[slug];
  if (!entry) {
    if (EN_TO_ES[slug]) permanentRedirect(`/es/collections/${EN_TO_ES[slug]}`);
    notFound();
  }
  return <CollectionLanding page={entry.page} language="es" parent={entry.parent} />;
}
