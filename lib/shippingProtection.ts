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

// Amorelia "Shipping Protection" (clon de Charls, creado vía Admin 2026-07-14).
export const SHIPPING_PROTECTION_PRODUCT_GID =
  "gid://shopify/Product/9395579781338";

// Numeric variant IDs, ascending by $100 bracket ($0-100 … $3400-3500).
const VARIANT_NUMERIC_IDS = [
  "48217326125274", "48217326158042", "48217326190810", "48217326223578",
  "48217326256346", "48217326289114", "48217326321882", "48217326354650",
  "48217326387418", "48217326420186", "48217326452954", "48217326485722",
  "48217326518490", "48217326551258", "48217326584026", "48217326616794",
  "48217326649562", "48217326682330", "48217326715098", "48217326747866",
  "48217326780634", "48217326813402", "48217326846170", "48217326878938",
  "48217326911706", "48217326944474", "48217326977242", "48217327010010",
  "48217327042778", "48217327075546", "48217327108314", "48217327141082",
  "48217327173850", "48217327206618", "48217327239386",
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
