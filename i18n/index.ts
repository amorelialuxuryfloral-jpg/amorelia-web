/**
 * i18n — pure, SSR-friendly translator.
 *
 * The SPA used a React context (LanguageProvider) bound to the URL. In the
 * App Router the language is known from the route segment (`/` = en,
 * `/es/...` = es), so components — server AND client — simply receive the
 * language and call `getTranslator(lang)`. No context, no hydration risk.
 *
 * Translations are copied verbatim from the SPA (validated copy — never
 * invent or machine-translate here).
 */
import { en } from "./translations/en";
import { es } from "./translations/es";

export type Language = "en" | "es";

const translations: Record<Language, Record<string, unknown>> = { en, es };

/** Strip `/es` prefix from a path. Returns the EN-equivalent path. */
export const stripLangPrefix = (pathname: string): string => {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3);
  return pathname;
};

/** Detect language from a pathname. */
export const detectLangFromPath = (pathname: string): Language =>
  pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";

/** Build a URL for the given path in the given language. `path` should be EN-style (no /es prefix). */
export const localizePath = (path: string, lang: Language): string => {
  const clean = stripLangPrefix(path);
  if (lang === "en") return clean;
  if (clean === "/") return "/es";
  return `/es${clean}`;
};

const lookup = (lang: Language, key: string): unknown => {
  const keys = key.split(".");
  let value: unknown = translations[lang];
  for (const k of keys) {
    value = (value as Record<string, unknown> | undefined)?.[k];
    if (value === undefined) {
      // Fall back to EN, then to the key itself.
      let fallback: unknown = translations.en;
      for (const fk of keys) fallback = (fallback as Record<string, unknown> | undefined)?.[fk];
      return fallback ?? key;
    }
  }
  return value ?? key;
};

export interface Translator {
  language: Language;
  t: (key: string) => string;
  tRaw: (key: string) => unknown;
}

export const getTranslator = (language: Language = "en"): Translator => ({
  language,
  t: (key: string) => {
    const result = lookup(language, key);
    return typeof result === "string" ? result : key;
  },
  tRaw: (key: string) => lookup(language, key),
});
