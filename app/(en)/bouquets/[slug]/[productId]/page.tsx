import { notFound, redirect, permanentRedirect } from "next/navigation";
import { bouquetProducts } from "@/lib/catalogData";
import { handleFromSlug, slugForHandle, BOUQUET_SLUGS } from "@/lib/bouquetSlugs";
import { isMothersDayHandle } from "@/lib/mothersDayPromo";

/**
 * Legacy two-segment ficha URLs (/bouquets/all/<handle>,
 * /bouquets/<type>/<productId>…) — kept indefinitely for backlinks + ads.
 * Everything resolvable 301s to the clean keyword-first slug; unknown
 * segments are a REAL 404 (SPEC §2.2).
 *
 * /bouquets/mothers-day/<handle> (seasonal virtual PDPs): the dedicated MD
 * PDP ships before the next purchase window opens (May 2027). Until then
 * those URLs 307 (temporary — the URL stays canonical for the future PDP)
 * to the year-round /mothers-day collection, so no ad/backlink 404s.
 */
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string; productId: string }> {
  return [];
}

export default async function LegacyBouquetRoute({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;

  // Mother's Day seasonal fichas → the year-round collection (temporary).
  if (slug === "mothers-day" && isMothersDayHandle(productId)) {
    redirect("/mothers-day");
  }

  const handle = handleFromSlug(productId);
  if (handle && BOUQUET_SLUGS[handle]) {
    permanentRedirect(`/bouquets/${slugForHandle(handle)}`);
  }

  const byHandle = bouquetProducts.find((b) => b.shopifyHandle === productId);
  if (byHandle) permanentRedirect(`/bouquets/${slugForHandle(byHandle.shopifyHandle)}`);

  const byId = bouquetProducts.find((b) => b.id === productId);
  if (byId) permanentRedirect(`/bouquets/${slugForHandle(byId.shopifyHandle)}`);

  notFound();
}
