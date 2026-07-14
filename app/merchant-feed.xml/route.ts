/**
 * Google Merchant Center product feed (RSS 2.0 / Google Shopping format).
 *
 * Served at /merchant-feed.xml. Amorelia is HEADLESS: this feed points each
 * product's `link` to its Netlify ficha (amorelialuxuryfloral.com/bouquets/…)
 * — NOT the Shopify store — and pulls the live price + first image from Shopify
 * (fetchCatalogSummaries). Submit this URL in Merchant Center → "Add products
 * from a file" (scheduled fetch) → it auto-updates when prices/photos change.
 *
 * Products with no image are skipped (Merchant Center requires image_link).
 */
import { bouquetProducts, type BouquetProduct } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { fetchCatalogSummaries } from "@/lib/shopifyCatalog";
import { getPrice } from "@/lib/productData";

export const revalidate = 3600;

const BASE = "https://amorelialuxuryfloral.com";
const BRAND = "Amorelia Luxury Floral Gifts";

const xmlEscape = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const cleanDesc = (s: string): string =>
  s.replace(/\s*\n\s*/g, " ").replace(/\s+/g, " ").trim().slice(0, 4900);

// Catalog fallback price (same logic as the collection grid) — only used if the
// live Shopify min price is unavailable for a product.
const fallbackPrice = (p: BouquetProduct): number =>
  p.customSizes?.length
    ? p.customSizes[0].price
    : getPrice(
        p.pricingTier,
        p.pricingTier === "mix3red" || (p.color.includes(",") && p.pricingTier === "standard") ? 75 : 50,
      );

export async function GET() {
  const summaries = await fetchCatalogSummaries();

  const items: string[] = [];
  for (const p of bouquetProducts) {
    const s = summaries.get(p.shopifyHandle);
    const image = s?.images?.[0];
    if (!image) continue; // Merchant Center requires an image.
    const price = s?.minPrice && s.minPrice > 0 ? s.minPrice : fallbackPrice(p);
    if (!price || price <= 0) continue;
    const link = `${BASE}/bouquets/${slugForHandle(p.shopifyHandle)}`;
    items.push(
      `  <item>
    <g:id>${xmlEscape(p.shopifyHandle)}</g:id>
    <title>${xmlEscape(p.name)}</title>
    <description>${xmlEscape(cleanDesc(p.description))}</description>
    <link>${xmlEscape(link)}</link>
    <g:image_link>${xmlEscape(image)}</g:image_link>
    <g:availability>in_stock</g:availability>
    <g:price>${price.toFixed(2)} USD</g:price>
    <g:brand>${xmlEscape(BRAND)}</g:brand>
    <g:condition>new</g:condition>
    <g:identifier_exists>no</g:identifier_exists>
    <g:google_product_category>Home &amp; Garden &gt; Decor &gt; Flowers</g:google_product_category>
    <g:product_type>${xmlEscape(`Bouquets > ${p.name}`)}</g:product_type>
  </item>`,
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
  <title>${xmlEscape(BRAND)}</title>
  <link>${BASE}</link>
  <description>Luxury rose bouquets, handcrafted in Miami — same-day delivery.</description>
${items.join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
