import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { occasionPages } from "@/lib/occasionPagesData";
import { buildMetadata } from "@/lib/seo";

/**
 * Índice de ocasiones — /es/collections/ocasiones (copy ES verbatim de la SPA
 * OccasionsIndexPage; misma estructura que el índice EN de fase 3). Todos los
 * enlaces son <a> reales en el HTML del servidor (SPEC §2.4).
 */

export const revalidate = 3600;

const TITLE = "Flores por Ocasión Miami | Bouquets para Cada Momento | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Bouquets de rosa premium para cada ocasión: San Valentín, cumpleaños, aniversarios, funeral, boda, Día del Padre y más. Entrega el mismo día en Miami.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/collections/occasions",
    pathEs: "/collections/ocasiones",
    language: "es",
  });
}

const TIERS = [
  { tier: 1 as const, title: "Las grandes ocasiones" },
  { tier: 2 as const, title: "Otras ocasiones" },
  { tier: 3 as const, title: "Detalles y celebraciones pequeñas" },
];

export default function OccasionsIndexPageEs() {
  const itemList = itemListSchema(
    occasionPages.map((o) => ({
      name: o.h1.es,
      url: `https://amorelialuxuryfloral.com/es/collections/${o.slugEs}`,
    })),
    "Ocasiones",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: "Inicio", url: "https://amorelialuxuryfloral.com/es" },
    { name: "Ocasiones", url: "https://amorelialuxuryfloral.com/es/collections/ocasiones" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[itemList, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Ocasiones" }]} />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">Flores por Ocasión</h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            Flores por ocasión en Miami: cada momento pide un bouquet distinto, y esta es la guía
            rápida — del aniversario a la condolencia, del cumpleaños a la boda — con la colección
            que mejor encaja con cada ocasión, montada a mano en nuestro taller con entrega el
            mismo día antes de las 3PM.
          </p>

          {/* Día de la Madre — colección viva, no duplicada aquí */}
          <Link
            href="/es/mothers-day"
            className="block mb-10 bg-primary/5 border border-primary/20 rounded-lg p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-1 shrink-0" />
              <div>
                <p className="font-body text-[10px] tracking-widest uppercase text-primary mb-1">Colección activa</p>
                <p className="font-title-retro text-xl text-foreground">Día de la Madre</p>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  La colección dedicada del Día de la Madre con productos en stock.
                </p>
              </div>
            </div>
          </Link>

          {/* Listas de ocasiones por tier */}
          {TIERS.map(({ tier, title: tierTitle }) => {
            const list = occasionPages.filter((o) => o.tier === tier);
            return (
              <section key={tier} className="mb-12">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">{tierTitle}</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {list.map((o) => (
                    <li key={o.slugEs}>
                      <Link
                        href={`/es/collections/${o.slugEs}`}
                        className="block bg-cream/50 hover:bg-cream rounded-md px-4 py-3 transition-colors"
                      >
                        <p className="font-body text-sm text-foreground hover:text-primary transition-colors">
                          {o.h1.es}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
