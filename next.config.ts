import type { NextConfig } from "next";
import path from "path";
import { BOUQUET_SLUGS } from "./lib/bouquetSlugs";
import { retiredBlogSlugs } from "./lib/blogData";

/**
 * Redirects — full migration of the live site's edge rules (public/_redirects,
 * 288 auto-generated bouquet rules) + the SPA router aliases + the SPEC §3
 * cannibalization fusions. Everything is a REAL 301/308 at the edge; the
 * dynamic route resolvers stay as a backstop for anything not enumerable here
 * (bq-* ids, unknown Shopify handles, ES/EN slugs swapped between trees).
 */

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

/**
 * The 288 legacy bouquet rules (48 products × 6 patterns), the same mapping
 * as the live public/_redirects (generated from bouquetSlugs):
 *   /products/<handle>            → /bouquets/<slug>
 *   /es/products/<handle>         → /es/bouquets/<slugEs>
 *   /bouquets/all/<handle>        → /bouquets/<slug>
 *   /es/bouquets/all/<handle>     → /es/bouquets/<slugEs>
 *   /bouquets/<handle>            → /bouquets/<slug>
 *   /es/bouquets/<handle>         → /es/bouquets/<slugEs>
 */
const bouquetLegacyRedirects: Redirect[] = Object.entries(BOUQUET_SLUGS).flatMap(
  ([handle, m]) => {
    const rules: Redirect[] = [
      { source: `/products/${handle}`, destination: `/bouquets/${m.slug}`, permanent: true },
      { source: `/es/products/${handle}`, destination: `/es/bouquets/${m.slugEs}`, permanent: true },
      { source: `/bouquets/all/${handle}`, destination: `/bouquets/${m.slug}`, permanent: true },
      { source: `/es/bouquets/all/${handle}`, destination: `/es/bouquets/${m.slugEs}`, permanent: true },
    ];
    // AMORELIA: slug === handle (y slugEs === handle), así que estas dos reglas
    // serían /bouquets/<handle> → /bouquets/<handle> = BUCLE 308. Solo se añaden
    // si el slug difiere del handle (como en Charls), para no romper la ficha.
    if (m.slug !== handle) {
      rules.push({ source: `/bouquets/${handle}`, destination: `/bouquets/${m.slug}`, permanent: true });
    }
    if (m.slugEs !== handle) {
      rules.push({ source: `/es/bouquets/${handle}`, destination: `/es/bouquets/${m.slugEs}`, permanent: true });
    }
    return rules;
  },
);

/** Retired blog posts (SPA blogData) → the blog index, both trees. */
const retiredBlogRedirects: Redirect[] = retiredBlogSlugs.flatMap((slug) => [
  { source: `/blog/${slug}`, destination: "/blog", permanent: true },
  { source: `/es/blog/${slug}`, destination: "/es/blog", permanent: true },
]);

const nextConfig: NextConfig = {
  // Pin the workspace root (a stray lockfile exists in the home directory).
  turbopack: {
    root: path.join(__dirname),
  },

  async redirects() {
    return [
      // ── SPEC §3 — cannibalization fusions (one keyword = one URL) ──
      {
        source: "/valentines-day-flowers-miami",
        destination: "/collections/valentines-flowers",
        permanent: true,
      },
      {
        source: "/mothers-day-bouquets-miami",
        destination: "/mothers-day",
        permanent: true,
      },
      {
        source: "/quinceanera-bouquets-miami",
        destination: "/collections/quinceanera-bouquet",
        permanent: true,
      },
      // ES twins of the fused landings (the landings were EN-only canonicals).
      {
        source: "/es/valentines-day-flowers-miami",
        destination: "/collections/valentines-flowers",
        permanent: true,
      },
      {
        source: "/es/mothers-day-bouquets-miami",
        destination: "/es/mothers-day",
        permanent: true,
      },
      {
        source: "/es/quinceanera-bouquets-miami",
        destination: "/collections/quinceanera-bouquet",
        permanent: true,
      },

      // ── Plan directores §3 — funeral: página propia sustituye a la colección ──
      // /collections/sympathy-flowers (+ES arreglos-funebres) fusionada en la
      // nueva money page local (una keyword = una URL). Copy en
      // lib/retiredOccasionDrafts.ts.
      { source: "/collections/sympathy-flowers", destination: "/funeral-sympathy-flowers-miami", permanent: true },
      { source: "/collections/arreglos-funebres", destination: "/funeral-sympathy-flowers-miami", permanent: true },
      { source: "/es/collections/arreglos-funebres", destination: "/es/flores-funeral-miami", permanent: true },
      { source: "/es/collections/sympathy-flowers", destination: "/es/flores-funeral-miami", permanent: true },
      // Cross-language twins of the new pair.
      { source: "/flores-funeral-miami", destination: "/funeral-sympathy-flowers-miami", permanent: true },
      { source: "/es/funeral-sympathy-flowers-miami", destination: "/es/flores-funeral-miami", permanent: true },

      // ── Producto retirado — rosas eternas / preserved roses ──
      // Amorelia NO vende rosas preservadas (confirmado 2026-07-11): las páginas
      // se retiraron y todos los alias (incl. los slugs SPA nunca ruteados)
      // 301an a la categoría real más cercana: rosas frescas (/bouquets).
      { source: "/preserved-roses-in-a-box", destination: "/bouquets", permanent: true },
      { source: "/es/preserved-roses-in-a-box", destination: "/es/bouquets", permanent: true },
      { source: "/rosas-eternas", destination: "/es/bouquets", permanent: true },
      { source: "/es/rosas-eternas", destination: "/es/bouquets", permanent: true },
      { source: "/preserved-roses", destination: "/bouquets", permanent: true },
      { source: "/es/preserved-roses", destination: "/es/bouquets", permanent: true },
      { source: "/collections/preserved-roses", destination: "/bouquets", permanent: true },
      { source: "/es/collections/preserved-roses", destination: "/es/bouquets", permanent: true },
      { source: "/collections/rosas-eternas", destination: "/bouquets", permanent: true },
      { source: "/es/collections/rosas-eternas", destination: "/es/bouquets", permanent: true },

      // ── Plan directores §7 — wedding: página LEAD sustituye a la colección ──
      // /collections/wedding-flowers (+ES ramo-de-novia) fusionada en la nueva
      // lead page EN-only (SERP = servicio/lead, no carrito). Copy retirado en
      // lib/retiredOccasionDrafts.ts.
      { source: "/collections/wedding-flowers", destination: "/wedding-flowers-miami", permanent: true },
      { source: "/collections/ramo-de-novia", destination: "/wedding-flowers-miami", permanent: true },
      { source: "/es/collections/ramo-de-novia", destination: "/wedding-flowers-miami", permanent: true },
      { source: "/es/collections/wedding-flowers", destination: "/wedding-flowers-miami", permanent: true },
      { source: "/es/wedding-flowers-miami", destination: "/wedding-flowers-miami", permanent: true },

      // ── Plan directores §6 — cola ES buchón/rosas ──
      // Root-level aliases from the plan → their canonical pages.
      { source: "/ramo-de-rosas", destination: "/es/ramo-de-rosas", permanent: true },
      { source: "/ramo-buchon", destination: "/collections/ramo-buchon", permanent: true },
      { source: "/es/ramo-buchon", destination: "/es/collections/ramo-buchon", permanent: true },

      // ── CORRECCIONES punto 16 — SOLO Wynwood (0 búsquedas) degradado ──
      // Coral Gables (110) / Aventura (90) / Kendall (70) were RESTORED
      // (punto 35 — Dani's exam only degrades Wynwood). Draft copy for
      // Wynwood preserved in lib/degradedNeighborhoodDrafts.ts.
      // ── Local hub consolidated into the HOME (Dani's pre-launch verdict) ──
      // /flower-shop-miami and the home shared the same intent ("Miami florist";
      // confirmed by the live SERP) → cannibalization. The home now owns the
      // head term ("Miami Flower Shop"), so the hub 301s to it. The 7 barrio
      // pages stay; their directory lives on the home ("Neighborhoods" section).
      { source: "/flower-shop-miami", destination: "/", permanent: true },
      { source: "/es/floristeria-miami", destination: "/es", permanent: true },
      { source: "/flower-delivery-wynwood", destination: "/", permanent: true },
      { source: "/es/flower-delivery-wynwood", destination: "/es", permanent: true },

      // ── Legacy aliases carried over from the SPA router (301s) ──
      // Old builder URL.
      { source: "/bouquet-builder", destination: "/bouquets/personalizar", permanent: true },
      { source: "/es/bouquet-builder", destination: "/es/bouquets/personalizar", permanent: true },
      // Menu/legacy link → the Mother's Day collection lives at /mothers-day.
      { source: "/bouquets/mothers-day", destination: "/mothers-day", permanent: true },
      { source: "/es/bouquets/mothers-day", destination: "/es/mothers-day", permanent: true },
      // Legacy MD ficha URLs → canonical two-segment ficha.
      { source: "/mothers-day/:handle", destination: "/bouquets/mothers-day/:handle", permanent: true },
      { source: "/es/mothers-day/:handle", destination: "/es/bouquets/mothers-day/:handle", permanent: true },
      // Legacy room decor id.
      {
        source: "/room-decors/rd-deluxe-love",
        destination: "/room-decors/deluxe-love-package",
        permanent: true,
      },
      {
        source: "/es/room-decors/rd-deluxe-love",
        destination: "/es/room-decors/deluxe-love-package",
        permanent: true,
      },

      // ── Cross-language index slugs (SPA mounted both in both trees) ──
      { source: "/collections/ocasiones", destination: "/collections/occasions", permanent: true },
      { source: "/collections/flores", destination: "/collections/flowers", permanent: true },

      // ── Legacy /categoria pages (SPA "coming soon" catalog, noindex) ──
      { source: "/categoria/:slug", destination: "/bouquets", permanent: true },
      { source: "/categoria/:slug/:productId", destination: "/bouquets", permanent: true },
      { source: "/es/categoria/:slug", destination: "/es/bouquets", permanent: true },
      { source: "/es/categoria/:slug/:productId", destination: "/es/bouquets", permanent: true },

      // ── Migración SPA — 25 colecciones de TIPO DE FLOR con 0 productos ──
      // (verificado por API: count=0; SPEC = no páginas transaccionales vacías).
      // 301/308 a la página VIVA más relevante. Sin cadenas (destinos terminales).
      // Criterio Romuald: 301 a la relevante (A·M22·C02) + romper cadenas (A·M32·C07).

      // EN — bodas y ramo de dinero → money pages reales
      { source: "/collections/bridal-bouquets", destination: "/wedding-flowers-miami", permanent: true },
      { source: "/collections/money-bouquet", destination: "/collections/ramo-buchon", permanent: true },
      // EN — tipos de flor → hub de flores
      { source: "/collections/orchids", destination: "/collections/flowers", permanent: true },
      { source: "/collections/tulips", destination: "/collections/flowers", permanent: true },
      { source: "/collections/sunflowers", destination: "/collections/flowers", permanent: true },
      { source: "/collections/peonies", destination: "/collections/flowers", permanent: true },
      { source: "/collections/lilies", destination: "/collections/flowers", permanent: true },
      { source: "/collections/carnations", destination: "/collections/flowers", permanent: true },
      { source: "/collections/daisies", destination: "/collections/flowers", permanent: true },
      { source: "/collections/gerberas", destination: "/collections/flowers", permanent: true },
      { source: "/collections/hydrangeas", destination: "/collections/flowers", permanent: true },
      // EN — suscripción = intención de compra → catálogo (patrón preserved-roses)
      { source: "/collections/flower-subscription", destination: "/bouquets", permanent: true },

      // ES — bodas → money page EN-only, DIRECTO (evita cadena vía /es/..., = línea 121)
      { source: "/es/collections/ramos-de-novia", destination: "/wedding-flowers-miami", permanent: true },
      { source: "/es/collections/ramo-de-dinero", destination: "/es/collections/ramo-buchon", permanent: true },
      // ES — tipos de flor → hub de flores ES
      { source: "/es/collections/orquideas", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/tulipanes", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/girasoles", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/peonias", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/liliums", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/claveles", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/margaritas", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/gerberas", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/hortensias", destination: "/es/collections/flores", permanent: true },
      { source: "/es/collections/ranunculos", destination: "/es/collections/flores", permanent: true },
      // ES — suscripción = intención de compra → catálogo ES
      { source: "/es/collections/suscripcion-de-flores", destination: "/es/bouquets", permanent: true },

      // ── Retired blog posts ──
      ...retiredBlogRedirects,

      // ── 288 legacy bouquet URL rules (public/_redirects parity) ──
      ...bouquetLegacyRedirects,
    ];
  },
};

export default nextConfig;
