import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Plane, DollarSign, Package } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { cityPages } from "@/lib/cityPagesData";
import { buildMetadata } from "@/lib/seo";
import { localizePath, type Language } from "@/i18n";

/**
 * /flower-delivery + /es/envio-de-flores — nationwide FedEx city index
 * (SPA port, pages/CityIndexPage.tsx). Native slugs per language.
 */

export function cityIndexMetadata(language: Language): Metadata {
  const isEs = language === "es";
  return buildMetadata({
    title: isEs
      ? "Envío de Flores a Todo EE.UU. | Rosas por FedEx | Amorelia Luxury Floral Gifts"
      : "Nationwide Flower Delivery | Roses Shipped via FedEx | Amorelia Luxury Floral Gifts",
    description: isEs
      ? "Enviamos rosas frescas a 35 ciudades de EE.UU. por FedEx desde Miami. Caja de lujo aislada, llegada en 1–2 días hábiles."
      : "We ship fresh roses to 35 US cities via FedEx from Miami. Insulated luxury box, arrival in 1–2 business days.",
    path: "/flower-delivery",
    pathEs: "/envio-de-flores",
    language,
  });
}

export default function CityIndexView({ language }: { language: Language }) {
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);
  const sorted = [...cityPages].sort((a, b) => a.name.localeCompare(b.name));

  const itemList = itemListSchema(
    sorted.map((c) => ({
      name: isEs ? `Envío de flores a ${c.name}` : `Flower delivery to ${c.name}`,
      url: isEs
        ? `https://amorelialuxuryfloral.com/es/envio-de-flores/${c.slugEs}`
        : `https://amorelialuxuryfloral.com/flower-delivery/${c.slug}`,
    })),
    isEs ? "Ciudades de envío" : "Shipping cities",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: isEs ? "Inicio" : "Home", url: isEs ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com" },
    {
      name: isEs ? "Envío de Flores" : "Flower Delivery",
      url: isEs ? "https://amorelialuxuryfloral.com/es/envio-de-flores" : "https://amorelialuxuryfloral.com/flower-delivery",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[itemList, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs
            items={[
              { label: isEs ? "Inicio" : "Home", to: l("/") },
              { label: isEs ? "Envío de Flores" : "Flower Delivery" },
            ]}
          />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            {isEs ? "Envío de Flores a Todo EE.UU." : "Nationwide Flower Delivery"}
          </h1>
          {/* CORRECCIONES punto 22: keyword intro + H2 morphology (how FedEx
              shipping works · cost · insulated box) BEFORE the city cluster —
              the hub was a bare index with 0 H2/H3. All facts are the
              validated shipping-program facts (cityPagesData / delivery). */}
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            {isEs
              ? "Envío de flores a todo EE. UU.: rosas frescas enviadas por FedEx desde nuestro taller de Miami a 35 ciudades, en nuestra caja de lujo aislada con cold packs. Elige tu ciudad para ver tránsito, hub FedEx y barrios cubiertos."
              : "Fresh roses shipped nationwide via FedEx from our Miami atelier to 35 US cities, in our insulated luxury box with cold packs. Pick your city to see transit, FedEx hub and neighborhoods covered."}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-cream rounded-lg p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Plane className="w-5 h-5 text-primary" />
                {isEs ? "Cómo funciona el envío FedEx" : "How FedEx shipping works"}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {isEs
                  ? "Tu ramo se monta a mano en Miami el día del envío y viaja overnight con FedEx Express hasta el hub de tu ciudad. La llegada típica es en 1–2 días hábiles, con seguimiento de FedEx puerta a puerta."
                  : "Your bouquet is hand-arranged in Miami the day it ships and travels overnight with FedEx Express to your city's hub. Typical arrival is 1–2 business days, with door-to-door FedEx tracking."}
              </p>
            </div>
            <div className="bg-cream rounded-lg p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                {isEs ? "Cuánto cuesta el envío" : "What shipping costs"}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {isEs
                  ? "Las tarifas reales de FedEx se calculan en vivo en el checkout según tu dirección — sin tarifas planas infladas. Dentro de Miami (hasta 90 millas) entregan nuestros propios repartidores: $25 las primeras 5 millas y $1.60 por milla adicional."
                  : "Real FedEx rates are calculated live at checkout for your exact address — no inflated flat fees. Within Miami (up to 90 miles) our own drivers deliver: $25 for the first 5 miles and $1.60 per additional mile."}
              </p>
            </div>
            <div className="bg-cream rounded-lg p-6">
              <h2 className="font-display text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {isEs ? "La caja de lujo aislada" : "The insulated luxury box"}
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                {isEs
                  ? "Cada envío nacional viaja en nuestra caja de lujo aislada con cold packs, diseñada para que las rosas lleguen frías, hidratadas y con los tallos firmes tras el vuelo desde Miami."
                  : "Every nationwide order travels in our insulated luxury box with cold packs, designed so the roses arrive cold, hydrated and tight-stemmed after the flight from Miami."}
              </p>
            </div>
          </div>

          <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-4">
            {isEs ? "Las 35 ciudades a las que enviamos" : "The 35 cities we ship to"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sorted.map((c) => (
              <Link
                key={c.slug}
                href={isEs ? `/es/envio-de-flores/${c.slugEs}` : `/flower-delivery/${c.slug}`}
                className="group flex items-start gap-2 bg-cream/50 hover:bg-cream rounded-md px-3 py-3 transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-body text-sm text-foreground group-hover:text-primary transition-colors">{c.name}</p>
                  <p className="font-body text-xs text-muted-foreground">{c.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
