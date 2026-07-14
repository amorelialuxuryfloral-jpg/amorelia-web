import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import CollectionFAQ from "@/components/CollectionFAQ";
import { bouquetFAQsFor } from "@/lib/bouquetFaqs";
import ProductCard from "@/components/ProductCard";
import DynamicClusters from "@/components/DynamicClusters";
import { LongTailIntro, LongTailBody } from "@/components/LongTailSeoBlock";
import { bouquetProducts, type BouquetProduct } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { getPrice } from "@/lib/productData";
import { fetchCatalogSummaries, hoverImageFor } from "@/lib/shopifyCatalog";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";
import {
  COLOR_COLLECTIONS,
  collectionFromSegment,
  isBicolorProduct,
  productsForColor,
  type RoseColor,
} from "@/lib/colorCollections";
import { getTranslator, type Language } from "@/i18n";

/**
 * /bouquets collection page + subcategories + the 9 indexable color
 * collections — Server Component port of the SPA's BouquetProducts.
 *
 * SSR upgrades over the SPA (SPEC §2):
 *  - live Shopify prices + hover images fetched ON THE SERVER (one query) →
 *    they are in the HTML, ItemList offers always carry a real price;
 *  - all filter pills / color pills / product cards are real <a> links.
 * Headers per SPEC §3: the color COLLECTION owns "<color> roses" (H1 without
 * "Bouquet"); the flagship ficha owns "<color> roses bouquet".
 */

export type BouquetFilter = "all" | "un-color" | "mezclas" | "zodiac" | "bicolor";

const COLLECTION_PATHS: Record<BouquetFilter, string> = {
  all: "/bouquets",
  "un-color": "/bouquets/single-color",
  mezclas: "/bouquets/mixed-color",
  zodiac: "/bouquets/zodiac",
  bicolor: "/bouquets/bicolor",
};

/** Hex por color de rosa para las bolitas del filtro "Colors" (visual). */
const COLOR_SWATCH: Record<string, string> = {
  red: "#b81d24",
  white: "#ffffff",
  pink: "#e84c9a",
  yellow: "#f2c94c",
  black: "#1c1c1c",
  blue: "#2f6fed",
  purple: "#7c3aed",
  orange: "#ec7a1c",
  green: "#3f8f4f",
};

const isZodiac = (id: string) => id.startsWith('bq-zodiac-');

// Manual display orders by profitability, requested by store owner.
const ORDER_ALL: string[] = [
  'aries-bouquet', 'pisces-bouquet', 'cancer-bouquet', 'taurus-bouquet',
  'blue-sky', 'deep-night', 'green-fresh',
  'aquarius-bouquet', 'capricorn-bouquet', 'sagittarius-bouquet',
  'total-passion',
  'night-day', 'white-ocean', 'dark-pink-elegance',
  'dark-romance', 'bicolor-passion', 'passionate-love', 'elegant-passion', 'classic-tricolor', 'iberian-passion',
  'elegant-contrast', 'imperial-bee',
  'pink-symphony', 'fire-sun', 'tricolor-love', 'intense-romance',
  'scorpio-bouquet', 'libra-bouquet', 'virgo-bouquet', 'leo-bouquet', 'gemini-bouquet',
  'pure-white', 'hot-pink-blush', 'soft-pink', 'purple-charm', 'orange-sunset', 'radiant-sun',
  'red-sweetness', 'orange-citrus', 'infinite-tenderness', 'light-citrus', 'spring-garden',
  'pink-white-dawn', 'warm-sunset', 'magic-pastel', 'soft-spring', 'citrus-refresh',
];

const ORDER_ZODIAC: string[] = [
  'aries-bouquet', 'pisces-bouquet', 'cancer-bouquet', 'taurus-bouquet',
  'aquarius-bouquet', 'capricorn-bouquet', 'sagittarius-bouquet',
  'scorpio-bouquet', 'libra-bouquet', 'virgo-bouquet', 'leo-bouquet', 'gemini-bouquet',
];

const ORDER_SINGLE: string[] = [
  'blue-sky', 'deep-night', 'green-fresh', 'total-passion', 'iberian-passion',
  'pure-white', 'hot-pink-blush', 'soft-pink', 'purple-charm', 'orange-sunset',
  'radiant-sun', 'red-sweetness', 'orange-citrus', 'infinite-tenderness',
  'light-citrus', 'spring-garden',
];

const ORDER_MIXED: string[] = [
  'night-day', 'white-ocean', 'dark-pink-elegance', 'dark-romance',
  'bicolor-passion', 'passionate-love', 'elegant-passion', 'classic-tricolor',
  'elegant-contrast', 'imperial-bee', 'pink-symphony', 'fire-sun',
  'tricolor-love', 'intense-romance', 'pink-white-dawn', 'warm-sunset',
  'magic-pastel', 'soft-spring', 'citrus-refresh',
];

const sortByOrder = <T extends { shopifyHandle: string }>(items: T[], order: string[]): T[] => {
  const idx = (h: string) => {
    const i = order.indexOf(h);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...items].sort((a, b) => idx(a.shopifyHandle) - idx(b.shopifyHandle));
};

// SEO metadata per subcategory (same translation namespaces as the SPA).
export const SEO_BY_FILTER: Record<Exclude<BouquetFilter, "all">, { ns: string; path: string }> = {
  "un-color": { ns: "seo.bouquetsSingleColor", path: "/bouquets/single-color" },
  "mezclas":  { ns: "seo.bouquetsMixed",       path: "/bouquets/mixed-color" },
  "zodiac":   { ns: "seo.bouquetsZodiac",      path: "/bouquets/zodiac" },
  "bicolor":  { ns: "seo.bouquetsBicolor",     path: "/bouquets/bicolor" },
};

export const filterForSlug = (slug: string): BouquetFilter | undefined => {
  if (slug === "single-color") return "un-color";
  if (slug === "mixed-color") return "mezclas";
  if (slug === "zodiac") return "zodiac";
  if (slug === "bicolor") return "bicolor";
  return undefined;
};

export const catalogFallbackPrice = (product: BouquetProduct): number =>
  product.customSizes
    ? product.customSizes[0].price
    : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50);

interface BouquetCollectionViewProps {
  filter?: BouquetFilter;
  colorCollection?: RoseColor;
  language?: Language;
}

const BouquetCollectionView = async ({
  filter = "all",
  colorCollection,
  language = "en",
}: BouquetCollectionViewProps) => {
  const { t } = getTranslator(language);
  const promoActive = isMothersDayPromoActive();
  const summaries = await fetchCatalogSummaries();

  const colorColl = colorCollection ? collectionFromSegment(colorCollection) : undefined;

  // Long-tail SEO key for this view (SPA logic 1:1).
  const longTailKey: string | undefined = colorColl
    ? `color:${colorColl.color}`
    : filter === "all"
    ? "bouquets"
    : filter === "un-color"
    ? "single-color"
    : filter === "mezclas"
    ? "mixed-color"
    : filter === "zodiac"
    ? "zodiac"
    : filter === "bicolor"
    ? "bicolor"
    : undefined;

  const colorLinkTo = (color: RoseColor): string => {
    const c = COLOR_COLLECTIONS.find((x) => x.color === color);
    if (!c) return "/bouquets";
    return language === "es" ? `/es/bouquets/${c.slugEs}` : `/bouquets/${c.slug}`;
  };

  const orderForFilter =
    filter === "zodiac" ? ORDER_ZODIAC :
    filter === "un-color" ? ORDER_SINGLE :
    filter === "mezclas" ? ORDER_MIXED :
    ORDER_ALL;

  const filteredProducts = colorColl
    ? sortByOrder(productsForColor(bouquetProducts, colorColl), ORDER_ALL)
    : sortByOrder(
        bouquetProducts.filter((product) => {
          if (filter === "zodiac") return isZodiac(product.id);
          if (filter === "all") return true;
          if (isZodiac(product.id)) return false;
          if (filter === "bicolor") return isBicolorProduct(product);
          const isMix = product.color.includes(" y ") || product.color.includes(", ") || product.color.includes(" y");
          return filter === "mezclas" ? isMix : !isMix;
        }),
        orderForFilter
      );

  const subSeo = filter !== "all" ? SEO_BY_FILTER[filter] : null;
  const seoPath = colorColl
    ? `/bouquets/${colorColl.slug}`
    : subSeo ? subSeo.path : "/bouquets";
  const heading = colorColl
    ? t(`${colorColl.ns}.h1`)
    : subSeo ? t(`${subSeo.ns}.h1`) : t("bouquetProducts.title");

  // Breadcrumb (visible + JSON-LD): add the subcategory level when filtered.
  const subBreadcrumbLabel = colorColl || subSeo ? heading : null;
  const crumbItems = subBreadcrumbLabel
    ? [{ label: t("nav.home"), to: "/" }, { label: t("nav.bouquets"), to: "/bouquets" }, { label: subBreadcrumbLabel }]
    : [{ label: t("nav.home"), to: "/" }, { label: t("nav.bouquets") }];
  const schemaCrumbs = subBreadcrumbLabel
    ? [
        { name: "Home", url: "https://amorelialuxuryfloral.com" },
        { name: "Bouquets", url: "https://amorelialuxuryfloral.com/bouquets" },
        { name: subBreadcrumbLabel, url: `https://amorelialuxuryfloral.com${seoPath}` },
      ]
    : [
        { name: "Home", url: "https://amorelialuxuryfloral.com" },
        { name: "Bouquets", url: "https://amorelialuxuryfloral.com/bouquets" },
      ];

  const priceFor = (p: BouquetProduct): number => {
    const live = summaries.get(p.shopifyHandle)?.minPrice;
    return live && live > 0 ? live : catalogFallbackPrice(p);
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[
        breadcrumbSchema(schemaCrumbs),
        itemListSchema(
          filteredProducts.map(p => ({
            name: p.name,
            url: `https://amorelialuxuryfloral.com/bouquets/${slugForHandle(p.shopifyHandle)}`,
            image: summaries.get(p.shopifyHandle)?.images[0] || p.image || undefined,
            // Live Shopify price (server-fetched) with the same catalog fallback
            // the visible price uses — every Product in the ItemList carries a
            // valid Offer for Google (SPEC §2.3).
            price: priceFor(p),
          })),
          heading,
        ),
      ]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={crumbItems} />

          {/* Mobile-first layout (Romuald + Dani): H1 + one-line mirror intro
              → Colors filter row → Collections chips → PRODUCT GRID. The
              navigation (Colors + Collections) sits up top on mobile; the full
              intro paragraph sits BELOW the grid. Desktop keeps the original
              order via md:order-* — pure CSS reordering of the SAME server
              HTML: nothing is removed, duplicated or hidden (no accordion /
              "read more"). */}
          <div className="flex flex-col">
            <div className="text-center mb-5 md:mb-3 md:order-1">
              <p className="font-subtitle-script text-primary text-base md:text-2xl mb-2">{t("bouquetProducts.subtitle")}</p>
              <h1 className="font-title-retro text-2xl sm:text-3xl md:text-5xl text-foreground">{heading}</h1>
              {/* Mirror-effect long-tail intro under the existing H1 — the
                  one-line keyword intro that stays above the grid on mobile. */}
              <LongTailIntro seoKey={longTailKey} language={language} />
            </div>

            {/* Colors block — transactional filter (same search intent), so it
                stays ABOVE the grid as a single horizontally-scrollable row on
                mobile; centered wrap on desktop (original position via order). */}
            <div className="text-center mb-6 md:mb-12 md:order-4">
              <p className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">
                {t("bouquetProducts.colorsTitle")}
              </p>
              {/* Bolitas de color (en vez de texto "Red Roses"). El texto va en
                  sr-only para no perder el anchor keyword (SEO). */}
              <div className="flex flex-nowrap overflow-x-auto gap-3 pb-2 -mx-6 px-6 items-center md:mx-0 md:px-0 md:pb-0 md:flex-wrap md:justify-center md:overflow-visible">
                {COLOR_COLLECTIONS.map((c) => {
                  const active = colorColl?.color === c.color;
                  return (
                    <Link
                      key={c.color}
                      href={colorLinkTo(c.color)}
                      title={t(`nav.${c.color}Roses`)}
                      aria-label={t(`nav.${c.color}Roses`)}
                      className={`flex-shrink-0 rounded-full transition-transform ${
                        active
                          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                          : "ring-1 ring-foreground/15 hover:scale-110"
                      }`}
                      style={{
                        width: "2.25rem",
                        height: "2.25rem",
                        background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,0.42), rgba(255,255,255,0) 55%), ${COLOR_SWATCH[c.color] ?? "#999999"}`,
                      }}
                    >
                      <span className="sr-only">{t(`nav.${c.color}Roses`)}</span>
                    </Link>
                  );
                })}
                {/* Bicolor: no es un color único → pastilla de texto compacta al lado. */}
                <Link
                  href="/bouquets/bicolor"
                  className={`whitespace-nowrap flex-shrink-0 px-3 md:px-4 py-1.5 rounded-full font-body text-xs md:text-sm transition-all ${
                    !colorColl && filter === "bicolor"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {t("nav.bicolorBouquets")}
                </Link>
              </div>
            </div>

            {/* Collections block — filter label, NOT a document heading (SPEC §0f).
                ABOVE the grid on mobile (with the Colors row) so navigation sits
                up top; original desktop position preserved via md:order-3. */}
            <div className="text-center mb-6 md:mb-8 md:mt-0 md:order-3">
              <p className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-3">
                {t("bouquetProducts.collectionsTitle")}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {([
                  { key: "all", label: t("bouquetProducts.seeAll") },
                  { key: "un-color", label: t("bouquetProducts.singleColor") },
                  { key: "mezclas", label: t("bouquetProducts.mixes") },
                ] as { key: BouquetFilter; label: string }[]).map(({ key, label }) => (
                  <Link
                    key={key}
                    href={COLLECTION_PATHS[key]}
                    className={`px-3 md:px-5 py-1.5 md:py-2 rounded-full font-body text-xs md:text-sm transition-all inline-flex items-center gap-1 md:gap-1.5 ${
                      !colorColl && filter === key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto w-full md:order-5">
            {filteredProducts.map((product) => {
              const s = summaries.get(product.shopifyHandle);
              return (
                <div key={product.id} className="relative">
                  {promoActive && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <div className="bg-primary text-primary-foreground px-2 md:px-3 py-1 rounded-bl-lg rounded-tr-sm font-body text-[8px] md:text-[10px] tracking-wider uppercase font-bold shadow-lg">
                        Available May 13
                      </div>
                    </div>
                  )}
                  <ProductCard
                    href={`/bouquets/${slugForHandle(product.shopifyHandle)}`}
                    name={product.name}
                    imagePrimary={s?.images[0] || product.image}
                    imageSecondary={hoverImageFor(s) || product.image2}
                    price={priceFor(product)}
                    fromLabel={t("product.from")}
                    // Grid hangs directly off the H1 — card titles are NOT
                    // headings here (no H1→H3 skip). Same classes/look.
                    titleAs="p"
                  />
                </div>
              );
            })}
            </div>

            {/* Full intro paragraph — semantic depth BELOW the grid on mobile,
                original spot (under the H1) on desktop. Same text + links,
                only repositioned. */}
            <div className="text-center mt-10 md:mt-0 md:mb-8 md:order-2">
              <p className="text-muted-foreground font-body text-sm max-w-2xl mx-auto">
                {t("bouquetProducts.description")}{' '}
                <Link href={colorLinkTo("white")} className="text-primary hover:underline">{t("nav.whiteRoses").toLowerCase()}</Link>,{' '}
                <Link href={colorLinkTo("red")} className="text-primary hover:underline">{t("nav.redRoses").toLowerCase()}</Link>,{' '}
                <Link href={colorLinkTo("pink")} className="text-primary hover:underline">{t("nav.pinkRoses").toLowerCase()}</Link>,{' '}
                <Link href={colorLinkTo("blue")} className="text-primary hover:underline">{t("nav.blueRoses").toLowerCase()}</Link>.
              </p>
              <p className="text-primary font-body text-xs font-semibold mt-2">{t("common.orderBefore3PM")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection FAQ */}
      <div className="container mx-auto px-6">
        <CollectionFAQ faqs={bouquetFAQsFor(language)} language={language} />
      </div>

      {/* Long-tail body block — H2/H3 + copy + internal-link cluster. */}
      <LongTailBody seoKey={longTailKey} language={language} />

      {/* Dynamic cross-clusters — in-body, auto-updating internal links. */}
      <DynamicClusters language={language} />

      {/* CTA "Customize" ELIMINADO — Amorelia no tiene personalización de bouquets. */}
    </div>
  );
};

export default BouquetCollectionView;
