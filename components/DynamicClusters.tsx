import Link from "next/link";
import { newestBouquets, colorClusters } from "@/lib/dynamicClusters";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * Dynamic cross-cluster block — auto-updating internal links (Server
 * Component: the links are real <a> in the HTML).
 *
 * Romuald — Armada SEO 2025:
 *  - Módulo 29 Web Rango A (Decalaveras) clase 13 "Clusters dinámicos" +
 *    clase 10 "Optimización SEO de clusters orbital": un solo producto nuevo
 *    refresca los bloques de "novedades" y "por color" en TODAS las páginas que
 *    los renderizan → freshness masivo y más crawl budget.
 *  - Módulo 12 "Prepara tu web para monetizar" clase 01: en MÓVIL los enlaces de
 *    cluster van DENTRO del body (un sidebar se cae al fondo en móvil y nadie
 *    clica), para maximizar páginas-vistas-por-sesión.
 *
 * Los datos los DERIVA `dynamicClusters.ts` del catálogo; este componente solo
 * pinta. Nada de precios, carrito, checkout ni tracking aquí.
 */

interface Props {
  language?: Language;
  /** Product id to exclude from the "newest" block (used on product pages). */
  excludeId?: string;
  /** How many newest products to surface. */
  limit?: number;
  /** Hide the by-color block when the page already renders its own color cluster (e.g. the home). */
  showColors?: boolean;
}

const DynamicClusters = ({ language = "en", excludeId, limit = 8, showColors = true }: Props) => {
  const { t } = getTranslator(language);
  const newest = newestBouquets(limit, excludeId);
  const colors = showColors ? colorClusters() : [];
  if (newest.length === 0 && colors.length === 0) return null;

  const colorTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/bouquets/${slugEs}` : `/bouquets/${slug}`;

  return (
    // In-body cluster (NOT a sidebar) so it stays visible/clickable on mobile.
    <section className="container mx-auto px-6 max-w-5xl py-10 md:py-14 border-t border-border">
      {newest.length > 0 && (
        <div className={colors.length > 0 ? "mb-10" : ""}>
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {t("clusters.newest")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {newest.map((p) => (
              <Link
                key={p.id}
                href={localizePath(p.to, language)}
                className="px-3 md:px-4 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent font-body text-xs md:text-sm transition-all"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <h2 className="font-display text-sm uppercase tracking-wider text-muted-foreground mb-4">
            {t("clusters.byColor")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => (
              <Link
                key={c.color}
                href={colorTo(c.slug, c.slugEs)}
                className="px-3 md:px-4 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-accent font-body text-xs md:text-sm transition-all"
              >
                {t(c.ns)}{" "}
                <span className="text-muted-foreground">({c.count})</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default DynamicClusters;
