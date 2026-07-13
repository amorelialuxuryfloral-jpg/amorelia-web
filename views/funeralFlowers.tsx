import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductCard from "@/components/ProductCard";
import JsonLd, {
  localBusinessSchema,
  faqSchema,
  breadcrumbSchema,
  itemListSchema,
} from "@/components/JsonLd";
import { fetchCollectionProducts, productLinkForHandle } from "@/lib/shopifyCollectionServer";
import { fetchCatalogSummaries, hoverImageFor } from "@/lib/shopifyCatalog";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle } from "@/lib/bouquetSlugs";
import { getPrice } from "@/lib/productData";
import { NAP_PHONE_DISPLAY, NAP_PHONE_TEL } from "@/lib/constants";
import {
  funeralPage,
  FUNERAL_PATH_EN,
  FUNERAL_PATH_ES,
  SYMPATHY_CATALOG_HANDLES,
} from "@/lib/funeralPageData";
import { buildMetadata } from "@/lib/seo";
import type { Language } from "@/i18n";

/**
 * /funeral-sympathy-flowers-miami + /es/flores-funeral-miami — plan §3.
 * Layout follows the transactional-collection pattern (H1 → intro → REAL
 * product grid → H2 sections → FAQ) with the plan's exact headers. Casket
 * sprays / standing sprays are H2s, NOT subpages.
 */

export function funeralMetadata(language: Language): Metadata {
  const isEs = language === "es";
  return buildMetadata({
    title: isEs ? funeralPage.title.es : funeralPage.title.en,
    description: isEs ? funeralPage.description.es : funeralPage.description.en,
    path: FUNERAL_PATH_EN,
    pathEs: FUNERAL_PATH_ES,
    language,
  });
}

export default async function FuneralFlowersView({ language }: { language: Language }) {
  const isEs = language === "es";
  const enUrl = `https://amorelialuxuryfloral.com${FUNERAL_PATH_EN}`;
  const esUrl = `https://amorelialuxuryfloral.com/es${FUNERAL_PATH_ES}`;
  const selfUrl = isEs ? esUrl : enUrl;

  // Product grid: live Shopify sympathy collection when populated; otherwise
  // the curated white/soft subset of the REAL catalog (nothing invented).
  const [collectionProducts, summaries] = await Promise.all([
    fetchCollectionProducts("sympathy-flowers"),
    fetchCatalogSummaries(),
  ]);
  const grid =
    collectionProducts.length > 0
      ? collectionProducts.map((p) => ({
          key: p.id,
          href: productLinkForHandle(p.handle, language),
          name: p.title,
          imagePrimary: p.primaryImage,
          imageSecondary: p.secondaryImage,
          price: p.minPrice,
          url: `https://amorelialuxuryfloral.com${productLinkForHandle(p.handle, "en")}`,
        }))
      : SYMPATHY_CATALOG_HANDLES.map((handle) => {
          const p = bouquetProducts.find((b) => b.shopifyHandle === handle)!;
          const s = summaries.get(handle);
          const fallbackPrice = p.customSizes
            ? p.customSizes[0].price
            : getPrice(p.pricingTier, p.color.includes(",") && p.pricingTier === "standard" ? 75 : 50);
          return {
            key: p.id,
            href: productLinkForHandle(handle, language),
            name: p.name,
            imagePrimary: s?.images[0] || p.image,
            imageSecondary: hoverImageFor(s) || p.image2,
            price: s?.minPrice && s.minPrice > 0 ? s.minPrice : fallbackPrice,
            url: `https://amorelialuxuryfloral.com/bouquets/${slugForHandle(handle)}`,
          };
        });

  const h1 = isEs ? funeralPage.h1.es : funeralPage.h1.en;
  const breadcrumbLabel = isEs ? "Flores para Funeral" : "Funeral & Sympathy Flowers";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isEs ? "Flores para funeral en Miami" : "Funeral & sympathy flowers in Miami",
    serviceType: isEs
      ? "Entrega de flores fúnebres el mismo día"
      : "Same-day funeral flower delivery",
    provider: { "@id": "https://amorelialuxuryfloral.com/#localbusiness" },
    areaServed: { "@type": "City", name: "Miami" },
    description: isEs ? funeralPage.description.es : funeralPage.description.en,
    url: selfUrl,
    offers: { "@type": "Offer", price: "25.00", priceCurrency: "USD" },
  };
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: h1,
    description: isEs ? funeralPage.description.es : funeralPage.description.en,
    url: selfUrl,
    inLanguage: isEs ? "es-US" : "en-US",
    isPartOf: { "@type": "WebSite", name: "Amorelia Luxury Floral Gifts", url: "https://amorelialuxuryfloral.com" },
    about: isEs ? funeralPage.keyword.es : funeralPage.keyword.en,
  };
  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com" },
    { name: breadcrumbLabel, url: selfUrl },
  ]);
  const faqLd = faqSchema(
    funeralPage.faqs.map((f) => ({
      question: isEs ? f.question.es : f.question.en,
      answer: isEs ? f.answer.es : f.answer.en,
    })),
  );

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          localBusinessSchema(),
          serviceSchema,
          collectionPageSchema,
          itemListSchema(
            grid.map((g) => ({ name: g.name, url: g.url, image: g.imagePrimary, price: g.price })),
            h1,
          ),
          faqLd,
          breadcrumbs,
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs
            items={[{ label: isEs ? "Inicio" : "Home", to: isEs ? "/es" : "/" }, { label: breadcrumbLabel }]}
          />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">{h1}</h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-10">
            {isEs ? funeralPage.intro.es : funeralPage.intro.en}
          </p>

          {/* Sympathy arrangements — REAL product grid */}
          <section id="sympathy-arrangements" className="scroll-mt-28 mb-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">
              {isEs ? funeralPage.gridH2.es : funeralPage.gridH2.en}
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-5">
              {isEs ? funeralPage.gridIntro.es : funeralPage.gridIntro.en}
            </p>
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

          {/* Casket sprays · Funeral home delivery · How to order */}
          <div className="space-y-10 mb-14">
            {funeralPage.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">
                  {isEs ? s.h2.es : s.h2.en}
                </h2>
                <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
                  {isEs ? s.body.es : s.body.en}
                </p>
              </section>
            ))}
          </div>

          {/* Phone CTA for ceremonial pieces */}
          <section className="bg-cream rounded-lg p-6 md:p-8 mb-14 text-center">
            <p className="font-body text-sm md:text-base text-foreground mb-4">
              {isEs
                ? "¿Corona, cruz o arreglo de pie para un servicio? Llámanos y lo coordinamos hoy."
                : "Need a casket spray, wreath or standing spray for a service? Call us and we coordinate it today."}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href={NAP_PHONE_TEL}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm hover:bg-primary/90 transition-colors"
              >
                <Phone className="w-4 h-4" /> {NAP_PHONE_DISPLAY}
              </a>
              <Link
                href={isEs ? "/es/contact" : "/contact"}
                className="inline-flex items-center gap-2 bg-white border border-border text-foreground px-6 py-3 rounded-md font-body text-sm hover:border-primary transition-colors"
              >
                {isEs ? "Formulario de contacto" : "Contact form"} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq" className="scroll-mt-28 mb-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">
              {isEs ? funeralPage.faqTitle.es : funeralPage.faqTitle.en}
            </h2>
            <div className="space-y-4">
              {funeralPage.faqs.map((faq) => (
                <div key={isEs ? faq.question.es : faq.question.en} className="border border-border rounded-xl p-5">
                  <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-1.5">
                    {isEs ? faq.question.es : faq.question.en}
                  </h3>
                  <p className="text-muted-foreground font-body text-sm leading-relaxed">
                    {isEs ? faq.answer.es : faq.answer.en}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Internal links (local cluster) */}
          <section className="mb-4">
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              {isEs ? "También te puede servir:" : "You may also need:"}
            </h2>
            <ul className="flex flex-wrap gap-3">
              {[
                {
                  href: isEs ? "/es/bouquets/rosas-blancas" : "/bouquets/white-roses",
                  label: isEs ? "Rosas Blancas" : "White Roses",
                },
                { href: "/flower-delivery-hialeah", label: "Flower Delivery Hialeah" },
                {
                  href: isEs ? "/es" : "/",
                  label: isEs ? "Floristería en Miami" : "Miami Flower Shop",
                },
                {
                  href: "/flowers-that-represent-death",
                  label: isEs ? "Guía: flores que representan el luto" : "Guide: flowers that represent death",
                },
                {
                  href: isEs ? "/es/collections/entrega-el-mismo-dia" : "/collections/same-day-delivery",
                  label: isEs ? "Entrega el mismo día" : "Same-Day Delivery",
                },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 bg-cream/60 hover:bg-cream border border-border rounded-full px-4 py-2 font-body text-sm text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
