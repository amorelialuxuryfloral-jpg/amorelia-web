import type { Metadata } from "next";
import { stripLangPrefix, type Language } from "@/i18n";

/**
 * Per-route metadata builder — replaces the SPA's <SeoHead> (react-helmet).
 *
 * Contract (SPEC-SSR-REBUILD §2):
 *  - Exactly ONE <title>, ONE meta description and ONE og:description per
 *    route (the SPA shipped 2 descriptions — index.html default + helmet).
 *    The Metadata API guarantees this as long as pages build their whole
 *    metadata through this helper (never merge partial og objects).
 *  - Canonical + hreflang (en / es / x-default) on every route.
 *  - Single canonical domain: https://amorelialuxuryfloral.com (no www).
 */

export const BASE_URL = "https://amorelialuxuryfloral.com";
export const DEFAULT_OG_IMAGE =
  "https://amorelialuxuryfloral.com/amorelia-logo.webp";

export interface BuildMetadataArgs {
  title: string;
  description: string;
  /** EN-style path (no /es prefix), e.g. "/bouquets/red-roses". */
  path?: string;
  /**
   * Optional ES-specific path (EN-style, no /es prefix) when the ES URL slug
   * differs from the EN one (e.g. localized collection slugs).
   */
  pathEs?: string;
  language?: Language;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** EN-only pages: no ES hreflang alternate, canonical always EN. */
  noAlternateEs?: boolean;
  /** ES-only pages (no EN twin): no EN hreflang alternate, canonical always ES. */
  esOnly?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  pathEs,
  language = "en",
  image,
  type = "website",
  noindex = false,
  noAlternateEs = false,
  esOnly = false,
}: BuildMetadataArgs): Metadata {
  const cleanPath = stripLangPrefix(path) || "/";
  const cleanPathEs = stripLangPrefix(pathEs || path) || "/";
  const enUrl = `${BASE_URL}${cleanPath === "/" ? "" : cleanPath}`;
  const esUrl = `${BASE_URL}${cleanPathEs === "/" ? "/es" : `/es${cleanPathEs}`}`;

  const canonical = esOnly ? esUrl : language === "es" && !noAlternateEs ? esUrl : enUrl;
  const ogLocale = language === "es" ? "es_US" : "en_US";
  const ogImage = image || DEFAULT_OG_IMAGE;

  const languages: Record<string, string> = {};
  if (esOnly) {
    languages.es = esUrl;
  } else {
    languages.en = enUrl;
    if (!noAlternateEs) {
      languages.es = esUrl;
      languages["x-default"] = enUrl;
    }
  }

  return {
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonical,
      type,
      siteName: "Amorelia Luxury Floral Gifts",
      locale: ogLocale,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@amorelialuxuryfloral",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Fórmula de TITLE de ficha de producto — decisión de Romuald (jul 2026):
 *
 *   Title = "[keyword] Miami – Same-Day Delivery | Amorelia Luxury Floral Gifts"
 *
 * Máx ~60 caracteres (operativamente 65 — los colores simples con marca
 * quedan en 61–65 y Romuald los da por buenos en sus propios ejemplos).
 * Si se pasa (colores largos), plan B EN ORDEN:
 *   1. quitar "| Amorelia Luxury Floral Gifts"
 *   2. quitar "Same-Day Delivery" / "Entrega el Mismo Día"
 * NUNCA se quita la keyword ni "Miami".
 */
const PRODUCT_TITLE_MAX = 65;

export function productSeoTitle(keyword: string, language: Language = "en"): string {
  const sameDay = language === "es" ? "Entrega el Mismo Día" : "Same-Day Delivery";
  const full = `${keyword} Miami – ${sameDay} | Amorelia Luxury Floral Gifts`;
  if (full.length <= PRODUCT_TITLE_MAX) return full;
  const noBrand = `${keyword} Miami – ${sameDay}`;
  if (noBrand.length <= PRODUCT_TITLE_MAX) return noBrand;
  return `${keyword} Miami`;
}
