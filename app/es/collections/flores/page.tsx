import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, itemListSchema } from "@/components/JsonLd";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { getTranslator } from "@/i18n";
import { buildMetadata } from "@/lib/seo";

/**
 * Índice de flores — /es/collections/flores (gemelo ES del índice EN de
 * fase 3, SPEC §4): SOLO lo que Amorelia vende de verdad hoy — ramo buchón
 * (27.100/mes, la keyword ES nº1), arreglos florales y las 9 colecciones de
 * color. Los tipos de flor vacíos de la SPA (tulipanes, peonías…) NO se
 * migran. Nombres/keywords ES tomados del dataset validado
 * (flowerTypePagesData h1.es/title.es + nav.<color>Roses de i18n).
 * [HUECO-VALIDAR: el párrafo intro ES es traducción del intro EN nuevo de
 * fase 3 — pendiente de validación de Romuald, keywords del dataset real.]
 */

export const revalidate = 3600;

const TITLE = "Flores por Tipo Miami | Ramo Buchón, Rosas y Arreglos Florales | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Todas las flores que entregamos hoy en Miami: bouquets de rosas en 9 colores, ramo buchón gigante y arreglos florales hechos a mano. Entrega el mismo día antes de las 3PM.";

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: "/collections/flowers",
    pathEs: "/collections/flores",
    language: "es",
  });
}

export default function FlowersIndexPageEs() {
  const { t } = getTranslator("es");

  const collections: Array<{ href: string; name: string; tag: string }> = [
    { href: "/es/collections/ramo-buchon", name: "Ramo Buchón en Miami", tag: "Signature" },
    { href: "/es/collections/arreglos-florales", name: "Arreglos Florales en Miami", tag: "Catálogo" },
    ...COLOR_COLLECTIONS.map((c) => ({
      href: `/es/bouquets/${c.slugEs}`,
      name: t(`nav.${c.color}Roses`),
      tag: "Rosas",
    })),
  ];

  const itemList = itemListSchema(
    collections.map((c) => ({ name: c.name, url: `https://amorelialuxuryfloral.com${c.href}` })),
    "Tipos de flor",
  );

  const breadcrumbs = breadcrumbSchema([
    { name: "Inicio", url: "https://amorelialuxuryfloral.com/es" },
    { name: "Flores", url: "https://amorelialuxuryfloral.com/es/collections/flores" },
  ]);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[itemList, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Breadcrumbs items={[{ label: "Inicio", to: "/es" }, { label: "Flores" }]} />
          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">Flores por Tipo</h1>
          <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed mb-10 max-w-3xl">
            Todo lo que atamos a mano y entregamos hoy en Miami — bouquets de rosas premium en todos
            los colores, el ramo buchón gigante y arreglos florales hechos a pedido. Cada colección de
            abajo tiene producto real, listo para entrega el mismo día si pides antes de las 3PM.
          </p>

          <section className="mb-12">
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">Compra por flor</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {collections.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="flex items-center justify-between gap-3 bg-cream/50 hover:bg-cream rounded-md px-4 py-3 transition-colors"
                  >
                    <p className="font-body text-sm text-foreground hover:text-primary transition-colors">{c.name}</p>
                    <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground">{c.tag}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-cream rounded-lg p-6 md:p-8">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-2">¿No encuentras tu flor?</h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-4">
              Nuestro builder te deja diseñar el ramo exacto — de 50 a 200 rosas, tus colores, acabado
              natural, con glitter o pintado, con vista previa de IA antes de pagar.
            </p>
            <Link
              href="/es/bouquets/personalizar"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md font-body text-sm hover:bg-primary/90 transition-colors"
            >
              Crea tu ramo personalizado
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
