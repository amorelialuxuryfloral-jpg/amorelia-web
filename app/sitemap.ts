import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { bouquetProducts } from "@/lib/catalogData";
import { BOUQUET_SLUGS, slugForHandle, slugEsForHandle, isZodiacBouquetHandle } from "@/lib/bouquetSlugs";

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

/**
 * Amorelia sitemap — SOLO bouquets + páginas core.
 * Fuera todo lo heredado de Charls: ocasiones, room-decor, blog, ciudades,
 * funeral, boda, zodiaco, custom bouquet, flower-types (fase 2 de SEO si se
 * quieren). Las fichas individuales de producto se derivan del catálogo real
 * (`bouquetProducts`), igual que BOUQUET_SLUGS.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pairs: Pair[] = [
    { en: "" },
    { en: "/bouquets" },
    { en: "/bouquets/single-color" },
    { en: "/bouquets/mixed-color" },
    // Filtros por color (bouquets) — slugs nativos por idioma.
    ...COLOR_COLLECTIONS.map((c) => ({ en: `/bouquets/${c.slug}`, es: `/bouquets/${c.slugEs}` })),
    // Fichas de producto (una por ramo del catálogo real, EN + ES).
    // Mismo filtro que el resolver de /bouquets/[slug]: solo handles que
    // existen en el catálogo, y nunca los de zodiaco (noindex).
    ...bouquetProducts
      .map((p) => p.shopifyHandle)
      .filter((h) => BOUQUET_SLUGS[h] && !isZodiacBouquetHandle(h))
      .map((h) => ({ en: `/bouquets/${slugForHandle(h)}`, es: `/bouquets/${slugEsForHandle(h)}` })),
    // Informativas.
    { en: "/delivery" },
    { en: "/faq" },
    // Legales.
    { en: "/privacy-policy" },
    { en: "/terms-of-service" },
    { en: "/refund-policy" },
    { en: "/shipping-policy" },
  ];
  return pairs.flatMap(pairEntries);
}
