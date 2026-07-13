import type { Metadata } from "next";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import BouquetBuilderClient from "@/components/builder/BouquetBuilderClient";
import ProductRatingBar from "@/components/product/ProductRatingBar";
import { buildMetadata } from "@/lib/seo";
import { getTranslator } from "@/i18n";

/**
 * /es/bouquets/personalizar — ES twin of the custom bouquet builder page.
 * Same slug in both languages ("personalizar") → hreflang pair is automatic.
 */

export function generateMetadata(): Metadata {
  const { t } = getTranslator("es");
  return buildMetadata({
    title: t("seo.bouquetBuilder.title"),
    description: t("seo.bouquetBuilder.description"),
    path: "/bouquets/personalizar",
    language: "es",
  });
}

export default function BouquetBuilderPageEs() {
  const { t } = getTranslator("es");

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", url: "https://amorelialuxuryfloral.com/es" },
          { name: "Ramos", url: "https://amorelialuxuryfloral.com/es/bouquets" },
          { name: "Personalizador de Ramos", url: "https://amorelialuxuryfloral.com/es/bouquets/personalizar" },
        ])}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-primary font-body text-sm tracking-[0.3em] uppercase mb-2">{t("builder.customize")}</p>
            {/* Prueba social (★ 5.0 · Google · +70.000 atendidos) sobre el H1. */}
            <div className="mb-4 flex justify-center">
              <ProductRatingBar language="es" align="center" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">
              {t("builder.title")}
            </h1>
          </div>

          <div className="max-w-4xl mx-auto space-y-10">
            {/* Product Image (server-rendered, same markup as the SPA) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-2">
              <img
                src="https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1920&v=1777440449"
                srcSet="https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=640&v=1777440449 640w, https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1024&v=1777440449 1024w, https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1440&v=1777440449 1440w, https://cdn.shopify.com/s/files/1/0979/1671/5140/files/FOTO_DE_PORTADA.webp?width=1920&v=1777440449 1920w"
                sizes="100vw"
                width={1920}
                height={1080}
                alt="Ramo personalizado"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Configurator sections (client) */}
            <BouquetBuilderClient language="es" />
          </div>
        </div>
      </div>
    </div>
  );
}
