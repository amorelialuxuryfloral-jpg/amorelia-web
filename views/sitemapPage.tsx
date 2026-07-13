import type { Metadata } from "next";
import Link from "next/link";
import { fetchBlogPosts } from "@/lib/sanity";
import { landingPages } from "@/lib/landingPagesData";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle, slugEsForHandle } from "@/lib/bouquetSlugs";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";
import { FUSED_SLUGS } from "@/views/rootSlug";

/**
 * /sitemap + /es/sitemap — visible HTML sitemap (SPA port, SitemapPage.tsx).
 * Server-rendered: blog links come from Sanity at render time. The fused
 * landing slugs (SPEC §3 301s) are excluded — no internal links to redirects.
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

export default async function SitemapPageView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);
  const blogPosts = await fetchBlogPosts(language).catch(() => []);

  // Deduplicate bouquets by shopifyHandle (unique key for the route).
  const uniqueBouquets = Array.from(
    new Map(bouquetProducts.map((p) => [p.shopifyHandle, p])).values(),
  );

  // flower-shop-miami now 301s to the home (Dani's verdict) → not listed here.
  const routedLandings = landingPages.filter(
    (p) => !(p.slug in FUSED_SLUGS) && p.slug !== "flower-shop-miami",
  );

  const sections = [
    { title: t("sitemap.sections.mainPages"), links: [
      { to: l("/"), label: t("sitemap.links.home") },
      { to: l("/bouquets"), label: t("sitemap.links.bouquets") },
      { to: l("/bouquets/personalizar"), label: t("sitemap.links.customBouquetBuilder") },
      { to: l("/room-decors"), label: t("sitemap.links.roomDecors") },
      { to: l("/delivery"), label: t("sitemap.links.delivery") },
      { to: l("/about"), label: t("sitemap.links.about") },
      { to: l("/contact"), label: t("sitemap.links.contact") },
      { to: l("/faq"), label: t("sitemap.links.faq") },
      { to: l("/blog"), label: t("sitemap.links.blog") },
    ]},
    { title: t("sitemap.sections.bouquets"), links: uniqueBouquets.map((p) => ({
      to: isEs
        ? `/es/bouquets/${slugEsForHandle(p.shopifyHandle)}`
        : `/bouquets/${slugForHandle(p.shopifyHandle)}`,
      label: p.name,
    }))},
    { title: t("sitemap.sections.roomDecors"), links: roomDecorPackages.map((pkg) => ({
      to: l(`/room-decors/${pkg.id}`), label: pkg.name,
    }))},
    { title: t("sitemap.sections.blogArticles"), links: blogPosts.map((a) => ({
      to: l(`/blog/${a.slug.current}`), label: a.title.split("|")[0].trim(),
    }))},
    // Landing pages are EN-only canonicals — link them unlocalized in both trees.
    { title: t("sitemap.sections.landingPages"), links: routedLandings.map((p) => ({
      to: `/${p.slug}`,
      // Barrio pages are EN-only canonicals, but on the ES sitemap show a
      // Spanish label ("Flores en Brickell") instead of the English H1.
      label:
        isEs && p.type === "neighborhood"
          ? `Flores en ${p.h1.replace("Flower Delivery in ", "").replace(/,? Miami$/, "").trim()}`
          : p.h1.replace(/ [–—|].*/g, ""),
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
