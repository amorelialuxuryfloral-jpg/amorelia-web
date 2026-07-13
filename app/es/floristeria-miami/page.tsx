import type { Metadata } from "next";
import LazyMapEmbed from "@/components/LazyMapEmbed";
import Link from "next/link";
import { ArrowRight, MapPin, Truck, Store, Clock, Sparkles, Phone, Navigation } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { localBusinessSchema, faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import { GBP_EMBED_SRC, GBP_CID_URL, NAP_ADDRESS, NAP_PHONE_DISPLAY, NAP_PHONE_TEL } from "@/lib/constants";
import { BARRIO_LINKS } from "@/lib/landingPagesData";
import { buildMetadata } from "@/lib/seo";

/**
 * /es/floristeria-miami — hub local ES (CORRECCIONES punto 30).
 * Keywords reales (Google Ads 2026-07-11): "floristeria miami" 390 nacional /
 * 170 Miami-geo · "floreria miami" 210. Contenido ÚNICO en español (no
 * traducción calcada del hub EN); hreflang recíproco con /flower-shop-miami.
 * El near-me ES (floristeria near me 1.900) se gana en la FICHA GBP, no aquí —
 * por eso esta página es deliberadamente contenida (sin inflar).
 */

export const revalidate = 3600;

const PATH_ES = "/floristeria-miami";
const SELF_URL = `https://amorelialuxuryfloral.com/es${PATH_ES}`;

const FAQS = [
  {
    question: "¿Dónde está la floristería y qué horario tienen?",
    answer:
      "Estamos en 7257 NW 12th St, Miami, FL 33126. Abrimos de lunes a viernes de 8AM a 7PM y los sábados de 8AM a 5PM (domingos cerrado). Puedes recoger tu pedido gratis en tienda o pedir entrega a domicilio.",
  },
  {
    question: "¿Hacen entregas de flores a domicilio en Miami el mismo día?",
    answer:
      "Sí. Entregamos el mismo día en todo Miami-Dade hasta 90 millas si pides antes de las 3PM hora de Miami, con un mínimo de 2 horas de preparación. La tarifa es de $25 las primeras 5 millas y $1.60 por milla adicional.",
  },
  {
    question: "¿Atienden en español?",
    answer:
      "Sí, todo nuestro equipo es bilingüe. Puedes hacer tu pedido por teléfono, por la web o visitándonos en la tienda — en español o en inglés, como prefieras.",
  },
  {
    question: "¿Qué tipo de ramos hacen?",
    answer:
      "Cada ramo se monta a mano en nuestro taller de Miami: ramos de rosas de 50 a 200 tallos en cualquier color, ramo buchón, arreglos para funeral, quinceañeras, cumpleaños y bodas. También puedes diseñar tu ramo a medida con vista previa de IA.",
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: "Floristería en Miami | Florería con Entrega el Mismo Día | Amorelia Luxury Floral Gifts",
    description:
      "Floristería en Miami con taller propio: ramos de rosas de 50 a 200 tallos, ramo buchón, arreglos y flores a domicilio el mismo día. Atención en español. 7257 NW 12th St.",
    path: "/flower-shop-miami",
    pathEs: PATH_ES,
    language: "es",
  });
}

export default function FloristeriaMiamiPage() {
  const localBusiness = {
    ...localBusinessSchema(),
    areaServed: { "@type": "City", name: "Miami" },
  };
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Floristería en Miami",
    serviceType: "Flower delivery",
    provider: { "@id": "https://amorelialuxuryfloral.com/#localbusiness" },
    areaServed: { "@type": "City", name: "Miami" },
    url: SELF_URL,
    offers: { "@type": "Offer", price: "25.00", priceCurrency: "USD" },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          localBusiness,
          serviceLd,
          faqSchema(FAQS),
          breadcrumbSchema([
            { name: "Inicio", url: "https://amorelialuxuryfloral.com/es" },
            { name: "Floristería en Miami", url: SELF_URL },
          ]),
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Floristería en Miami" }]} />
          <div className="max-w-3xl mx-auto">
            <h1 className="font-title-retro text-3xl md:text-5xl text-foreground mb-6">
              Floristería en Miami — Amorelia Luxury Floral Gifts
            </h1>
            <p className="text-muted-foreground font-body text-base md:text-lg leading-relaxed mb-12">
              Amorelia Luxury Floral Gifts es una floristería de Miami con taller propio: no somos un
              marketplace ni un servicio de intermediarios — cada ramo se diseña y se monta a
              mano en nuestro atelier de la NW 12th St, con rosas que llegan frescas cada semana
              de cultivadores premium. Si buscas una florería en Miami que atienda en español,
              entregue el mismo día y trabaje el detalle como se trabaja en casa, somos nosotros.
            </p>

            {/* Por qué nosotros */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Tu florería en Miami, con taller propio
              </h2>
              <p className="font-body text-base text-foreground leading-relaxed">
                La mayoría de las flores que se entregan en Miami vienen de servicios que pasan el
                pedido a la floristería disponible más barata — y lo que llega muchas veces no se
                parece a la foto. Nosotros trabajamos al revés: cada pedido pasa por nuestro
                taller, donde un equipo bilingüe monta el arreglo a mano el mismo día del envío.
                Ramos de 50 a 200 rosas en cualquier color, con acabado natural, glitter o
                pintado; ramo buchón; coronas y arreglos fúnebres; y centros para quinceañeras
                y bodas.
              </p>
            </section>

            {/* Barrios (cluster local — páginas EN canónicas) */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Barrios de Miami donde entregamos
              </h2>
              <p className="font-body text-sm text-muted-foreground mb-4">
                Entregamos en todo Miami-Dade. Estos barrios tienen página propia de entrega
                (Hialeah y Doral con atención bilingüe):
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {BARRIO_LINKS.map((b) => (
                  <div key={b.slug} className="flex items-start gap-2 bg-cream/50 rounded-md px-3 py-2">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <h3 className="font-body text-sm text-foreground font-normal">
                      <Link href={`/${b.slug}`} className="text-primary hover:underline">
                        {b.label.replace(/^Flower Delivery /, "")}
                      </Link>
                    </h3>
                  </div>
                ))}
              </div>
            </section>

            {/* Lo más pedido en español */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                Lo más pedido en nuestra floristería
              </h2>
              <ul className="space-y-2">
                {[
                  { label: "Ramo buchón — el ramo de rosas gigante", href: "/es/collections/ramo-buchon" },
                  { label: "Ramo de rosas — todos los colores", href: "/es/ramo-de-rosas" },
                  { label: "Flores para funeral y arreglos fúnebres", href: "/es/flores-funeral-miami" },
                  { label: "Ramos de cumpleaños", href: "/es/collections/flores-cumpleanos" },
                  { label: "Diseña tu ramo a medida (vista previa con IA)", href: "/es/bouquets/personalizar" },
                ].map((item) => (
                  <li key={item.href} className="flex items-start gap-2 font-body text-sm md:text-base text-foreground">
                    <span className="text-primary mt-1">•</span>
                    <Link href={item.href} className="text-primary hover:underline">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {/* Entrega */}
            <section className="mb-16 bg-card border border-border rounded-lg p-6">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" /> Flores a domicilio en Miami
              </h2>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
                Entregamos con repartidores propios en todo Miami-Dade hasta 90 millas: $25 las
                primeras 5 millas y $1.60 por milla adicional, calculado en vivo en el checkout.
                Mismo día si pides antes de las 3PM (mínimo 2 horas de preparación). Fuera de
                Miami, enviamos a todo EE. UU. por FedEx en caja aislada.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">$25</p>
                    <p className="font-body text-xs text-muted-foreground">Primeras 0–5 millas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">2 horas</p>
                    <p className="font-body text-xs text-muted-foreground">Preparación mínima</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                  <Store className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="font-body text-xs font-semibold text-foreground">Recogida gratis</p>
                    <p className="font-body text-xs text-muted-foreground">7257 NW 12th St</p>
                  </div>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground mt-4">
                <Link href="/es/delivery" className="text-primary hover:underline">
                  Zonas, horarios y tarifas de entrega
                </Link>{" "}
                · Lun–Vie 8AM–7PM · Sáb 8AM–5PM · Dom cerrado
              </p>
            </section>

            {/* FAQ */}
            <section className="mb-16">
              <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
                Preguntas frecuentes
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq) => (
                  <div key={faq.question} className="border border-border rounded-xl p-5">
                    <h3 className="font-display text-base md:text-lg font-semibold text-foreground mb-1.5">
                      {faq.question}
                    </h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* NAP + embed GBP + CID */}
            <section className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-4 flex-wrap">
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" /> Amorelia Luxury Floral Gifts — {NAP_ADDRESS}
                </p>
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary shrink-0" />
                  <a href={NAP_PHONE_TEL} className="hover:text-primary transition-colors">
                    {NAP_PHONE_DISPLAY}
                  </a>
                </p>
                <p className="font-body text-sm text-foreground flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-primary shrink-0" />
                  <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Cómo llegar
                  </a>
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden h-[300px]">
                <LazyMapEmbed
                  title="Amorelia Luxury Floral Gifts — floristería en Miami"
                  src={GBP_EMBED_SRC}
                  className="absolute inset-0 block w-full h-full rounded-lg align-top"
                  placeholderLabel="Mapa"
                />
              </div>
            </section>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/es/bouquets"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
              >
                Ver los ramos <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/es/bouquets/personalizar"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors rounded-lg"
              >
                Ramo a medida <Sparkles className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
