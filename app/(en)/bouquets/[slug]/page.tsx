import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { productSchema, breadcrumbSchema } from "@/components/JsonLd";
import BouquetCollectionView, { SEO_BY_FILTER, filterForSlug, catalogFallbackPrice } from "@/components/BouquetCollectionView";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import YouMightAlsoLove from "@/components/YouMightAlsoLove";
import ProductTransactionalSeo from "@/components/ProductTransactionalSeo";
import GoogleReviewsSummary from "@/components/product/GoogleReviewsSummary";
import { bouquetProducts, type BouquetProduct } from "@/lib/catalogData";
import {
  BOUQUET_SLUGS,
  slugForHandle,
  slugEsForHandle,
  handleFromSlug,
  h1ForHandle,
  isZodiacBouquetHandle,
} from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS, collectionFromSegment } from "@/lib/colorCollections";
import { seoData } from "@/lib/seoData";
import { fetchProductPageData, type ProductPageData } from "@/lib/shopifyProduct";
import { fetchCatalogSummaries } from "@/lib/shopifyCatalog";
import { buildMetadata, productSeoTitle } from "@/lib/seo";
import { getTranslator } from "@/i18n";

/**
 * /bouquets/[slug] — unified resolver, port of the SPA's BouquetSlugResolver:
 *   1. Clean subcategory slugs (single-color / mixed-color / zodiac / bicolor)
 *      → collection view.
 *   2. Indexable color-collection slugs (red-roses, …) → color collection view.
 *      SPEC §3: the COLLECTION owns "<color> roses"; the ficha owns
 *      "<color> roses bouquet".
 *   3. The 48 keyword-first product slugs → PDP (live Shopify data, Product
 *      schema ALWAYS with a real-price offer).
 *   4. Legacy segments (raw Shopify handles, bq-* ids, ES slugs) → 301 to the
 *      clean EN slug.
 *   5. Anything else → REAL 404 (SPEC §2.2 — no soft-404).
 */

export const revalidate = 300;
// Legacy handles / ids must resolve at runtime (301) — keep dynamic params on.
export const dynamicParams = true;

const SUBCATEGORY_SLUGS = ["single-color", "mixed-color", "zodiac", "bicolor"];

export function generateStaticParams() {
  return [
    ...SUBCATEGORY_SLUGS.map((slug) => ({ slug })),
    ...COLOR_COLLECTIONS.map((c) => ({ slug: c.slug })),
    ...Object.values(BOUQUET_SLUGS).map((m) => ({ slug: m.slug })),
  ];
}

type Resolution =
  | { kind: "subcategory"; filter: NonNullable<ReturnType<typeof filterForSlug>> }
  | { kind: "color"; color: (typeof COLOR_COLLECTIONS)[number] }
  | { kind: "product"; product: BouquetProduct }
  | { kind: "redirect"; to: string }
  | { kind: "notFound" };

function resolveSlug(slug: string): Resolution {
  const filter = filterForSlug(slug);
  if (filter) return { kind: "subcategory", filter };

  const colorColl = COLOR_COLLECTIONS.find((c) => c.slug === slug);
  if (colorColl) return { kind: "color", color: colorColl };
  // Native ES color slug under the EN tree → 301 to the EN collection.
  const colorEs = COLOR_COLLECTIONS.find((c) => c.slugEs === slug);
  if (colorEs) return { kind: "redirect", to: `/bouquets/${colorEs.slug}` };

  const handle = handleFromSlug(slug);
  if (handle) {
    const m = BOUQUET_SLUGS[handle];
    // Clean EN SEO slug → render in place. ES slug under EN tree → 301 to EN.
    if (m && m.slug === slug) {
      const product = bouquetProducts.find((b) => b.shopifyHandle === handle);
      if (product) return { kind: "product", product };
    }
    return { kind: "redirect", to: `/bouquets/${slugForHandle(handle)}` };
  }

  // Raw Shopify handle used directly (old links / ads) → 301 to clean slug.
  const byHandle = bouquetProducts.find((b) => b.shopifyHandle === slug);
  if (byHandle) return { kind: "redirect", to: `/bouquets/${slugForHandle(byHandle.shopifyHandle)}` };

  // Legacy internal id (bq-*) → 301 to clean slug.
  if (slug.startsWith("bq-")) {
    const byId = bouquetProducts.find((b) => b.id === slug);
    if (byId) return { kind: "redirect", to: `/bouquets/${slugForHandle(byId.shopifyHandle)}` };
  }

  return { kind: "notFound" };
}

// ── PDP helpers (SPA logic 1:1, EN) ─────────────────────────────────────

function productSeoPieces(product: BouquetProduct, data: ProductPageData | null) {
  const handle = product.shopifyHandle;
  const seo = seoData[handle];
  const keywordH1Raw = h1ForHandle(handle);
  const productKeywordEn = keywordH1Raw || `${product.name} Bouquet`;
  const isInSlugMap = Boolean(BOUQUET_SLUGS[handle]);

  // FÓRMULA DE H1 — decisión de Romuald (jul 2026):
  //   H1 = "[keyword transaccional] in Miami" — short, keyword first,
  //   "in Miami" last. NO "50 to 200 roses" range (that becomes the benefit
  //   subtitle under the H1, rendered by ProductDetailClient from the REAL
  //   variants), NO commercial name ("Total Passion" lives in the lead
  //   paragraph), NO duplicated "Roses".
  // Amorelia: el H1 visible es SOLO el nombre del producto (sin "Bouquet"/"Miami").
  void isInSlugMap; void keywordH1Raw;
  const headingH1 = product.name;

  // FÓRMULA DE TITLE — Romuald: "[keyword] Miami – Same-Day Delivery |
  // Amorelia Luxury Floral Gifts", máx ~60 chars with the drop-brand-then-same-day plan B
  // (lib/seo.ts). The formula OVERRIDES the old metafield/seoData titles.
  const resolvedSeoTitle = keywordH1Raw
    ? productSeoTitle(keywordH1Raw, "en")
    : `${product.name} Miami | Amorelia Luxury Floral Gifts`;
  const resolvedSeoDescription = data?.seoDescription || seo?.seoDescription || product.description;
  const rawDescription = data?.description || product.description;
  // CORRECCIONES punto 11 — mirror effect: the FIRST visible sentence opens
  // with the transactional keyword. The commercial name ("Total Passion",
  // "Green Fresh") lives HERE in the lead — out of the H1/title (Romuald:
  // 0 brand search volume). Validated facts only: Miami atelier, 3PM cutoff.
  const resolvedDescription =
    keywordH1Raw && !rawDescription.trim().toLowerCase().startsWith(keywordH1Raw.toLowerCase())
      ? `${keywordH1Raw} — our "${product.name}" design — hand-tied to order in our Miami atelier, with same-day delivery when you order before 3PM.\n${rawDescription}`
      : rawDescription;

  return { headingH1, productKeywordEn, resolvedSeoTitle, resolvedSeoDescription, resolvedDescription };
}

function productSchemaPrice(product: BouquetProduct, data: ProductPageData | null): number {
  // Live min variant price first (server-fetched, never 0-flash); catalog fallback.
  const livePrices = (data?.variants ?? [])
    .map((v) => (v.price?.amount ? parseFloat(v.price.amount) : NaN))
    .filter((n) => !isNaN(n) && n > 0);
  if (livePrices.length > 0) return Math.min(...livePrices);
  return catalogFallbackPrice(product);
}

// ── Metadata ────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { t } = getTranslator("en");
  const res = resolveSlug(slug);

  if (res.kind === "subcategory") {
    const sub = SEO_BY_FILTER[res.filter as Exclude<typeof res.filter, "all">];
    const meta = buildMetadata({
      title: t(`${sub.ns}.title`),
      description: t(`${sub.ns}.description`),
      path: sub.path,
    });
    // Zodiac hub: live but noindex,follow (plan §1 — out of index + sitemap).
    return res.filter === "zodiac" ? { ...meta, robots: { index: false, follow: true } } : meta;
  }
  if (res.kind === "color") {
    return buildMetadata({
      title: t(`${res.color.ns}.title`),
      description: t(`${res.color.ns}.description`),
      path: `/bouquets/${res.color.slug}`,
      pathEs: `/bouquets/${res.color.slugEs}`,
    });
  }
  if (res.kind === "product") {
    const data = await fetchProductPageData(res.product.shopifyHandle);
    const pieces = productSeoPieces(res.product, data);
    const primaryImage = data?.images[0] || res.product.image;
    const meta = buildMetadata({
      title: pieces.resolvedSeoTitle,
      description: pieces.resolvedSeoDescription,
      path: `/bouquets/${slugForHandle(res.product.shopifyHandle)}`,
      pathEs: `/bouquets/${slugEsForHandle(res.product.shopifyHandle)}`,
      image: primaryImage,
    });
    // The 12 zodiac fichas: live but noindex,follow (plan §1 — out of index + sitemap).
    return isZodiacBouquetHandle(res.product.shopifyHandle)
      ? { ...meta, robots: { index: false, follow: true } }
      : meta;
  }
  // Redirects/404 → minimal (the page function handles the response).
  return { robots: { index: false, follow: false } };
}

// ── Page ────────────────────────────────────────────────────────────────

export default async function BouquetSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = resolveSlug(slug);

  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();

  if (res.kind === "subcategory") {
    return <BouquetCollectionView filter={res.filter} language="en" />;
  }
  if (res.kind === "color") {
    const coll = collectionFromSegment(res.color.slug)!;
    return <BouquetCollectionView colorCollection={coll.color} language="en" />;
  }

  // ── Product detail page ──
  const product = res.product;
  const [data, summaries] = await Promise.all([
    fetchProductPageData(product.shopifyHandle),
    fetchCatalogSummaries(),
  ]);
  const pieces = productSeoPieces(product, data);
  const primaryImage = data?.images[0] || product.image;
  const seoSlugEn = slugForHandle(product.shopifyHandle);
  const schemaPrice = productSchemaPrice(product, data);
  const { t } = getTranslator("en");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <JsonLd
        data={[
          // Product schema ALWAYS with offers (real price + availability + USD) — SPEC §2.3.
          productSchema(pieces.productKeywordEn, pieces.resolvedSeoDescription, schemaPrice, primaryImage, " in Miami"),
          breadcrumbSchema([
            { name: "Home", url: "https://amorelialuxuryfloral.com" },
            { name: "Bouquets", url: "https://amorelialuxuryfloral.com/bouquets" },
            { name: `${pieces.productKeywordEn} in Miami`, url: `https://amorelialuxuryfloral.com/bouquets/${seoSlugEn}` },
          ]),
        ]}
      />
      <div className="pt-20 md:pt-28 pb-10">
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: t("nav.home"), to: "/" },
              { label: t("nav.bouquets"), to: "/bouquets" },
              { label: pieces.headingH1 },
            ]}
          />

          <ProductDetailClient
            product={product}
            initialVariants={data?.variants ?? []}
            initialImages={data?.images ?? []}
            resolvedDescription={pieces.resolvedDescription}
            headingH1={pieces.headingH1}
            productKeywordEn={pieces.productKeywordEn}
            language="en"
          />

          {/* Cross-links — related products (above FAQs) */}
          <YouMightAlsoLove currentProductId={product.id} summaries={summaries} language="en" />

          {/* Transactional SEO block (TSR) — per-color buy/delivery intent. */}
          <ProductTransactionalSeo product={product} language="en" />

          {/* Closing Google-reviews summary (aggregate + CID link — the FAQ
              accordion now lives inside ProductDetailClient). */}
          <GoogleReviewsSummary language="en" />
        </div>
      </div>
    </div>
  );
}
