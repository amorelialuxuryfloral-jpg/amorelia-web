import type { Metadata } from "next";
import RootSlugView, { rootSlugMetadata, rootSlugStaticParams } from "@/views/rootSlug";

/**
 * /[slug] — short attribution links + the EN-only landing pages
 * (8 barrios + hub + 2 niche landings). See views/rootSlug.tsx.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return rootSlugStaticParams("en");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return rootSlugMetadata(slug, "en");
}

export default async function RootSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <RootSlugView slug={slug} language="en" />;
}
