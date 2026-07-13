import type { Metadata } from "next";
import RootSlugView, { rootSlugMetadata, rootSlugStaticParams } from "@/views/rootSlug";

/**
 * /es/[slug] — SPA parity: the whole route tree is mounted under /es.
 *  - Short links (/es/wa, /es/ig, …) render the ES home + UTM tracker.
 *  - Landing pages are EN-only content → 301 to their EN canonical
 *    (the live site served them with canonical → EN; the 301 consolidates
 *    the same way without a Spanish-labeled English page).
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return rootSlugStaticParams("es");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return rootSlugMetadata(slug, "es");
}

export default async function RootSlugPageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RootSlugView slug={slug} language="es" />;
}
