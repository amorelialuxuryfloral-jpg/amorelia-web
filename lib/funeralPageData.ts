/**
 * Funeral & Sympathy Flowers Miami — PLAN-EJECUCION-DIRECTORES §3 (Romuald+Dani).
 *
 * PÁGINA PROPIA: the funeral/sympathy SERP in Miami is local florists
 * (winnable) and same-day is the differentiator. This page pair REPLACES the
 * old /collections/sympathy-flowers occasion page (one keyword = one URL —
 * SPEC §3): the old URLs 301 here (next.config.ts) and the retired copy is
 * archived in lib/retiredOccasionDrafts.ts.
 *
 * KW (KEYWORD-RESEARCH-REAL): "funeral flowers miami" 260 (Miami-qualified,
 * national head "funeral flowers" 49.500 is directory territory) ·
 * "casket sprays" 8.100 · "sympathy flowers" 14.800 — casket sprays /
 * sympathy / standing sprays are H2s here, NOT subpages (plan §3).
 *
 * All business facts are the validated ones (same source as the old sympathy
 * page + the Hialeah barrio page): all-white arrangements, delivery to
 * funeral homes with funeral-director coordination, coronas/cruces made to
 * order, $25 first 5 miles + $1.60/mile, 2h prep, 3PM same-day cutoff.
 */

export interface FuneralFaq {
  question: { en: string; es: string };
  answer: { en: string; es: string };
}

export const FUNERAL_PATH_EN = "/funeral-sympathy-flowers-miami";
export const FUNERAL_PATH_ES = "/flores-funeral-miami";

/** Curated sympathy grid — dignified white / soft palettes from the REAL
 *  catalog (used when the Shopify `sympathy-flowers` collection is empty). */
export const SYMPATHY_CATALOG_HANDLES = [
  "pure-white",
  "infinite-tenderness",
  "soft-pink",
  "magic-pastel",
  "soft-spring",
  "purple-charm",
];

export const funeralPage = {
  h1: {
    en: "Funeral & Sympathy Flowers in Miami — Same-Day Delivery",
    es: "Flores para Funeral y Arreglos Fúnebres en Miami — Entrega el Mismo Día",
  },
  title: {
    en: "Funeral & Sympathy Flowers Miami | Same-Day | Amorelia Luxury Floral Gifts",
    es: "Flores para Funeral Miami | Arreglos Fúnebres el Mismo Día | Amorelia Luxury Floral Gifts",
  },
  description: {
    en: "Funeral and sympathy flowers delivered same-day across Miami — to homes, churches and funeral homes. Dignified white-rose arrangements, casket sprays and standing sprays made to order.",
    es: "Flores para funeral y arreglos fúnebres entregados el mismo día por Miami — a casas, iglesias y funerarias. Arreglos de rosas blancas dignos, coronas y arreglos de pie por encargo.",
  },
  intro: {
    en: "When you need funeral flowers — or a sympathy arrangement for the family — fast and quietly, we handle the timing so you can focus on what matters. Amorelia Luxury Floral Gifts designs every arrangement by hand in our Miami atelier and delivers same-day across Miami to homes, churches and funeral homes, with dignified white-rose arrangements and discreet packaging.",
    es: "Cuando necesitas flores para un funeral — o un arreglo de condolencia para la familia — rápido y con discreción, nosotros gestionamos los tiempos para que tú te ocupes de lo importante. Amorelia Luxury Floral Gifts diseña cada arreglo a mano en nuestro taller de Miami y entrega el mismo día a casas, iglesias y funerarias, con arreglos de rosas blancas dignos y empaque sobrio.",
  },
  keyword: { en: "funeral & sympathy flowers", es: "flores para funeral" },
  gridH2: {
    en: "Sympathy arrangements",
    es: "Arreglos fúnebres y de condolencia",
  },
  gridIntro: {
    en: "All-white bouquets are the safest, most respectful choice — appropriate for any faith or family. We use 60–70cm Ecuadorian white roses tied with linen ribbon: never glitter, never bright accents. Soft pink and pastel arrangements are a warm alternative for the family home.",
    es: "Los bouquets todo blanco son la opción más segura y respetuosa — apropiados para cualquier fe o familia. Usamos rosa blanca ecuatoriana de 60–70cm atada con lazo de lino: nunca glitter ni acentos llamativos. Los arreglos rosa suave y pastel son una alternativa cálida para la casa de la familia.",
  },
  sections: [
    {
      id: "casket-sprays",
      h2: { en: "Casket sprays & standing sprays", es: "Coronas, cruces y arreglos de pie" },
      body: {
        en: "Casket sprays, standing sprays, wreaths and crosses are made to order in our atelier — sized for the service and delivered directly to the funeral home before the viewing. Because these are larger ceremonial pieces, order them by phone at +1 786-494-8647 (or through our contact form) so we can confirm the format, ribbon text and delivery window with you.",
        es: "Coronas, cruces, arreglos de pie y arreglos para el féretro se hacen por encargo en nuestro taller — al tamaño del servicio y entregados directamente en la funeraria antes del velorio. Al ser piezas ceremoniales grandes, pídelas por teléfono al +1 786-494-8647 (o por nuestro formulario de contacto) para confirmar contigo el formato, el texto de la cinta y la ventana de entrega.",
      },
    },
    {
      id: "funeral-home-delivery",
      h2: { en: "Funeral home delivery (same-day)", es: "Entrega en funerarias (mismo día)" },
      body: {
        en: "We deliver directly to Miami-area funeral homes and chapels — including the Caballero Rivero locations in Hialeah — and coordinate timing with the funeral director when needed. Include the deceased's name and the family name on the card so the arrangement reaches the right service. Same-day delivery is available for orders placed before 3PM Miami time (minimum 2 hours preparation); delivery is $25 for the first 0–5 miles and $1.60 per additional mile, up to 90 miles.",
        es: "Entregamos directamente en funerarias y capillas del área de Miami — incluidas las sedes de Caballero Rivero en Hialeah — y coordinamos los tiempos con el director funerario cuando hace falta. Incluye el nombre del fallecido y el apellido de la familia en la tarjeta para que el arreglo llegue al servicio correcto. La entrega el mismo día está disponible para pedidos antes de las 3PM hora de Miami (mínimo 2 horas de preparación); el envío cuesta $25 las primeras 0–5 millas y $1.60 por milla adicional, hasta 90 millas.",
      },
    },
    {
      id: "how-to-order",
      h2: { en: "How to order", es: "Cómo hacer el pedido" },
      body: {
        en: "For a hand-tied sympathy bouquet, order online from the arrangements above — choose the size (50 to 200 roses) and add the card message at checkout. For casket sprays, standing sprays or wreaths, call us at +1 786-494-8647 or send the details through the contact form and we take care of the rest. A bouquet sent to the family home 2–7 days after the service is often more meaningful than another arrangement at the chapel.",
        es: "Para un bouquet de condolencia hecho a mano, pide online desde los arreglos de arriba — elige el tamaño (50 a 200 rosas) y añade el mensaje de la tarjeta al pagar. Para coronas, cruces o arreglos de pie, llámanos al +1 786-494-8647 o envía los detalles por el formulario de contacto y nos ocupamos del resto. Un bouquet enviado a la casa de la familia 2–7 días después del servicio suele ser más significativo que otro arreglo más en la capilla.",
      },
    },
  ],
  faqTitle: { en: "Funeral flower FAQs", es: "Preguntas frecuentes sobre flores para funeral" },
  faqs: [
    {
      question: {
        en: "Can you deliver flowers directly to a funeral home in Miami?",
        es: "¿Entregan flores directamente en una funeraria de Miami?",
      },
      answer: {
        en: "Yes. We deliver directly to funeral homes and chapels across Miami and coordinate the timing with the funeral director when needed, so the arrangement arrives before the viewing. Include the deceased's name and the family name on the card.",
        es: "Sí. Entregamos directamente en funerarias y capillas de todo Miami y coordinamos los tiempos con el director funerario cuando hace falta, para que el arreglo llegue antes del velorio. Incluye el nombre del fallecido y el apellido de la familia en la tarjeta.",
      },
    },
    {
      question: {
        en: "Can I get same-day funeral flower delivery in Miami?",
        es: "¿Pueden entregar flores para funeral el mismo día en Miami?",
      },
      answer: {
        en: "Yes — order before 3PM Miami time and we deliver the same day, with a minimum of 2 hours preparation. Delivery is $25 for the first 0–5 miles and $1.60 per additional mile, up to 90 miles from our atelier at 7257 NW 12th St.",
        es: "Sí — pide antes de las 3PM hora de Miami y entregamos el mismo día, con un mínimo de 2 horas de preparación. El envío cuesta $25 las primeras 0–5 millas y $1.60 por milla adicional, hasta 90 millas desde nuestro taller en 7257 NW 12th St.",
      },
    },
    {
      question: {
        en: "What flowers are appropriate for a funeral or sympathy gift?",
        es: "¿Qué flores son apropiadas para un funeral o un pésame?",
      },
      answer: {
        en: "All-white arrangements are the safest, most respectful choice and appropriate for any faith or family. Soft pink or pastel bouquets are a warm option when the flowers go to the family home rather than the service.",
        es: "Los arreglos todo blanco son la opción más segura y respetuosa, apropiados para cualquier fe o familia. Los ramos rosa suave o pastel son una opción cálida cuando las flores van a la casa de la familia y no al servicio.",
      },
    },
    {
      question: {
        en: "Do you make casket sprays, standing sprays or funeral wreaths?",
        es: "¿Hacen coronas fúnebres, cruces o arreglos de pie?",
      },
      answer: {
        en: "Yes — casket sprays, standing sprays, wreaths and crosses are made to order. Call us at +1 786-494-8647 or use the contact form to confirm the format, ribbon text and delivery window; we deliver them directly to the funeral home.",
        es: "Sí — coronas, cruces, arreglos de pie y arreglos para el féretro se hacen por encargo. Llámanos al +1 786-494-8647 o usa el formulario de contacto para confirmar el formato, el texto de la cinta y la ventana de entrega; los entregamos directamente en la funeraria.",
      },
    },
  ] satisfies FuneralFaq[],
};
