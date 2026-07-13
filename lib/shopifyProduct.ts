/**
 * Server-side product page data — ONE Storefront call per handle, cached with
 * `revalidate` so the PDP ships live price/images/description in the server
 * HTML (no client fetch, no hydration flash, Product schema `offers` always
 * carries a real price — SPEC §2.3).
 *
 * Mirrors the SPA's three client hooks (useShopifyProductImages,
 * useShopifyProductDescription, fetchVariantsByHandle) in a single query.
 */
import { storefrontApiRequest } from "@/lib/shopify";
import type { ShopifyHandleVariant } from "@/lib/shopifyVariants";

const PRODUCT_PAGE_QUERY = `
  query productPage($handle: String!) {
    productByHandle(handle: $handle) {
      description
      seo { title description }
      descriptionEs: metafield(namespace: "custom", key: "description_es") { value }
      seoTitleEs: metafield(namespace: "custom", key: "seo_title_es") { value }
      seoDescriptionEs: metafield(namespace: "custom", key: "seo_description_es") { value }
      paperColor: metafield(namespace: "custom", key: "paper_color") { value }
      images(first: 10) { edges { node { url } } }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

export interface ProductPageData {
  images: string[];
  variants: ShopifyHandleVariant[];
  description?: string;
  descriptionEs?: string;
  seoTitle?: string;
  seoTitleEs?: string;
  seoDescription?: string;
  seoDescriptionEs?: string;
  paperColor?: string;
}

export async function fetchProductPageData(handle: string): Promise<ProductPageData | null> {
  if (!handle) return null;
  try {
    const data = await storefrontApiRequest(PRODUCT_PAGE_QUERY, { handle }, { revalidate: 300 });
    const p = data?.data?.productByHandle;
    if (!p) return null;
    const images: string[] = (p.images?.edges ?? [])
      .map((e: { node?: { url?: string } }) => e?.node?.url)
      .filter(Boolean);
    const variants: ShopifyHandleVariant[] = (p.variants?.edges ?? []).map(
      (e: { node: ShopifyHandleVariant }) => e.node,
    );
    return {
      images,
      variants,
      description: p.description || undefined,
      seoTitle: p.seo?.title || undefined,
      seoDescription: p.seo?.description || undefined,
      descriptionEs: p.descriptionEs?.value || undefined,
      seoTitleEs: p.seoTitleEs?.value || undefined,
      seoDescriptionEs: p.seoDescriptionEs?.value || undefined,
      paperColor: p.paperColor?.value || undefined,
    };
  } catch (error) {
    console.error(`[shopifyProduct] fetchProductPageData(${handle}) failed:`, error);
    return null;
  }
}
