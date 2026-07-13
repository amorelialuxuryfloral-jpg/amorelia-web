import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import HomeView from "@/views/home";
import ShortLinkTracker from "@/components/ShortLinkTracker";
import LandingPageView from "@/components/LandingPageView";
import { SHORT_LINKS } from "@/lib/shortLinks";
import { landingPages, getLandingPage, type LandingPageData } from "@/lib/landingPagesData";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, type Language } from "@/i18n";

/**
 * Root-level single-segment pages (EN tree) + their /es twins:
 *
 * 1. Short attribution links (/wa, /ig, /story, /tiktok, /fb) — SPEC §8.ter:
 *    preserved 1:1. Each renders the home page in place (URL stays clean)
 *    while the client applies the mapped UTMs. noindex + canonical "/".
 *    Mounted under /es too (SPA parity) — there they render the ES home.
 *
 * 2. Landing pages: the 4 surviving Miami barrio pages (Brickell, Doral,
 *    Miami Beach, Hialeah — plan Dani; the other 4 301 to the hub) + the
 *    local hub /flower-shop-miami + the two surviving niche landings
 *    (gender-reveal-flowers-miami, 100-roses-bouquet-miami — SPEC §3:
 *    conserved, not cannibalizing). EN-only content: the live site served
 *    them under /es with `enOnly` SEO (canonical → EN). Here /es/<landing>
 *    301s straight to the EN canonical — same consolidation, cleaner.
 *
 * NOT here (SPEC §3 fusions — 301'd in next.config.ts):
 *    /valentines-day-flowers-miami → /collections/valentines-flowers
 *    /mothers-day-bouquets-miami   → /mothers-day
 *    /quinceanera-bouquets-miami   → /collections/quinceanera-bouquet
 */

/** Landing slugs that 301 away (never rendered, never in static params). */
export const FUSED_SLUGS: Record<string, string> = {
  "valentines-day-flowers-miami": "/collections/valentines-flowers",
  "mothers-day-bouquets-miami": "/mothers-day",
  "quinceanera-bouquets-miami": "/collections/quinceanera-bouquet",
};

export const routedLandings = landingPages.filter((p) => !(p.slug in FUSED_SLUGS));

export function resolveLanding(slug: string): LandingPageData | undefined {
  if (slug in FUSED_SLUGS) return undefined;
  return getLandingPage(slug);
}

export function rootSlugStaticParams(language: Language): Array<{ slug: string }> {
  return [
    ...Object.keys(SHORT_LINKS).map((slug) => ({ slug })),
    // ES tree: landings 301 to EN at runtime — only short links are static.
    ...(language === "en" ? routedLandings.map((p) => ({ slug: p.slug })) : []),
  ];
}

export async function rootSlugMetadata(slug: string, language: Language): Promise<Metadata> {
  if (SHORT_LINKS[slug]) {
    const { t } = getTranslator(language);
    return {
      title: t("seo.home.title"),
      description: t("seo.home.description"),
      robots: { index: false, follow: true },
      alternates: {
        canonical:
          language === "es" ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com",
      },
    };
  }

  if (language === "es") return {}; // landings under /es redirect — no metadata.

  const page = resolveLanding(slug);
  if (!page) return {};
  // The local hub has a real ES twin (/es/floristeria-miami — CORRECCIONES
  // punto 30): reciprocal hreflang instead of the EN-only treatment.
  if (page.slug === "flower-shop-miami") {
    return buildMetadata({
      title: page.seoTitle,
      description: page.seoDescription,
      path: "/flower-shop-miami",
      pathEs: "/floristeria-miami",
    });
  }
  return buildMetadata({
    title: page.seoTitle,
    description: page.seoDescription,
    path: `/${page.slug}`,
    noAlternateEs: true,
  });
}

export default async function RootSlugView({
  slug,
  language,
}: {
  slug: string;
  language: Language;
}) {
  if (SHORT_LINKS[slug]) {
    return (
      <>
        <ShortLinkTracker slug={slug} />
        <HomeView language={language} />
      </>
    );
  }

  if (language === "es") {
    // /es/<fused-landing> → its surviving EN target; /es/<landing> → EN canonical.
    if (FUSED_SLUGS[slug]) permanentRedirect(FUSED_SLUGS[slug]);
    // The local hub HAS an ES twin (punto 30) — send /es/flower-shop-miami there.
    if (slug === "flower-shop-miami") permanentRedirect("/es/floristeria-miami");
    if (getLandingPage(slug)) permanentRedirect(`/${slug}`);
    notFound();
  }

  const page = resolveLanding(slug);
  if (!page) notFound();
  return <LandingPageView page={page} />;
}
