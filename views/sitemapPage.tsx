import type { Metadata } from "next";
import Link from "next/link";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle, slugEsForHandle } from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * /sitemap + /es/sitemap — visible HTML sitemap (Amorelia).
 * SOLO rutas reales: páginas core, bouquets, colecciones de color y legales.
 * Nada de blog / room-decor / landings / custom-builder (no existen en Amorelia).
 */

export function sitemapPageMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("sitemap.seoTitle"),
    description: t("sitemap.seoDescription"),
    path: "/sitemap",
    language,
  });
}

export default function SitemapPageView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);

  // Deduplicate bouquets by shopifyHandle (unique key for the route).
  const uniqueBouquets = Array.from(
    new Map(bouquetProducts.map((p) => [p.shopifyHandle, p])).values(),
  );

  const sections = [
    { title: t("sitemap.sections.mainPages"), links: [
      { to: l("/"), label: t("sitemap.links.home") },
      { to: l("/bouquets"), label: t("sitemap.links.bouquets") },
      { to: l("/bouquets/single-color"), label: t("nav.singleColor") },
      { to: l("/bouquets/mixed-color"), label: t("nav.mixedBouquets") },
      { to: l("/delivery"), label: t("sitemap.links.delivery") },
      { to: l("/contact"), label: t("sitemap.links.contact") },
      { to: l("/faq"), label: t("sitemap.links.faq") },
    ]},
    { title: t("sitemap.sections.bouquets"), links: uniqueBouquets.map((p) => ({
      to: isEs
        ? `/es/bouquets/${slugEsForHandle(p.shopifyHandle)}`
        : `/bouquets/${slugForHandle(p.shopifyHandle)}`,
      label: p.name,
    }))},
    { title: t("nav.byColor"), links: COLOR_COLLECTIONS.map((c) => ({
      to: isEs ? `/es/bouquets/${c.slugEs}` : `/bouquets/${c.slug}`,
      label: t(`nav.${c.color}Roses`),
    }))},
    { title: t("sitemap.sections.legal"), links: [
      { to: l("/privacy-policy"), label: t("sitemap.links.privacyPolicy") },
      { to: l("/terms-of-service"), label: t("sitemap.links.termsOfService") },
      { to: l("/refund-policy"), label: t("sitemap.links.refundPolicy") },
      { to: l("/shipping-policy"), label: t("sitemap.links.shippingPolicy") },
      { to: l("/cookie-policy"), label: t("sitemap.links.cookiePolicy") },
    ]},
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-10">{t("sitemap.title")}</h1>
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">{section.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {section.links.map((link) => (
                    <Link key={link.to} href={link.to} className="font-body text-sm text-primary hover:underline">{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
