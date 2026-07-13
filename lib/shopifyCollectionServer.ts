/**
 * Server-side fetcher for a Shopify collection by handle — port of the SPA's
 * lib/shopifyCollection.ts (client hook) as a cached server function. The
 * moment products are added to a collection in Shopify Admin they appear on
 * the site on the next revalidation.
 */
import { storefrontApiRequest } from "@/lib/shopify";
import { BOUQUET_SLUGS } from "@/lib/bouquetSlugs";

export interface CollectionProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  primaryImage?: string;
  secondaryImage?: string;
  minPrice: number;
  currencyCode: string;
}

const COLLECTION_QUERY = `
  query collectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 50) {
        edges {
          node {
            id
            handle
            title
            description
            tags
            priceRange { minVariantPrice { amount currencyCode } }
            images(first: 2) { edges { node { url altText } } }
          }
        }
      }
    }
  }
`;

export async function fetchCollectionProducts(handle: string): Promise<CollectionProduct[]> {
  if (!handle) return [];
  try {
    const data = await storefrontApiRequest(COLLECTION_QUERY, { handle }, { revalidate: 300 });
    const edges = data?.data?.collection?.products?.edges ?? [];
    return edges.map((edge: { node: Record<string, unknown> }) => {
      const n = edge.node as {
        id: string;
        handle: string;
        title: string;
        description?: string;
        tags?: string[];
        priceRange?: { minVariantPrice?: { amount?: string; currencyCode?: string } };
        images?: { edges?: Array<{ node?: { url?: string } }> };
      };
      const imgs = n.images?.edges ?? [];
      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        description: n.description ?? "",
        tags: n.tags ?? [],
        primaryImage: imgs[0]?.node?.url,
        secondaryImage: imgs[1]?.node?.url,
        minPrice: parseFloat(n.priceRange?.minVariantPrice?.amount ?? "0"),
        currencyCode: n.priceRange?.minVariantPrice?.currencyCode ?? "USD",
      } satisfies CollectionProduct;
    });
  } catch (err) {
    // Collection might not exist yet (handle not created in Shopify) — treat as empty.
    console.warn(`[shopifyCollectionServer] fetch failed for "${handle}":`, err);
    return [];
  }
}

/**
 * Canonical web URL for a product fetched from a collection (port of
 * productLinkForHandle): known bouquet handles → keyword-first PDP slug,
 * anything else → the /products/<handle> redirector.
 */
export function productLinkForHandle(handle: string, language: "en" | "es" = "en"): string {
  const mapping = BOUQUET_SLUGS[handle];
  if (mapping) {
    return language === "es" ? `/es/bouquets/${mapping.slugEs}` : `/bouquets/${mapping.slug}`;
  }
  return `/products/${handle}`;
}
