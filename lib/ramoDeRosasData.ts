import type { OccasionPage } from "@/lib/occasionPagesData";

/**
 * /es/ramo-de-rosas — PLAN-EJECUCION-DIRECTORES §5 (cola ES).
 *
 * KW (KEYWORD-RESEARCH-REAL, espanol_ES): "ramo de rosas" 12.100 ·
 * "ramo derosas" 12.100 · "ramo de rosas rojas" 2.900 · "rosas rojas" 5.400
 * (owned by /es/bouquets/rosas-rojas — linked, not fought here) ·
 * "arreglos de rosas" 1.300.
 *
 * ES-only canonical (no EN twin: the EN generic "rose bouquet" intent is
 * already covered by /bouquets). The whole REAL catalog qualifies — every
 * Amorelia bouquet IS a hand-tied rose bouquet — so the grid hangs the full
 * catalog (CollectionLanding fallback). Copy resolves the intent: colors,
 * sizes (50–200), finishes and same-day Miami delivery. Nothing invented.
 */

export const RAMO_DE_ROSAS_PATH = "/ramo-de-rosas";

export const ramoDeRosasPage: OccasionPage = {
  slug: "ramo-de-rosas",
  slugEs: "ramo-de-rosas",
  tier: 2,
  // No Shopify collection with this handle — CollectionLanding hangs the
  // full REAL rose catalog as the guaranteed-not-empty grid.
  keyword: { en: "rose bouquet miami", es: "ramo de rosas" },
  keyword2: { en: "bouquet of roses", es: "ramo de rosas rojas" },
  h1: { en: "Rose Bouquets in Miami", es: "Ramo de Rosas — Entrega el Mismo Día en Miami" },
  title: {
    en: "Rose Bouquets Miami | Same-Day Delivery | Amorelia Luxury Floral Gifts",
    es: "Ramo de Rosas en Miami | A Domicilio el Mismo Día | Amorelia Luxury Floral Gifts",
  },
  description: {
    en: "Hand-tied rose bouquets delivered same-day in Miami. 50 to 200 roses, every color, natural, glitter or painted finish. Order before 3PM.",
    es: "Ramos de rosas hechos a mano con entrega el mismo día en Miami. De 50 a 200 rosas, todos los colores, acabado natural, glitter o pintado. Pide antes de las 3PM.",
  },
  intro: {
    en: "Looking for a rose bouquet in Miami? Every Amorelia Luxury Floral Gifts bouquet is hand-tied in our Miami atelier with premium Ecuadorian roses — from 50 to 200 stems, in any color, delivered the same day when you order before 3PM.",
    es: "¿Buscas un ramo de rosas en Miami? Cada ramo de Amorelia Luxury Floral Gifts se hace a mano en nuestro taller de Miami con rosa premium ecuatoriana — de 50 a 200 tallos, en el color que quieras, entregado el mismo día si pides antes de las 3PM.",
  },
  sections: [
    {
      h2: { en: "The classic: a red rose bouquet", es: "El clásico: el ramo de rosas rojas" },
      body: {
        en: "The red rose bouquet is the number-one request — anniversaries, declarations, apologies that need to say it loudly. We use 60–70cm long-stem red roses sorted for uniform head size, hand-tied and wrapped in your choice of paper.",
        es: "El ramo de rosas rojas es el pedido número uno — aniversarios, declaraciones y perdones que tienen que decirlo alto. Usamos rosa roja de tallo largo (60–70cm) seleccionada por tamaño de botón uniforme, atada a mano y envuelta en el papel que elijas.",
      },
    },
    {
      h2: { en: "Every color: white, pink, yellow, blue and more", es: "Todos los colores: blancas, pink, amarillas, azules y más" },
      body: {
        en: "Beyond red: white roses for elegance, pink and hot pink for tenderness, yellow for friendship, and painted options like blue, black and green. Single-color, bicolor or a custom mix in her exact palette — preview it with AI in the custom builder before paying.",
        es: "Más allá del rojo: rosas blancas para la elegancia, pink y hot pink para la ternura, amarillas para la amistad, y opciones pintadas como azul, negro y verde. De un color, bicolor o mezcla a medida en su paleta exacta — previsualízalo con IA en el builder antes de pagar.",
      },
    },
    {
      h2: { en: "Sizes from 50 to 200 roses", es: "Tamaños: de 50 a 200 rosas" },
      body: {
        en: "Choose the statement you want to make: 50 roses for a generous classic, 100 for the grand gesture, up to 200 for maximum impact. Finishes: natural, glitter or painted. Add a crown, butterflies, a personalized ribbon or a handwritten card.",
        es: "Elige el tamaño del gesto: 50 rosas para un clásico generoso, 100 para el gran gesto, hasta 200 para el máximo impacto. Acabados: natural, glitter o pintado. Añade corona, mariposas, lazo personalizado o tarjeta escrita a mano.",
      },
    },
    {
      h2: { en: "Same-day delivery across Miami", es: "Entrega del ramo de rosas el mismo día en Miami" },
      body: {
        en: "Order before 3PM Miami time and your rose bouquet goes out today — minimum 2 hours preparation, delivery up to 90 miles ($25 for the first 0–5 miles, $1.60 per additional mile). Free pickup at 7257 NW 12th St, Miami, FL 33126.",
        es: "Pide antes de las 3PM hora de Miami y tu ramo de rosas sale hoy — mínimo 2 horas de preparación, entrega hasta 90 millas ($25 las primeras 0–5 millas, $1.60 por milla adicional). Recogida gratis en 7257 NW 12th St, Miami, FL 33126.",
      },
    },
  ],
};
