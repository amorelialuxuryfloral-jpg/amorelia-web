import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { BOUQUET_SLUGS, isZodiacBouquetHandle } from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { occasionPages } from "@/lib/occasionPagesData";
import { sameDayDeliveryPage } from "@/lib/sameDayCollectionData";
import { flowerTypePages } from "@/lib/flowerTypePagesData";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { fetchBlogPosts } from "@/lib/sanity";
import { sanityClient } from "@/lib/sanity";
import { routedLandings } from "@/views/rootSlug";

/**
 * sitemap.xml — ONLY canonical URLs (SPEC §2.6):
 *  - No noindex pages (legales, checkout, short links).
 *  - Nothing fused by 301 (the 3 cannibalized landings, legacy slugs,
 *    root /envio-de-flores duplicates, /es/<landing> duplicates).
 *  - No empty flower-type pages (SPEC §4 — not routed at all).
 *  - Mother's Day fichas only while the purchase window is open (outside it
 *    they 307 to /mothers-day → not canonical).
 * Every EN/ES pair is emitted as TWO entries, each carrying reciprocal
 * en / es / x-default alternates (same shape as the live sitemap).
 */

export const revalidate = 3600;

interface Pair {
  /** EN path ("" for home). */
  en: string;
  /** ES path WITHOUT the /es prefix. Defaults to `en`. */
  es?: string;
}

function pairEntries(pair: Pair): MetadataRoute.Sitemap {
  const enUrl = `${BASE_URL}${pair.en}`;
  const esUrl = `${BASE_URL}/es${pair.es ?? pair.en}`;
  const languages = { en: enUrl, es: esUrl, "x-default": enUrl };
  return [
    { url: enUrl, alternates: { languages } },
    { url: esUrl, alternates: { languages } },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const ramoBuchon = flowerTypePages.find((p) => p.slug === "ramo-buchon")!;
  const floralArrangements = flowerTypePages.find((p) => p.slug === "floral-arrangements")!;

  const pairs: Pair[] = [
    { en: "" },
    { en: "/bouquets" },
    { en: "/bouquets/personalizar" },
    // Subcategory filters (same slug in both trees).
    // /bouquets/zodiac is OUT: noindex hub (plan §1 — zodiac cluster de-indexed).
    { en: "/bouquets/single-color" },
    { en: "/bouquets/mixed-color" },
    { en: "/bouquets/bicolor" },
    // 9 color collections — native slugs per language.
    ...COLOR_COLLECTIONS.map((c) => ({ en: `/bouquets/${c.slug}`, es: `/bouquets/${c.slugEs}` })),
    // Keyword-first fichas — native slugs per language. The 12 zodiac fichas
    // are OUT (noindex, plan §1); the other 36 stay.
    ...Object.entries(BOUQUET_SLUGS)
      .filter(([handle]) => !isZodiacBouquetHandle(handle))
      .map(([, m]) => ({ en: `/bouquets/${m.slug}`, es: `/bouquets/${m.slugEs}` })),
    // Collection hubs + transactional collections (only pages WITH product).
    { en: "/collections/occasions", es: "/collections/ocasiones" },
    { en: "/collections/flowers", es: "/collections/flores" },
    { en: `/collections/${sameDayDeliveryPage.slug}`, es: `/collections/${sameDayDeliveryPage.slugEs}` },
    { en: `/collections/${ramoBuchon.slug}`, es: `/collections/${ramoBuchon.slugEs}` },
    { en: `/collections/${floralArrangements.slug}`, es: `/collections/${floralArrangements.slugEs}` },
    ...occasionPages.map((o) => ({ en: `/collections/${o.slug}`, es: `/collections/${o.slugEs}` })),
    // Seasonal (lives all year).
    { en: "/mothers-day" },
    // Room decors.
    { en: "/room-decors" },
    ...roomDecorPackages.map((p) => ({ en: `/room-decors/${p.id}` })),
    // Info pages.
    { en: "/about" },
    // /contact is intentionally noindex (NAP page, same as the live site) →
    // it must NOT be in the sitemap (sitemap = indexable pages only).
    { en: "/delivery" },
    { en: "/faq" },
    { en: "/blog" },
    { en: "/sitemap" },
    // Nationwide FedEx hub — the ONE indexable national target. The 35 per-city
    // pages are noindex,follow (Romuald's pre-launch verdict: thin/duplicate at
    // scale for a new domain, unwinnable "flower delivery [city]" SERPs) → OUT
    // of the sitemap, but still reachable/useful via the hub + footer.
    { en: "/flower-delivery", es: "/envio-de-flores" },
    // Plan §3 — funeral & sympathy money page (replaces sympathy-flowers).
    { en: "/funeral-sympathy-flowers-miami", es: "/flores-funeral-miami" },
  ];

  const entries: MetadataRoute.Sitemap = pairs.flatMap(pairEntries);

  // Plan §5 (cola ES) — ES-only canonical, no EN twin.
  entries.push({ url: `${BASE_URL}/es/ramo-de-rosas` });

  // Plan §6 — wedding lead page (EN-only canonical, replaces wedding-flowers).
  entries.push({ url: `${BASE_URL}/wedding-flowers-miami` });

  // Plan §7 — informational pillar (EN-only canonical).
  entries.push({ url: `${BASE_URL}/birth-flowers-by-month` });

  // CORRECCIONES puntos 20/32 — informational guides (EN-only canonicals).
  entries.push({ url: `${BASE_URL}/flowers-by-zodiac-sign` });
  entries.push({ url: `${BASE_URL}/flowers-that-represent-death` });
  entries.push({ url: `${BASE_URL}/how-to-preserve-roses` });

  // Landing pages (barrios + niche) — EN-only canonicals, no ES alternate.
  // /flower-shop-miami + /es/floristeria-miami now 301 to the home (Dani's
  // pre-launch verdict: cannibalized the home) → NOT in the sitemap.
  for (const landing of routedLandings) {
    if (landing.slug === "flower-shop-miami") continue;
    entries.push({ url: `${BASE_URL}/${landing.slug}` });
  }

  // Blog posts — canonical per language; reciprocal alternates only when the
  // translation exists (translationSlug).
  try {
    const [enPosts, esPosts] = await Promise.all([fetchBlogPosts("en"), fetchBlogPosts("es")]);
    const translationMap: Record<string, string | undefined> = Object.fromEntries(
      await sanityClient
        .fetch<Array<{ slug: string; translationSlug?: string }>>(
          `*[_type == "post" && defined(slug.current)]{ "slug": slug.current, translationSlug }`,
        )
        .then((rows) => rows.map((r) => [r.slug, r.translationSlug])),
    );

    for (const post of enPosts) {
      const slug = post.slug.current;
      const enUrl = `${BASE_URL}/blog/${slug}`;
      const esTwin = translationMap[slug];
      entries.push(
        esTwin
          ? {
              url: enUrl,
              lastModified: post.publishedAt,
              alternates: {
                languages: { en: enUrl, es: `${BASE_URL}/es/blog/${esTwin}`, "x-default": enUrl },
              },
            }
          : { url: enUrl, lastModified: post.publishedAt },
      );
    }
    for (const post of esPosts) {
      const slug = post.slug.current;
      const esUrl = `${BASE_URL}/es/blog/${slug}`;
      const enTwin = translationMap[slug];
      entries.push(
        enTwin
          ? {
              url: esUrl,
              lastModified: post.publishedAt,
              alternates: {
                languages: {
                  en: `${BASE_URL}/blog/${enTwin}`,
                  es: esUrl,
                  "x-default": `${BASE_URL}/blog/${enTwin}`,
                },
              },
            }
          : { url: esUrl, lastModified: post.publishedAt },
      );
    }
  } catch (err) {
    console.error("[sitemap] Sanity unreachable — blog posts omitted this build", err);
  }

  return entries;
}
