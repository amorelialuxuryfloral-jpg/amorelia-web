import { redirect, permanentRedirect } from "next/navigation";
import { bouquetProducts } from "@/lib/catalogData";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { slugForHandle } from "@/lib/bouquetSlugs";

/**
 * Shopify-style URLs (/products/<handle>) coming from Meta/Instagram ads —
 * SPA port of ShopifyProductRedirect. Bouquets 301 to the keyword-first
 * ficha; room decors to their package page (room-decors ships in phase 3 but
 * the redirect target is already the canonical URL); unknown handles fall
 * back to the bouquets listing.
 */
export const dynamicParams = true;

export function generateStaticParams(): Array<{ handle: string }> {
  return [];
}

export default async function ShopifyProductRedirect({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!handle) redirect("/");

  const roomDecor = roomDecorPackages.find((p) => p.shopifyHandle === handle);
  if (roomDecor) permanentRedirect(`/room-decors/${roomDecor.id}`);

  const bouquet = bouquetProducts.find((p) => p.shopifyHandle === handle);
  if (bouquet) permanentRedirect(`/bouquets/${slugForHandle(bouquet.shopifyHandle)}`);

  redirect("/bouquets");
}
