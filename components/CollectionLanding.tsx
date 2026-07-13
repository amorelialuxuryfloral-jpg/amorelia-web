import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import { fetchCollectionProducts, productLinkForHandle } from "@/lib/shopifyCollectionServer";
import { fetchCatalogSummaries, hoverImageFor } from "@/lib/shopifyCatalog";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { getPrice } from "@/lib/productData";
import type { OccasionPage } from "@/lib/occasionPagesData";
import type { Language } from "@/i18n";

/**
 * Transactional collection landing (/collections/<slug>) — Server Component
 * port of the SPA's OccasionPage design, upgraded per SPEC §4: a transactional
 * URL only exists WITH a real product grid. Products come from the matching
 * Shopify collection; when that collection is still empty in Shopify Admin,
 * the page hangs the REAL rose-bouquet catalog (every Amorelia bouquet IS a
 * same-day deliverable oversized rose bouquet — nothing invented) so the page
 * is never an empty promise.
 */

interface Props {
  page: OccasionPage;
  language?: Language;
  parent?: { path: string; url: string; label: string };
  /** Root-level landings (e.g. /es/ramo-de-rosas) override the
   *  /collections/<slug> base paths used for canonical/schema URLs. */
  pathOverride?: { en: string; es: string };
}

const CollectionLanding = async ({ page, language = "en", parent, pathOverride }: Props) => {
  const isEs = language === "es";
  const handle = page.shopifyHandle ?? page.slug;
  const [collectionProducts, summaries] = await Promise.all([
    fetchCollectionProducts(handle),
    fetchCatalogSummaries(),
  ]);

  const path = pathOverride?.en ?? `/collections/${page.slug}`;
  const pathEs = pathOverride?.es ?? `/collections/${page.slugEs}`;
  const enUrl = `https://amorelialuxuryfloral.com${path}`;
  const esUrl = `https://amorelialuxuryfloral.com/es${pathEs}`;
  const selfUrl = isEs ? esUrl : enUrl;

  const h1 = isEs ? page.h1.es : page.h1.en;
  const description = isEs ? page.description.es : page.description.en;
  const intro = isEs ? page.intro.es : page.intro.en;

  const parentIndex = parent ?? {
    path: isEs ? "/es/collections/ocasiones" : "/collections/occasions",
    url: isEs
      ? "https://amorelialuxuryfloral.com/es/collections/ocasiones"
      : "https://amorelialuxuryfloral.com/collections/occasions",
    label: isEs ? "Ocasiones" : "Occasions",
  };

  // Product grid: live Shopify collection first; real rose catalog as the
  // guaranteed-not-empty fallback (SPEC §4 — no empty transactional pages).
  const gridFromCollection = collectionProducts.length > 0;
  const catalogGrid = bouquetProducts.map((p) => {
    const s = summaries.get(p.shopifyHandle);
    const fallbackPrice = p.customSizes
      ? p.customSizes[0].price
      : getPrice(p.pricingTier, (p.pricingTier === 'mix3red' || (p.color.includes(',') && p.pricingTier === 'standard')) ? 75 : 50);
    return {
      key: p.id,
      href: productLinkForHandle(p.shopifyHandle, isEs ? "es" : "en"),
      name: p.name,
      imagePrimary: s?.images[0] || p.image,
      imageSecondary: hoverImageFor(s) || p.image2,
      price: s?.minPrice && s.minPrice > 0 ? s.minPrice : fallbackPrice,
      url: `https://amorelialuxuryfloral.com/bouquets/${slugForHandle(p.shopifyHandle)}`,
    };
  });
  const collectionGrid = collectionProducts.map((p) => ({
    key: p.id,
    href: productLinkForHandle(p.handle, isEs ? "es" : "en"),
    name: p.title,
    imagePrimary: p.primaryImage,
    imageSecondary: p.secondaryImage,
    price: p.minPrice,
    url: `https://amorelialuxuryfloral.com${productLinkForHandle(p.handle, "en")}`,
  }));
  const grid = gridFromCollection ? collectionGrid : catalogGrid;

  // Internal link cluster: smaller-volume → bigger (SPA port).
  const pfx = isEs ? "/es" : "";
  const cluster: Array<{ to: string; label: string; tag: string }> = [
    { to: `${pfx}/bouquets/personalizar`, label: isEs ? "Builder a medida (con IA)" : "Custom bouquet builder (AI preview)", tag: isEs ? "A medida" : "Custom" },
    { to: isEs ? "/es/bouquets/rosas-rojas" : "/bouquets/red-roses", label: isEs ? "Rosas Rojas" : "Red Roses", tag: "Color" },
    { to: isEs ? "/es/bouquets/rosas-blancas" : "/bouquets/white-roses", label: isEs ? "Rosas Blancas" : "White Roses", tag: "Color" },
    { to: `${pfx}/bouquets`, label: isEs ? "Todos los Bouquets" : "All Bouquets", tag: isEs ? "Catálogo" : "Catalog" },
    { to: `${pfx}/room-decors/love-bomb`, label: "Love Bomb", tag: isEs ? "Paquete" : "Package" },
    { to: `${pfx}/room-decors/overly-romantic`, label: "Overly Romantic", tag: isEs ? "Paquete" : "Package" },
    { to: `${pfx}/room-decors/deluxe-love-package`, label: "Deluxe Love Package", tag: isEs ? "Paquete" : "Package" },
  ];

  // JSON-LD: CollectionPage + ItemList (REAL products with offers) + breadcrumbs
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: h1,
    description,
    url: selfUrl,
    inLanguage: isEs ? "es-US" : "en-US",
    isPartOf: { "@type": "WebSite", name: "Amorelia Luxury Floral Gifts", url: "https://amorelialuxuryfloral.com" },
    about: isEs ? page.keyword.es : page.keyword.en,
  };

  const itemList = itemListSchema(
    grid.map((g) => ({ name: g.name, url: g.url, image: g.imagePrimary, price: g.price })),
    h1,
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com" },
    { name: parentIndex.label, url: parentIndex.url },
    { name: h1, url: selfUrl },
  ]);

  // Product-grid H2: the collection's REAL keyword (verbatim from the page
  // data, validated against KEYWORD-RESEARCH-REAL) instead of a generic
  // "Available now" UI label. Trailing "miami"/"en miami" is stripped so the
  // sentence pattern never doubles the city name.
  const keywordBase = (isEs ? page.keyword.es : page.keyword.en)
    .replace(/\s+(en\s+)?miami$/i, "")
    .trim();
  const gridH2 = `${keywordBase.charAt(0).toUpperCase()}${keywordBase.slice(1)}${
    isEs ? " con entrega hoy en Miami" : " available today in Miami"
  }`;

  const toc: TocItem[] = [
    { id: "available-now", label: isEs ? "Disponibles ahora" : "Available now" },
    ...page.sections.map((s, i) => ({
      id: `section-${i}`,
      label: isEs ? s.h2.es : s.h2.en,
    })),
    { id: "recommendations", label: isEs ? "También te puede gustar" : "You may also like" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[collectionPageSchema, itemList, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: isEs ? "/es" : "/" },
              { label: parentIndex.label, to: parentIndex.path },
              { label: h1 },
            ]}
          />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">{h1}</h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">{intro}</p>

          {/* Mobile-first (Romuald + Dani): the PRODUCT GRID comes right after
              the H1 + intro on mobile; the jump-link index sits below it.
              Desktop keeps the original order (index → grid) via md:order-* —
              pure CSS reorder of the same server HTML, nothing removed. */}
          <div className="flex flex-col">
            {/* Product grid — always real products (live collection or catalog). */}
            <section id="available-now" className="scroll-mt-28 mb-14 md:order-2">
              <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-5">
                {gridH2}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {grid.map((g) => (
                  <ProductCard
                    key={g.key}
                    href={g.href}
                    name={g.name}
                    imagePrimary={g.imagePrimary}
                    imageSecondary={g.imageSecondary}
                    price={g.price}
                    fromLabel={isEs ? "Desde" : "From"}
                    compact
                  />
                ))}
              </div>
            </section>

            {/* Navigable index (jump-links) — skip the info blocks, go to products. */}
            <TableOfContents
              items={toc}
              heading={isEs ? "En esta página" : "On this page"}
              className="md:order-1"
            />
          </div>

          {/* Body sections — H2 + body for each */}
          <div className="space-y-10 mb-14">
            {page.sections.map((s, i) => (
              <section key={i} id={`section-${i}`} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">
                  {isEs ? s.h2.es : s.h2.en}
                </h2>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                  {isEs ? s.body.es : s.body.en}
                </p>
              </section>
            ))}
          </div>

          {/* Internal-link cluster: smaller-volume → bigger */}
          <section id="recommendations" className="scroll-mt-28 bg-cream rounded-lg p-6 md:p-8 mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-2">
              {isEs ? "También te puede gustar" : "You may also like"}
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              {isEs
                ? `Las colecciones que más se piden para ${page.keyword.es}. Todas con entrega el mismo día en Miami.`
                : `The collections most ordered for ${page.keyword.en}. All with same-day Miami delivery.`}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {cluster.map((c) => (
                <li key={c.to}>
                  <Link
                    href={c.to}
                    className="group flex items-center justify-between gap-3 bg-white border border-border rounded-md px-4 py-3 hover:border-primary transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground bg-cream px-2 py-1 rounded">
                        {c.tag}
                      </span>
                      <span className="font-body text-sm text-foreground group-hover:text-primary transition-colors">
                        {c.label}
                      </span>
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CollectionLanding;
