/**
 * Mother's Day collection — server-side port of the SPA's mothersDayProducts.
 *
 * Source of truth: the Shopify collection with handle "mothers-day". A static
 * fallback of the 7 real products (mirrored from Shopify) guarantees the
 * collection page is NEVER empty — the products are typically unpublished
 * from the Storefront outside the promo window, and the "coming soon /
 * locked" page must still show the full line-up (SPEC: no thin pages).
 */
import { storefrontApiRequest } from "@/lib/shopify";
import type { BouquetProduct } from "@/lib/catalogData";
import { MOTHERS_DAY_COLLECTION_HANDLE } from "@/lib/mothersDayPromo";

export interface MothersDayProductRaw {
  id: string;
  handle: string;
  title: string;
  descriptionHtml: string;
  description: string;
  tags: string[];
  primaryImage?: string;
  secondaryImage?: string;
  minPrice: number;
  currencyCode: string;
}

const COLLECTION_QUERY = `
  query mothersDayCollection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      products(first: 30) {
        edges {
          node {
            id
            handle
            title
            description
            descriptionHtml
            tags
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 2) {
              edges { node { url altText } }
            }
          }
        }
      }
    }
  }
`;

/** Static fallback — real data mirrored from Shopify (7 Mother's Day editions). */
const CDN = "https://cdn.shopify.com/s/files/1/0979/1671/5140/files";
export const MOTHERS_DAY_STATIC: MothersDayProductRaw[] = [
  { id: "pure-white-mothers-day-edition", handle: "pure-white-mothers-day-edition", title: "Pure White - Mother's Day Edition", description: "White roses wrapped in white paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["white", "mothers-day"], primaryImage: `${CDN}/WHITE.png?v=1777753148`, minPrice: 163, currencyCode: "USD" },
  { id: "hot-pink-blush-mothers-day-edition", handle: "hot-pink-blush-mothers-day-edition", title: "Hot Pink Blush - Mother's Day Edition", description: "Hot pink roses wrapped in pink paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["hot-pink", "mothers-day"], primaryImage: `${CDN}/HOT_PINK.png?v=1777753251`, minPrice: 163, currencyCode: "USD" },
  { id: "soft-pink-mothers-day-edition", handle: "soft-pink-mothers-day-edition", title: "Soft Pink - Mother's Day Edition", description: "Pink roses wrapped in white paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["pink", "mothers-day"], primaryImage: `${CDN}/PINK.png?v=1777753140`, minPrice: 163, currencyCode: "USD" },
  { id: "purple-charm-mothers-day-edition", handle: "purple-charm-mothers-day-edition", title: "Purple Charm - Mother's Day Edition", description: "Purple roses wrapped in black paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["purple", "mothers-day"], primaryImage: `${CDN}/PURPLE.png?v=1777635187`, minPrice: 163, currencyCode: "USD" },
  { id: "orange-sunset-mothers-day-edition", handle: "orange-sunset-mothers-day-edition", title: "Orange Sunset - Mother's Day Edition", description: "Orange roses wrapped in black paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["orange", "mothers-day"], primaryImage: `${CDN}/NARANJA.png?v=1777635182`, minPrice: 163, currencyCode: "USD" },
  { id: "radiant-sun-mothers-day-edition", handle: "radiant-sun-mothers-day-edition", title: "Radiant Sun - Mother's Day Edition", description: "Yellow roses wrapped in beige paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["yellow", "mothers-day"], primaryImage: `${CDN}/YELOW.png?v=1777753148`, minPrice: 163, currencyCode: "USD" },
  { id: "total-passion-mothers-day-edition", handle: "total-passion-mothers-day-edition", title: "Total Passion - Mother's Day Edition", description: "Red roses wrapped in pink paper. Special Mother's Day Edition.", descriptionHtml: "", tags: ["red", "mothers-day"], primaryImage: `${CDN}/ROJO.png?v=1777635188`, minPrice: 163, currencyCode: "USD" },
];

/** Server fetch (ISR-cached via storefrontApiRequest). Never returns empty. */
export async function fetchMothersDayProducts(): Promise<MothersDayProductRaw[]> {
  try {
    const data = await storefrontApiRequest(
      COLLECTION_QUERY,
      { handle: MOTHERS_DAY_COLLECTION_HANDLE },
      { revalidate: 600 },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const edges: any[] = data?.data?.collection?.products?.edges ?? [];
    const items: MothersDayProductRaw[] = edges.map((edge) => {
      const n = edge.node;
      const imgs = n.images?.edges ?? [];
      return {
        id: n.id,
        handle: n.handle,
        title: n.title,
        description: n.description ?? "",
        descriptionHtml: n.descriptionHtml ?? "",
        tags: n.tags ?? [],
        primaryImage: imgs[0]?.node?.url,
        secondaryImage: imgs[1]?.node?.url,
        minPrice: parseFloat(n.priceRange?.minVariantPrice?.amount ?? "0"),
        currencyCode: n.priceRange?.minVariantPrice?.currencyCode ?? "USD",
      };
    });
    return items.length > 0 ? items : MOTHERS_DAY_STATIC;
  } catch (err) {
    console.error("[mothersDayProducts] fetch failed", err);
    return MOTHERS_DAY_STATIC;
  }
}

/** Map a raw Shopify Mother's Day product to a virtual BouquetProduct (SPA port). */
export function toVirtualBouquet(raw: MothersDayProductRaw): BouquetProduct {
  const colorTagToName: Record<string, string> = {
    white: "Blanco",
    pink: "Rosa",
    "hot-pink": "Rosa fuerte",
    purple: "Morado",
    orange: "Naranja",
    yellow: "Amarillo",
    red: "Rojo",
  };
  const colorTag = raw.tags.find((t) => colorTagToName[t]);
  const color = colorTag ? colorTagToName[colorTag] : "";

  return {
    id: raw.handle,
    name: raw.title,
    shopifyHandle: raw.handle,
    description: raw.description,
    image: raw.primaryImage ?? "",
    image2: raw.secondaryImage,
    color,
    type: "round",
    // Pricing tier is irrelevant — Mother's Day variants/prices come live from Shopify.
    pricingTier: "standard",
  };
}
