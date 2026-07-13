import type { OccasionPage } from "@/lib/occasionPagesData";

/**
 * RETIRED occasion pages — PLAN-EJECUCION-DIRECTORES (Romuald+Dani).
 *
 * These collection entries were REPLACED by dedicated money pages (one
 * keyword = one URL, SPEC §3) and their old URLs 301 to the new ones in
 * next.config.ts:
 *   - sympathy-flowers / arreglos-funebres → /funeral-sympathy-flowers-miami
 *     + /es/flores-funeral-miami (plan §3).
 *   - wedding-flowers / ramo-de-novia → /wedding-flowers-miami (plan §6:
 *     wedding SERP = service/lead intent, not a shop grid).
 *
 * Copy preserved VERBATIM as draft. Not routed, not linked, not in sitemap.
 */
export const retiredOccasionDrafts: OccasionPage[] = [
  {
    slug: "sympathy-flowers",
    slugEs: "arreglos-funebres",
    tier: 1,
    keyword: { en: "sympathy flowers", es: "arreglos fúnebres" },
    keyword2: { en: "funeral flowers", es: "flores para funeral" },
    h1: { en: "Sympathy & Funeral Flowers in Miami", es: "Arreglos Fúnebres y Flores para Funeral en Miami" },
    title: {
      en: "Sympathy & Funeral Flowers Miami | Same-Day Condolence Delivery | Amorelia Luxury Floral Gifts",
      es: "Arreglos Fúnebres y Flores para Funeral Miami | Entrega Mismo Día | Amorelia Luxury Floral Gifts",
    },
    description: {
      en: "Sympathy flowers and funeral flowers delivered same-day across Miami. Elegant all-white bouquets, dignified packaging, direct-to-home or to the funeral home.",
      es: "Arreglos fúnebres y flores para funeral entregadas el mismo día por Miami. Bouquets blancos elegantes, presentación digna, a casa o directamente a la funeraria.",
    },
    intro: {
      en: "When you need sympathy flowers — or funeral flowers — fast and quietly, we handle the timing so you can focus on family. Amorelia Luxury Floral Gifts delivers same-day across Miami to homes, churches and funeral homes with dignified white-rose arrangements and discreet packaging.",
      es: "Cuando necesitas arreglos fúnebres o flores para funeral, rápido y con discreción, nosotros gestionamos los tiempos para que tú te ocupes de la familia. Amorelia Luxury Floral Gifts entrega el mismo día por Miami a casas, iglesias y funerarias con arreglos de rosas blancas dignos y empaque sobrio.",
    },
    sections: [
      {
        h2: { en: "White roses: the universal language of condolence", es: "Rosa blanca: el idioma universal del pésame" },
        body: {
          en: "All-white bouquets are the safest, most respectful choice. We use 60–70cm Ecuadorian white roses tied with linen ribbon — never glitter, never bright accents — appropriate for any faith or family.",
          es: "Los bouquets todo blanco son la opción más segura y respetuosa. Usamos rosa blanca ecuatoriana de 60–70cm atada con lazo de lino — nunca glitter ni acentos llamativos — apropiada para cualquier fe o familia.",
        },
      },
      {
        h2: { en: "Delivery to funeral homes and viewings", es: "Entrega a funerarias y velorios" },
        body: {
          en: "We deliver directly to Miami-area funeral homes and chapels. Include the deceased's name and the family name on the card; we coordinate timing with the funeral director when needed.",
          es: "Entregamos directo a funerarias y capillas de Miami. Incluye el nombre del fallecido y el apellido de la familia en la tarjeta; coordinamos los tiempos con el director funerario cuando hace falta.",
        },
      },
      {
        h2: { en: "Sent to the family home instead", es: "Si va a la casa de la familia" },
        body: {
          en: "A bouquet sent to the home after the service is often more meaningful than another arrangement at the chapel. Order a hand-tied white bouquet for delivery 2–7 days after the funeral.",
          es: "Un bouquet enviado a la casa después del servicio suele ser más significativo que otro arreglo más en la capilla. Pide un bouquet blanco hecho a mano para entrega 2–7 días después del funeral.",
        },
      },
    ],
  },
  {
    slug: "wedding-flowers",
    slugEs: "ramo-de-novia",
    tier: 1,
    keyword: { en: "wedding flowers", es: "ramo de novia" },
    keyword2: { en: "bridal bouquet", es: "flores para boda" },
    h1: { en: "Wedding Flowers & Bridal Bouquets in Miami", es: "Ramo de Novia y Flores para Boda en Miami" },
    title: {
      en: "Wedding Flowers Miami | Bridal Bouquets & Reception Roses | Amorelia Luxury Floral Gifts",
      es: "Ramo de Novia Miami | Flores para Boda y Recepción | Amorelia Luxury Floral Gifts",
    },
    description: {
      en: "Wedding flowers and bridal bouquets in Miami. Hand-tied bouquets, bridesmaid arrangements and reception roses. Consult by phone for full wedding orders.",
      es: "Ramo de novia y flores para boda en Miami. Bouquets hechos a mano, arreglos para damas y rosas para la recepción. Consulta por teléfono para bodas completas.",
    },
    intro: {
      en: "Wedding flowers in Miami — and bridal bouquets specifically — are the one thing you don't risk on an online template. Amorelia Luxury Floral Gifts makes bridal bouquets, bridesmaid pieces and reception arrangements by hand from premium Ecuadorian roses. Most brides book 4–8 weeks out; rush orders inside two weeks possible on availability.",
      es: "El ramo de novia en Miami — y las flores para boda en general — es la pieza con la que no se arriesga en una plantilla online. Amorelia Luxury Floral Gifts hace ramos de novia, piezas para damas y arreglos de recepción a mano con rosa ecuatoriana premium. La mayoría reserva con 4–8 semanas; pedidos urgentes con menos de dos semanas, sujeto a disponibilidad.",
    },
    sections: [
      {
        h2: { en: "Classic white bridal bouquets", es: "Ramos de novia clásicos en blanco" },
        body: {
          en: "The timeless bridal bouquet: 30–50 stems of premium white roses, hand-tied with silk or linen ribbon, sized to the bride's frame. We match the white tone to the dress so they don't fight in photos.",
          es: "El ramo de novia atemporal: 30–50 tallos de rosa blanca premium, hecho a mano con lazo de seda o lino, dimensionado al cuerpo de la novia. Igualamos el tono de blanco con el vestido para que no peleen en las fotos.",
        },
      },
      {
        h2: { en: "Colored and bicolor bridal bouquets", es: "Ramos de novia con color o bicolor" },
        body: {
          en: "Hot pink, blush, deep red, or a white-and-rose-gold bicolor — we build the exact palette. Use the custom builder for preview, then we hand-finish it in the workshop.",
          es: "Hot pink, blush, rojo profundo o bicolor blanco-rosa dorado — montamos la paleta exacta. Usa el builder a medida para previsualizar, luego lo terminamos a mano en el taller.",
        },
      },
      {
        h2: { en: "Reception centerpieces and bridesmaids", es: "Centros de recepción y damas" },
        body: {
          en: "Bridesmaid bouquets, ceremony arrangements, sweetheart-table centerpieces. For full wedding orders (10+ pieces) call us — we quote and schedule a tasting/visual sample if needed.",
          es: "Bouquets para damas, arreglos para la ceremonia, centro para la mesa de los novios. Para bodas completas (10+ piezas) llámanos — cotizamos y agendamos muestra visual si hace falta.",
        },
      },
    ],
  },
];
