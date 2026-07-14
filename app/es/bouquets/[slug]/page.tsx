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
  h1EsForHandle,
  isZodiacBouquetHandle,
} from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS, collectionFromSegment } from "@/lib/colorCollections";
import { seoData } from "@/lib/seoData";
import { fetchProductPageData, type ProductPageData } from "@/lib/shopifyProduct";
import { fetchCatalogSummaries } from "@/lib/shopifyCatalog";
import { buildMetadata, productSeoTitle } from "@/lib/seo";
import { getTranslator } from "@/i18n";

/**
 * /es/bouquets/[slug] — ES twin of the EN unified resolver (SPA parity: the
 * whole route tree is mounted under /es with NATIVE Spanish slugs):
 *   1. Clean subcategory slugs (single-color / mixed-color / zodiac / bicolor
 *      — same segment in both languages) → collection view in Spanish.
 *   2. Native ES color slugs (rosas-rojas, …) → color collection view.
 *      An EN color slug under /es 301s to the native ES slug.
 *   3. The 48 native ES product slugs → PDP (live Shopify data with the ES
 *      metafield cascade: seo_title_es → EN native → seoData → fallback ES).
 *   4. Legacy segments (EN slugs, raw Shopify handles, bq-* ids) → 301 to the
 *      clean ES slug.
 *   5. Anything else → REAL 404.
 */

export const revalidate = 300;
export const dynamicParams = true;

const SUBCATEGORY_SLUGS = ["single-color", "mixed-color", "zodiac", "bicolor"];

export function generateStaticParams() {
  return [
    ...SUBCATEGORY_SLUGS.map((slug) => ({ slug })),
    ...COLOR_COLLECTIONS.map((c) => ({ slug: c.slugEs })),
    ...Object.values(BOUQUET_SLUGS).map((m) => ({ slug: m.slugEs })),
  ];
}

type Resolution =
  | { kind: "subcategory"; filter: NonNullable<ReturnType<typeof filterForSlug>> }
  | { kind: "color"; color: (typeof COLOR_COLLECTIONS)[number] }
  | { kind: "product"; product: BouquetProduct }
  | { kind: "redirect"; to: string }
  | { kind: "notFound" };

function resolveSlugEs(slug: string): Resolution {
  const filter = filterForSlug(slug);
  if (filter) return { kind: "subcategory", filter };

  const colorColl = COLOR_COLLECTIONS.find((c) => c.slugEs === slug);
  if (colorColl) return { kind: "color", color: colorColl };
  // EN color slug under the ES tree → 301 to the native ES collection.
  const colorEn = COLOR_COLLECTIONS.find((c) => c.slug === slug);
  if (colorEn) return { kind: "redirect", to: `/es/bouquets/${colorEn.slugEs}` };

  const handle = handleFromSlug(slug);
  if (handle) {
    const m = BOUQUET_SLUGS[handle];
    // Clean native ES slug → render in place. EN slug under /es → 301 to ES.
    if (m && m.slugEs === slug) {
      const product = bouquetProducts.find((b) => b.shopifyHandle === handle);
      if (product) return { kind: "product", product };
    }
    return { kind: "redirect", to: `/es/bouquets/${slugEsForHandle(handle)}` };
  }

  // Raw Shopify handle used directly (old links / ads) → 301 to the ES slug.
  const byHandle = bouquetProducts.find((b) => b.shopifyHandle === slug);
  if (byHandle) return { kind: "redirect", to: `/es/bouquets/${slugEsForHandle(byHandle.shopifyHandle)}` };

  // Legacy internal id (bq-*) → 301 to the ES slug.
  if (slug.startsWith("bq-")) {
    const byId = bouquetProducts.find((b) => b.id === slug);
    if (byId) return { kind: "redirect", to: `/es/bouquets/${slugEsForHandle(byId.shopifyHandle)}` };
  }

  return { kind: "notFound" };
}

// ── PDP helpers (SPA logic 1:1, ES cascade) ─────────────────────────────

function productSeoPiecesEs(product: BouquetProduct, data: ProductPageData | null) {
  const handle = product.shopifyHandle;
  const seo = seoData[handle];
  const keywordH1Raw = h1EsForHandle(handle);
  const productKeywordEn = h1ForHandle(handle) || `${product.name} Bouquet`;
  const productKeywordEs = keywordH1Raw || `Ramo ${product.name}`;
  const isInSlugMap = Boolean(BOUQUET_SLUGS[handle]);

  // FÓRMULA DE H1 — decisión de Romuald (jul 2026), versión ES:
  //   H1 = "[keyword transaccional ES] en Miami" (ej. "Ramo de Rosas Rojas
  //   en Miami"), sin capitalizar artículos. SIN rango "50 a 200" (pasa a
  //   subtítulo-beneficio bajo el H1, desde las variantes REALES), SIN el
  //   nombre comercial (va en el lead de la descripción).
  // Amorelia: el H1 visible es SOLO el nombre del producto (sin "Bouquet"/"Miami").
  void isInSlugMap; void keywordH1Raw;
  const headingH1 = product.name;

  // FÓRMULA DE TITLE — Romuald: "[keyword] Miami – Entrega el Mismo Día |
  // Amorelia Luxury Floral Gifts" con el plan B de recorte (lib/seo.ts). La fórmula manda
  // sobre los titles antiguos de metafields/seoData.
  const resolvedSeoTitle = keywordH1Raw
    ? productSeoTitle(keywordH1Raw, "es")
    : `${product.name} Miami | Amorelia Luxury Floral Gifts`;
  const resolvedSeoDescription =
    data?.seoDescriptionEs || data?.seoDescription || seo?.seoDescription || product.description;
  const rawDescription =
    data?.descriptionEs || product.descriptionEs || data?.description || product.description;
  // CORRECCIONES punto 11 — efecto espejo: la PRIMERA frase visible abre con
  // la keyword transaccional. El nombre comercial ("Total Passion") vive AQUÍ
  // en el lead — fuera del H1/title (Romuald: 0 volumen de marca).
  // Solo hechos validados: taller de Miami, mismo día antes de las 3PM.
  const resolvedDescription =
    keywordH1Raw && !rawDescription.trim().toLowerCase().startsWith(keywordH1Raw.toLowerCase())
      ? `${keywordH1Raw} — nuestro diseño "${product.name}" — montado a mano por encargo en nuestro taller de Miami, con entrega el mismo día si pides antes de las 3PM.\n${rawDescription}`
      : rawDescription;

  return { headingH1, productKeywordEn, productKeywordEs, resolvedSeoTitle, resolvedSeoDescription, resolvedDescription };
}

function productSchemaPrice(product: BouquetProduct, data: ProductPageData | null): number {
  const livePrices = (data?.variants ?? [])
    .map((v) => (v.price?.amount ? parseFloat(v.price.amount) : NaN))
    .filter((n) => !isNaN(n) && n > 0);
  if (livePrices.length > 0) return Math.min(...livePrices);
  return catalogFallbackPrice(product);
}

// ── Metadata ────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { t } = getTranslator("es");
  const res = resolveSlugEs(slug);

  if (res.kind === "subcategory") {
    const sub = SEO_BY_FILTER[res.filter as Exclude<typeof res.filter, "all">];
    const meta = buildMetadata({
      title: t(`${sub.ns}.title`),
      description: t(`${sub.ns}.description`),
      path: sub.path,
      language: "es",
    });
    // Zodiac hub (ES twin): live but noindex,follow (plan §1).
    return res.filter === "zodiac" ? { ...meta, robots: { index: false, follow: true } } : meta;
  }
  if (res.kind === "color") {
    return buildMetadata({
      title: t(`${res.color.ns}.title`),
      description: t(`${res.color.ns}.description`),
      path: `/bouquets/${res.color.slug}`,
      pathEs: `/bouquets/${res.color.slugEs}`,
      language: "es",
    });
  }
  if (res.kind === "product") {
    const data = await fetchProductPageData(res.product.shopifyHandle);
    const pieces = productSeoPiecesEs(res.product, data);
    const primaryImage = data?.images[0] || res.product.image;
    const meta = buildMetadata({
      title: pieces.resolvedSeoTitle,
      description: pieces.resolvedSeoDescription,
      path: `/bouquets/${slugForHandle(res.product.shopifyHandle)}`,
      pathEs: `/bouquets/${slugEsForHandle(res.product.shopifyHandle)}`,
      language: "es",
      image: primaryImage,
    });
    // The 12 zodiac fichas (ES twins): live but noindex,follow (plan §1).
    return isZodiacBouquetHandle(res.product.shopifyHandle)
      ? { ...meta, robots: { index: false, follow: true } }
      : meta;
  }
  return { robots: { index: false, follow: false } };
}

// ── Page ────────────────────────────────────────────────────────────────

export default async function BouquetSlugPageEs({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = resolveSlugEs(slug);

  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();

  if (res.kind === "subcategory") {
    return <BouquetCollectionView filter={res.filter} language="es" />;
  }
  if (res.kind === "color") {
    const coll = collectionFromSegment(res.color.slugEs)!;
    return <BouquetCollectionView colorCollection={coll.color} language="es" />;
  }

  // ── Product detail page (ES) ──
  const product = res.product;
  const [data, summaries] = await Promise.all([
    fetchProductPageData(product.shopifyHandle),
    fetchCatalogSummaries(),
  ]);
  const pieces = productSeoPiecesEs(product, data);
  const primaryImage = data?.images[0] || product.image;
  const seoSlugEs = slugEsForHandle(product.shopifyHandle);
  const schemaPrice = productSchemaPrice(product, data);
  const { t } = getTranslator("es");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <JsonLd
        data={[
          // Product schema ALWAYS with offers (real price + availability + USD) — SPEC §2.3.
          productSchema(pieces.productKeywordEs, pieces.resolvedSeoDescription, schemaPrice, primaryImage, " en Miami"),
          breadcrumbSchema([
            { name: "Inicio", url: "https://amorelialuxuryfloral.com/es" },
            { name: "Ramos", url: "https://amorelialuxuryfloral.com/es/bouquets" },
            { name: `${pieces.productKeywordEs} en Miami`, url: `https://amorelialuxuryfloral.com/es/bouquets/${seoSlugEs}` },
          ]),
        ]}
      />
      <div className="pt-20 md:pt-28 pb-10">
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: t("nav.home"), to: "/es" },
              { label: t("nav.bouquets"), to: "/es/bouquets" },
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
            language="es"
          />

          {/* Cross-links — related products (above FAQs) */}
          <YouMightAlsoLove currentProductId={product.id} summaries={summaries} language="es" />

          {/* Transactional SEO block (TSR) — per-color buy/delivery intent. */}
          <ProductTransactionalSeo product={product} language="es" />

          {/* Closing Google-reviews summary (aggregate + CID link — the FAQ
              accordion now lives inside ProductDetailClient). */}
          <GoogleReviewsSummary language="es" />
        </div>
      </div>
    </div>
  );
}
