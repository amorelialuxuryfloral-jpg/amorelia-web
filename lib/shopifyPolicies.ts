/**
 * Shop legal policies — fetched server-side from the Shopify Storefront API
 * (shop.<policyKey>). Port of the SPA's useShopifyPolicy hook: the body is
 * merchant-controlled HTML written in Shopify admin. Server-rendered here so
 * the legal text ships as real HTML (the SPA showed a spinner).
 */
import { storefrontApiRequest } from "@/lib/shopify";

export type ShopifyPolicyKey =
  | "shippingPolicy"
  | "refundPolicy"
  | "privacyPolicy"
  | "termsOfService"
  | "subscriptionPolicy";

export interface ShopPolicy {
  title: string;
  body: string; // HTML
  url?: string;
}

const QUERY = (key: ShopifyPolicyKey) => `
  query {
    shop {
      ${key} {
        title
        body
        url
      }
    }
  }
`;

export async function fetchShopPolicy(key: ShopifyPolicyKey): Promise<ShopPolicy | null> {
  try {
    const data = await storefrontApiRequest(QUERY(key), {}, { revalidate: 3600 });
    const node = data?.data?.shop?.[key];
    if (node && (node.body || node.title)) return node as ShopPolicy;
    return null;
  } catch (err) {
    console.error(`Could not fetch Shopify policy ${key}:`, err);
    return null;
  }
}
