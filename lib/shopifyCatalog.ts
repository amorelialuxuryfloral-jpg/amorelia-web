/**
 * Server-side catalog summaries — live min price + card images for EVERY
 * product in one paginated Storefront query, cached with `revalidate`.
 *
 * Replaces the SPA's per-card client fetches (<ShopifyPrice/> +
 * <BouquetCardImage/>): collection grids server-render the live price and the
 * hover-swap image directly in the HTML.
 */
import { storefrontApiRequest } from "@/lib/shopify";

const CATALOG_QUERY = `
  query catalogSummaries($cursor: String) {
    products(first: 100, after: $cursor) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          handle
          title
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 6) { edges { node { url } } }
        }
      }
    }
  }
`;

export interface CatalogSummary {
  handle: string;
  title: string;
  minPrice: number;
  /** Up to 6 image URLs (SPA hover-swap rule: image 6 if 6+, else last). */
  images: string[];
}

export type CatalogSummaryMap = Map<string, CatalogSummary>;

export async function fetchCatalogSummaries(): Promise<CatalogSummaryMap> {
  const map: CatalogSummaryMap = new Map();
  try {
    let cursor: string | null = null;
    // Safety cap: 3 pages (300 products) — catalog is ~60 today.
    for (let page = 0; page < 3; page++) {
      const data = await storefrontApiRequest(CATALOG_QUERY, { cursor }, { revalidate: 600 });
      const conn = data?.data?.products;
      const edges = conn?.edges ?? [];
      for (const edge of edges) {
        const n = edge.node;
        map.set(n.handle, {
          handle: n.handle,
          title: n.title,
          minPrice: parseFloat(n.priceRange?.minVariantPrice?.amount ?? "0") || 0,
          images: (n.images?.edges ?? [])
            .map((e: { node?: { url?: string } }) => e?.node?.url)
            .filter(Boolean),
        });
      }
      if (!conn?.pageInfo?.hasNextPage) break;
      cursor = conn.pageInfo.endCursor;
    }
  } catch (error) {
    console.error("[shopifyCatalog] fetchCatalogSummaries failed:", error);
  }
  return map;
}

/** SPA hover-swap rule (BouquetCardImage): photo 6 when 6+ images, else last. */
export function hoverImageFor(summary: CatalogSummary | undefined): string | undefined {
  if (!summary) return undefined;
  const all = summary.images;
  const idx = all.length >= 6 ? 5 : all.length - 1;
  return idx > 0 ? all[idx] : undefined;
}

/** Pin a Shopify CDN image to a card-friendly width (same trick as the SPA). */
export function cardSized(url: string | undefined, width = 600): string | undefined {
  if (!url) return undefined;
  if (!url.includes("cdn.shopify.com")) return url;
  return url.includes("?") ? `${url}&width=${width}` : `${url}?width=${width}`;
}
