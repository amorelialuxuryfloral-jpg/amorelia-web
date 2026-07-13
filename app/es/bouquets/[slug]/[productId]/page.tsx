import { notFound, redirect, permanentRedirect } from "next/navigation";
import { bouquetProducts } from "@/lib/catalogData";
import { handleFromSlug, slugEsForHandle, BOUQUET_SLUGS } from "@/lib/bouquetSlugs";
import { isMothersDayHandle } from "@/lib/mothersDayPromo";

/**
 * ES twin of the legacy two-segment ficha URLs (/es/bouquets/all/<handle>…).
 * Everything resolvable 301s to the clean native-ES slug; Mother's Day
 * seasonal fichas 307 to /es/mothers-day (dedicated PDP ships before the
 * next window); unknown segments are a REAL 404.
 */
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string; productId: string }> {
  return [];
}

export default async function LegacyBouquetRouteEs({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug, productId } = await params;

  if (slug === "mothers-day" && isMothersDayHandle(productId)) {
    redirect("/es/mothers-day");
  }

  const handle = handleFromSlug(productId);
  if (handle && BOUQUET_SLUGS[handle]) {
    permanentRedirect(`/es/bouquets/${slugEsForHandle(handle)}`);
  }

  const byHandle = bouquetProducts.find((b) => b.shopifyHandle === productId);
  if (byHandle) permanentRedirect(`/es/bouquets/${slugEsForHandle(byHandle.shopifyHandle)}`);

  const byId = bouquetProducts.find((b) => b.id === productId);
  if (byId) permanentRedirect(`/es/bouquets/${slugEsForHandle(byId.shopifyHandle)}`);

  notFound();
}
