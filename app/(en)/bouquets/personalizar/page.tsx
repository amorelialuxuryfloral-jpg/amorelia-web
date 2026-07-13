import type { Metadata } from "next";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import BouquetBuilderClient from "@/components/builder/BouquetBuilderClient";
import ProductRatingBar from "@/components/product/ProductRatingBar";
import { buildMetadata } from "@/lib/seo";
import { getTranslator } from "@/i18n";

/**
 * /bouquets/personalizar — custom bouquet builder (SPA's BouquetBuilder,
 * ported 1:1). The H1 + intro label + hero image are server-rendered so the
 * response ships real HTML; the interactive configurator (colors, paper,
 * sizes, extras, AI preview, delivery) lives in BouquetBuilderClient.
 *
 * Same slug in ES ("personalizar") → no pathEs needed for hreflang.
 */

export function generateMetadata(): Metadata {
  const { t } = getTranslator("en");
  return buildMetadata({
    title: t("seo.bouquetBuilder.title"),
    description: t("seo.bouquetBuilder.description"),
    path: "/bouquets/personalizar",
  });
}

export default function BouquetBuilderPage() {
  const { t } = getTranslator("en");

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://amorelialuxuryfloral.com" },
          { name: "Bouquets", url: "https://amorelialuxuryfloral.com/bouquets" },
          { name: "Custom Bouquet Builder", url: "https://amorelialuxuryfloral.com/bouquets/personalizar" },
        ])}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">{t("builder.customize")}</p>
            {/* Social proof (★ 5.0 · Google · 70,000+ served) above the H1 — same
                REAL rating block used across the product fichas. */}
            <div className="mb-4 flex justify-center">
              <ProductRatingBar language="en" align="center" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              {t("builder.title")}
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image (server-rendered, same markup as the SPA) */}
            <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-2">
              <img
                src="https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1920&v=1777440449"
                srcSet="https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=640&v=1777440449 640w, https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1024&v=1777440449 1024w, https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1440&v=1777440449 1440w, https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1920&v=1777440449 1920w"
                sizes="100vw"
                width={1920}
                height={1080}
                alt="Custom bouquet"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Configurator sections (client) — rendered as direct children of
                this space-y-10 wrapper, same DOM structure as the SPA. */}
            <BouquetBuilderClient language="en" />
          </div>
        </div>
      </div>
    </div>
  );
}
