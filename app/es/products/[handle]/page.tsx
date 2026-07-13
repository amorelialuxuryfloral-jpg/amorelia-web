import { redirect, permanentRedirect } from "next/navigation";
import { bouquetProducts } from "@/lib/catalogData";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { slugEsForHandle } from "@/lib/bouquetSlugs";

/**
 * /es/products/<handle> — Shopify-style URLs under the ES tree (ads/backlinks).
 * Bouquets 301 to the native ES keyword slug; room decors to their package
 * page; unknown handles fall back to the ES bouquets listing (SPA parity).
 */
export const dynamicParams = true;

export function generateStaticParams(): Array<{ handle: string }> {
  return [];
}

export default async function ShopifyProductRedirectEs({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!handle) redirect("/es");

  const roomDecor = roomDecorPackages.find((p) => p.shopifyHandle === handle);
  if (roomDecor) permanentRedirect(`/es/room-decors/${roomDecor.id}`);

  const bouquet = bouquetProducts.find((p) => p.shopifyHandle === handle);
  if (bouquet) permanentRedirect(`/es/bouquets/${slugEsForHandle(bouquet.shopifyHandle)}`);

  redirect("/es/bouquets");
}
