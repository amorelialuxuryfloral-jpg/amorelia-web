import { storefrontApiRequest } from "@/lib/shopify";

/**
 * Shipping Protection add-on — 15% of the order value, in $100 brackets.
 *
 * Rule (Carlos): $15 for every $100 of the cart's PRODUCTS + EXTRAS total
 * (item.price × qty — NO delivery/service fee). Implemented as ONE Shopify
 * product "Shipping Protection" with 35 VARIANTS (option "Order value"), one
 * per $100 bracket up to $3500 → $525. The web picks the variant that matches
 * the cart total and adds it with QUANTITY 1, so the Shopify checkout shows a
 * clean single line ("Shipping Protection · $0-$100 · $45", quantity 1) with a
 * logical label (the order-value bracket) — no "×N".
 *
 *   ≤ $100 → $15 · ≤ $200 → $30 · … · ≤ $3500 → $525 · over $3500 stays $525.
 *
 * Prices are read LIVE from Shopify by variant GID so they auto-update from
 * admin. NADA INVENTADO — fallback amounts mirror the current Shopify prices.
 */

export const SHIPPING_PROTECTION_PRODUCT_GID =
  "gid://shopify/Product/10397736337540";

// Numeric variant IDs, ascending by $100 bracket ($0-100 … $3400-3500).
const VARIANT_NUMERIC_IDS = [
  "52509058662532", "52509058695300", "52509058728068", "52509058760836",
  "52509058793604", "52509058826372", "52509058859140", "52509058891908",
  "52509058924676", "52509058957444", "52509058990212", "52509059022980",
  "52509059055748", "52509059088516", "52509059121284", "52509059154052",
  "52509059186820", "52509059219588", "52509059252356", "52509059285124",
  "52509059317892", "52509059350660", "52509059383428", "52509059416196",
  "52509059448964", "52509059481732", "52509059514500", "52509059547268",
  "52509059580036", "52509059612804", "52509059645572", "52509059678340",
  "52509059711108", "52509059743876", "52509059776644",
];
const VARIANT_GIDS = VARIANT_NUMERIC_IDS.map(
  (id) => `gid://shopify/ProductVariant/${id}`,
);

// Tier-1 kept as the canonical export for any legacy reference / fallback.
export const SHIPPING_PROTECTION_VARIANT_GID = VARIANT_GIDS[0];
export const SHIPPING_PROTECTION_VARIANT_NUMERIC_ID = VARIANT_NUMERIC_IDS[0];

/**
 * Tier table (ascending). Bracket n (1-indexed) covers order totals up to
 * n×$100 and costs n×$15. The last bracket ($3400-$3500 = $525) uses Infinity
 * so anything over $3500 still gets $525. Generated from the variant list.
 */
export const SHIPPING_PROTECTION_TIER_CONFIG = VARIANT_GIDS.map((variantGid, i) => ({
  maxTotal: i === VARIANT_GIDS.length - 1 ? Infinity : (i + 1) * 100,
  variantGid,
  fallbackAmount: (i + 1) * 15,
}));

const QUERY = `
  query ShippingProtection($id: ID!) {
    product(id: $id) {
      id
      featuredImage { url altText }
      variants(first: 40) {
        edges { node { id price { amount currencyCode } } }
      }
    }
  }
`;

export interface ShippingProtectionTier {
  /** Inclusive upper bound of the product+extras total this tier covers (Infinity for the top tier). */
  maxTotal: number;
  amount: number;
  variantGid: string;
}

export interface ShippingProtectionInfo {
  imageUrl: string | null;
  imageAlt: string | null;
  currencyCode: string;
  available: boolean;
  /** Live price + variant per bracket, in threshold order. */
  tiers: ShippingProtectionTier[];
}

export interface ShippingProtectionCharge {
  /** Total protection charge for this cart. */
  amount: number;
  /** Quantity to add at checkout — always 1 (the price lives in the variant). */
  quantity: number;
  variantGid: string;
}

let cached: ShippingProtectionInfo | null = null;
let inflight: Promise<ShippingProtectionInfo | null> | null = null;

function buildFallbackTiers(): ShippingProtectionTier[] {
  return SHIPPING_PROTECTION_TIER_CONFIG.map((t) => ({
    maxTotal: t.maxTotal,
    amount: t.fallbackAmount,
    variantGid: t.variantGid,
  }));
}

/**
 * Pick the bracket (and its variant, quantity 1) that applies to a given cart
 * total (products + extras): $15 per $100, capped at the top bracket ($525).
 */
export function computeShippingProtection(
  info: Pick<ShippingProtectionInfo, "tiers">,
  total: number,
): ShippingProtectionCharge {
  const tiers = info.tiers.length ? info.tiers : buildFallbackTiers();
  const tier = tiers.find((t) => total <= t.maxTotal) ?? tiers[tiers.length - 1];
  return { amount: tier.amount, quantity: 1, variantGid: tier.variantGid };
}

export async function getShippingProtectionInfo(): Promise<ShippingProtectionInfo | null> {
  if (cached) return cached;
  if (inflight) return inflight;

  inflight = storefrontApiRequest(QUERY, { id: SHIPPING_PROTECTION_PRODUCT_GID })
    .then((data) => {
      const product = data?.data?.product;
      if (!product) {
        inflight = null;
        return null;
      }
      const featured = product.featuredImage ?? null;
      const priceByGid = new Map<string, number>();
      let currencyCode = "USD";
      for (const edge of product.variants?.edges ?? []) {
        const node = edge?.node;
        if (node?.id && node.price?.amount) {
          priceByGid.set(node.id, parseFloat(node.price.amount));
          if (node.price.currencyCode) currencyCode = node.price.currencyCode;
        }
      }
      const tiers: ShippingProtectionTier[] = SHIPPING_PROTECTION_TIER_CONFIG.map((t) => ({
        maxTotal: t.maxTotal,
        amount: priceByGid.get(t.variantGid) ?? t.fallbackAmount,
        variantGid: t.variantGid,
      }));
      const info: ShippingProtectionInfo = {
        imageUrl: featured?.url ?? null,
        imageAlt: featured?.altText ?? "Shipping Protection",
        currencyCode,
        available: priceByGid.size > 0,
        tiers,
      };
      cached = info;
      inflight = null;
      return info;
    })
    .catch((err) => {
      inflight = null;
      console.warn("[shippingProtection] fetch failed", err);
      return null;
    });

  return inflight;
}

export function getShippingProtectionFallback(): ShippingProtectionInfo {
  return {
    imageUrl: null,
    imageAlt: "Shipping Protection",
    currencyCode: "USD",
    available: false,
    tiers: buildFallbackTiers(),
  };
}
