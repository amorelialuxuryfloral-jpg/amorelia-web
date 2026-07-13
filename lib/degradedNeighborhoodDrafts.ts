import type { LandingPageData } from "@/lib/landingPagesData";

/**
 * DRAFT COPY — degraded neighborhood page (CORRECCIONES-DIRECTORES puntos 16/35).
 *
 * ONLY Wynwood (0 searches, real Miami-geo data 2026-07-11) is DEGRADED to a
 * mention on the /flower-shop-miami hub: its URL 301s to the hub
 * (next.config.ts) and it is NOT routed, NOT in the sitemap and NOT linked.
 *
 * Coral Gables (110), Aventura (90) and Kendall (70) were RESTORED to
 * lib/landingPagesData.ts on 2026-07-11 (punto 35 — the previous build had
 * degraded them by mistake; Dani's exam keeps every barrio with real volume).
 *
 * The Wynwood copy is kept here VERBATIM as a draft so it can be re-promoted
 * without rewriting if the keyword ever gains volume. To re-promote: move the
 * entry into landingPages, remove the 301 from next.config.ts and re-add the
 * hub/footer/home links.
 */
export const degradedNeighborhoodDrafts: LandingPageData[] = [
  {
    slug: 'flower-delivery-wynwood',
    h1: 'Flower Delivery in Wynwood, Miami',
    seoTitle: "Flower Delivery Wynwood Miami | Amorelia Luxury Floral Gifts",
    seoDescription: 'Flower delivery to Wynwood galleries, studios, restaurants and lofts. Modern, design-forward arrangements for events, openings and content creation.',
    intro: "Wynwood is Miami's creative district — home to street art, design studios, galleries, restaurants and the loft residences of the city's creative class. Amorelia Luxury Floral Gifts delivers contemporary, design-forward arrangements across Wynwood, with service to galleries, photo studios, restaurants, offices and residential lofts. Our aesthetic — bold, sculptural, never traditional — fits Wynwood's energy.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Why we deliver in Wynwood',
      whyParagraph: "Wynwood clients aren't looking for a dozen red roses. They're looking for arrangements that match the visual language of the neighborhood: monochromatic palettes, unusual textures, sculptural lines, statement single-stem moments. We work with Wynwood galleries for opening night arrangements, with restaurants for weekly bar florals, with photographers and content creators for set design, and with the residents of NoMa lofts and Wynwood 25 for personal deliveries.",
      zonesTitle: 'Areas we cover in Wynwood',
      zonesIntro: 'We deliver throughout Wynwood, the Design District and Edgewater:',
      zones: [
        'Wynwood Walls and the surrounding gallery district',
        'NW 2nd Avenue corridor (galleries, studios, restaurants)',
        'Wynwood 25, NoMa and Wynwood Square residential',
        'The Wynwood Arts District co-working spaces',
        'Miami Design District (Palm Court, Paseo Ponti)',
        'Edgewater high-rises along Biscayne Bay',
        'Midtown Miami residential and retail',
        'Wynwood restaurants and venues',
      ],
      occasionsTitle: 'Popular occasions in Wynwood',
      occasionsIntro: 'Our Wynwood clients most often order flowers for:',
      occasions: [
        'Gallery opening receptions and art events',
        'Restaurant weekly bar and host stand arrangements',
        'Photo shoots, content creation and brand activations',
        'Loft and condo housewarmings',
        'Office openings and brand launches',
        'Birthday surprises and gifts to creative professionals',
      ],
      deliveryTitle: 'Delivery information for Wynwood',
      deliveryParagraph: "Wynwood sits within easy range of our Miami atelier — typical deliveries fall just inside or near our 0–5 mile flat zone, so most Wynwood addresses cost $25. For zones slightly farther into Edgewater or the Design District beyond 5 miles, the rate adds $1.60 per additional mile, up to 90 miles total.",
      faqTitle: 'Wynwood delivery FAQs',
      faqs: [
        {
          question: 'Do you provide flowers for gallery openings or art events?',
          answer: 'Yes — Wynwood galleries are some of our regular clients. We provide reception arrangements, sculptural pieces that complement the artwork on display, and statement entry florals. We recommend booking in advance for full event setups.',
        },
        {
          question: 'Can you deliver weekly flowers to a Wynwood restaurant or office?',
          answer: 'Yes. We run weekly subscription programs for restaurants, hotels and offices in Wynwood. Fresh delivery on a recurring schedule, with arrangements designed for high-traffic visibility (bar tops, host stands, lobbies).',
        },
        {
          question: 'Do you work with photographers and content creators?',
          answer: "Absolutely. We're regularly booked for editorial shoots, brand campaigns and social content in Wynwood studios. We can match a specific brief, mood board or color palette — just send the reference and we'll design accordingly.",
        },
        {
          question: 'Do you deliver to the Design District?',
          answer: 'Yes — the Design District is part of our Wynwood delivery zone. We deliver to retail boutiques, the residential towers and to Palm Court events. Most Design District addresses fall within our $25 flat-rate zone (0–5 miles from our NW 12th St atelier); addresses beyond 5 miles add $1.60 per additional mile. Standard policy applies: 2-hour minimum prep and 3PM Miami time cutoff for same-day.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: [
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Order Wynwood Flower Delivery Now',
      areaServed: 'Wynwood, Miami',
    },
  },
];
