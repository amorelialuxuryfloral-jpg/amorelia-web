import type { Metadata } from "next";
import LazyMapEmbed from "@/components/LazyMapEmbed";
import Link from "next/link";
import { Truck, Store, MapPin, Clock, DollarSign, ArrowRight, Navigation } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, serviceSchema, localBusinessSchema } from "@/components/JsonLd";
import { GBP_EMBED_SRC, GBP_CID_URL, NAP_ADDRESS } from "@/lib/constants";
import { BARRIO_LINKS } from "@/lib/landingPagesData";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * /delivery + /es/delivery — informational delivery page (SPA port). Real
 * published facts only: $25 flat 0–5 mi, $1.60/mile up to 90 mi, min 2h prep,
 * same-day before 3PM, free pickup at 7257 NW 12th St, FedEx nationwide.
 * Map = GBP listing embed (SPEC §2.7). Links UP to the transactional
 * /collections/same-day-delivery money page (SPEC §4 link direction).
 * ES copy for the same-day/FedEx blocks comes from the validated
 * sameDayCollectionData Spanish strings (same concepts, same source).
 */

export function deliveryMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("seo.delivery.title"),
    description: t("seo.delivery.description"),
    path: "/delivery",
    language,
  });
}

export default function DeliveryView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);
  const base = isEs ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com";
  const sameDayPath = isEs ? "/es/collections/entrega-el-mismo-dia" : "/collections/same-day-delivery";
  const citiesPath = isEs ? "/es/envio-de-flores" : "/flower-delivery";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t("nav.home"), url: base },
            { name: t("nav.delivery"), url: `${base}/delivery` },
          ]),
          localBusinessSchema(),
          serviceSchema(),
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: t("nav.home"), to: l("/") }, { label: t("nav.delivery") }]} />
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-4">
            {t("deliveryPage.title")}
          </h1>
          <p className="text-center font-body text-sm text-primary font-semibold mb-10 tracking-wider uppercase">
            {t("deliveryPage.orderBefore")}
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Delivery */}
            <div className="bg-cream rounded-lg p-8">
              <div className="flex items-center gap-3 mb-5">
                <Truck className="w-6 h-6 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">{t("deliveryPage.homeDelivery")}</h2>
              </div>
              <div className="space-y-4 font-body text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <DollarSign className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{t("deliveryPage.flatRate")}</p>
                    <p>{t("deliveryPage.perMile")}</p>
                    <p className="text-xs italic mt-1">{t("deliveryPage.example")}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p>{t("deliveryPage.minPrep")}</p>
                    <p>Mon–Fri 8AM–7PM | Sat 8AM–5PM | Sun Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pickup */}
            <div className="bg-cream rounded-lg p-8">
              <div className="flex items-center gap-3 mb-5">
                <Store className="w-6 h-6 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">{t("deliveryPage.freePickup")}</h2>
              </div>
              <div className="space-y-4 font-body text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">7257 NW 12th St</p>
                    <p>Miami, FL 33126</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p>{t("deliveryPage.ready")}</p>
                    <p>Mon–Fri 8AM–7PM | Sat 8AM–5PM | Sun Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Same-day money page — link direction: info page → transactional (SPEC §4) */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 mb-12 text-center">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
              {isEs ? "¿Necesitas flores a domicilio hoy mismo?" : "Need flowers delivered today?"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-4">
              {isEs
                ? "Cada ramo de nuestra colección de entrega el mismo día se monta a mano esa misma mañana y se entrega por todo Miami antes de la noche — pide antes de las 3PM."
                : "Every bouquet in our same-day collection is hand-tied the same morning and delivered across Miami before the evening — order before 3PM."}
            </p>
            <Link
              href={sameDayPath}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm hover:bg-primary/90 transition-colors"
            >
              {isEs ? "Ver flores a domicilio el mismo día" : "Shop same-day flower delivery"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Delivery areas — the 7 validated barrio pages (real <a>, punto 14/27) */}
          <div className="mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
              {isEs ? "Zonas de entrega el mismo día en Miami" : "Same-day delivery areas in Miami"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-4">
              {isEs
                ? "Entregamos en todo Miami-Dade hasta 90 millas. Estas son las zonas con página propia de entrega:"
                : "We deliver across Miami-Dade up to 90 miles. These are the delivery areas with their own page:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {BARRIO_LINKS.map((b) => (
                <Link
                  key={b.slug}
                  href={`/${b.slug}`}
                  className="px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground font-body text-xs md:text-sm transition-all"
                >
                  {b.label.replace(/^Flower Delivery /, "")}
                </Link>
              ))}
              <Link
                href={isEs ? "/es" : "/"}
                className="px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-body text-xs md:text-sm font-semibold transition-all"
              >
                {isEs ? "Floristería en Miami" : "Flower Shop in Miami"}
              </Link>
            </div>
          </div>

          {/* Nationwide FedEx */}
          <div className="bg-card border border-border rounded-lg p-6 md:p-8 mb-12">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-2">
              {isEs ? "¿Fuera de Miami? Enviamos a todo el país con FedEx" : "Outside Miami? We ship nationwide with FedEx"}
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-4">
              {isEs
                ? "Más allá de 90 millas tus rosas viajan overnight en nuestra caja de lujo aislada con cold packs, a cualquier punto de EE. UU. Las tarifas reales de FedEx se calculan en vivo en el checkout."
                : "Beyond 90 miles your roses travel overnight in our insulated luxury box with cold packs, anywhere in the US. Real FedEx rates are calculated live at checkout."}
            </p>
            <Link href={citiesPath} className="font-body text-sm text-primary hover:underline">
              {isEs ? "Ver las 35 ciudades a las que enviamos →" : "See all 35 cities we ship to →"}
            </Link>
          </div>

          {/* Map — GBP listing embed (SPEC §2.7) + CID directions link (punto 19) */}
          <div className="mb-12">
            <div className="overflow-hidden rounded-lg">
              <LazyMapEmbed
                title={isEs ? "Zona de entrega de Amorelia Luxury Floral Gifts Miami" : "Amorelia Luxury Floral Gifts Miami delivery area"}
                src={GBP_EMBED_SRC}
                className="block h-[300px] w-full rounded-lg align-top md:h-[420px]"
                placeholderLabel={isEs ? "Mapa" : "Map"}
              />
            </div>
            <p className="font-body text-sm text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4 text-primary" /> Amorelia Luxury Floral Gifts — {NAP_ADDRESS}</span>
              <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                <Navigation className="w-4 h-4" /> {t("footer.getDirections")}
              </a>
            </p>
          </div>

          <div className="text-center">
            <p className="font-body text-xs text-muted-foreground mb-6">{t("deliveryPage.internationalShipping")}</p>
            <Link
              href={l("/bouquets")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
            >
              {t("deliveryPage.orderNow")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
