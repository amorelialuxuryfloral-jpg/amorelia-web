import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { getPrice } from "@/lib/productData";
import { hoverImageFor, type CatalogSummaryMap } from "@/lib/shopifyCatalog";
import ProductCard from "@/components/ProductCard";
import { getTranslator, type Language } from "@/i18n";

interface Props {
  currentProductId: string;
  /** Live catalog summaries fetched by the page (prices + images in the HTML). */
  summaries: CatalogSummaryMap;
  language?: Language;
}

/** Normalize a color string into individual color tokens (ES + EN) for matching. */
function tokenizeColors(raw: string): string[] {
  if (!raw) return [];
  const normalized = raw
    .toLowerCase()
    .replace(/\s+y\s+/g, ",")
    .replace(/\s+and\s+/g, ",")
    .replace(/&/g, ",");
  return normalized
    .split(/[,/]/)
    .map(t => t.trim())
    .filter(Boolean);
}

/** Related-products cross-links by shared color (Server Component, SPA port). */
const YouMightAlsoLove = ({ currentProductId, summaries, language = "en" }: Props) => {
  const { t } = getTranslator(language);
  const currentProduct = bouquetProducts.find(p => p.id === currentProductId);
  if (!currentProduct) return null;

  const currentColors = tokenizeColors(currentProduct.color);
  if (currentColors.length === 0) return null;

  const scored = bouquetProducts
    .filter(p => p.id !== currentProductId)
    .map(p => {
      const tokens = tokenizeColors(p.color);
      const shared = tokens.filter(tk => currentColors.includes(tk)).length;
      return { product: p, shared };
    })
    .filter(x => x.shared > 0)
    .sort((a, b) => b.shared - a.shared);

  const related = scored.slice(0, 6).map(x => x.product);
  if (related.length === 0) return null;

  return (
    <section className="pt-10 pb-5 border-t border-border">
      <h2 className="font-display text-xl font-semibold text-foreground text-center mb-8">{t("product.youMightAlsoLove")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {related.map(product => {
          const s = summaries.get(product.shopifyHandle);
          const fallbackPrice = product.customSizes
            ? product.customSizes[0].price
            : getPrice(product.pricingTier, (product.pricingTier === 'mix3red' || (product.color.includes(',') && product.pricingTier === 'standard')) ? 75 : 50);
          return (
            <ProductCard
              key={product.id}
              href={`/bouquets/${slugForHandle(product.shopifyHandle)}`}
              name={product.name}
              imagePrimary={s?.images[0] || product.image}
              imageSecondary={hoverImageFor(s) || product.image2}
              price={s?.minPrice && s.minPrice > 0 ? s.minPrice : fallbackPrice}
              fromLabel={t("product.from")}
              compact
              enableHoverSwap={false}
            />
          );
        })}
      </div>
    </section>
  );
};

export default YouMightAlsoLove;
