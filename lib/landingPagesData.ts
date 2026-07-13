export interface LandingFAQ {
  question: string;
  answer: string;
}

/** Extended SEO content (per-page unique copy for indexable landings). */
export interface LandingSeoContent {
  /** Short H2 + intro paragraph for "Why we deliver here". */
  whyTitle: string;
  whyParagraph: string;
  /** "Zones we cover" list. String = plain mention; object = REAL <a> to a
   *  routed landing page (used by the hub's "Neighborhoods we deliver to"). */
  zonesTitle: string;
  zonesIntro: string;
  zones: Array<string | { label: string; slug: string }>;
  /** "Popular occasions" list. */
  occasionsTitle: string;
  occasionsIntro: string;
  occasions: string[];
  /** Delivery info section (heading + bullet copy, sourced from official policy). */
  deliveryTitle: string;
  deliveryParagraph: string;
  /** FAQ block (4 entries — used for FAQPage schema + UI). */
  faqTitle: string;
  faqs: LandingFAQ[];
  /** Internal links block (label + slug) — rendered at end. */
  internalLinksTitle: string;
  internalLinks: { label: string; slug: string }[];
  /** Final CTA copy. */
  ctaLabel: string;
  /** Schema.org areaServed name (city / neighborhood). */
  areaServed: string;
}

export interface LandingPageData {
  slug: string;
  h1: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  type: 'neighborhood' | 'seasonal' | 'niche';
  /** When present, the page renders the extended SEO layout instead of the default. */
  seo?: LandingSeoContent;
}

/** The 7 validated barrio slugs (CORRECCIONES-DIRECTORES §G — Dani's detailed
 *  exam: every barrio with real local volume keeps its page; ONLY Wynwood (0
 *  searches) is degraded to a hub mention). Used to build the full sibling
 *  interlink set (each barrio links to the hub + ALL siblings, punto 18). */
export const BARRIO_LINKS: { label: string; slug: string }[] = [
  { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
  { label: 'Flower Delivery Doral', slug: 'flower-delivery-doral' },
  { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
  { label: 'Flower Delivery Coral Gables', slug: 'flower-delivery-coral-gables' },
  { label: 'Flower Delivery Hialeah', slug: 'flower-delivery-hialeah' },
  { label: 'Flower Delivery Kendall', slug: 'flower-delivery-kendall' },
  { label: 'Flower Delivery Aventura', slug: 'flower-delivery-aventura' },
];

/** Hub + every sibling barrio (excludes the current page's own slug). */
const barrioInternalLinks = (selfSlug: string): { label: string; slug: string }[] => [
  ...BARRIO_LINKS.filter((b) => b.slug !== selfSlug),
  { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
];

export const landingPages: LandingPageData[] = [
  // Neighborhood pages (CORRECCIONES §G: the 7 barrios with real Miami-geo
  // volume — Brickell 320/210, Doral 170, Miami Beach 170, Hialeah 140,
  // Coral Gables 110, Aventura 90, Kendall 70 — all keep their page. ONLY
  // Wynwood (0) is degraded: 301 in next.config.ts, draft copy in
  // degradedNeighborhoodDrafts.ts. Titles lead with "florist [barrio]" — the
  // variant with 3-6× more volume than "flower delivery [barrio]" (punto 17).
  {
    slug: 'flower-delivery-doral',
    h1: 'Flower Delivery in Doral, Miami',
    seoTitle: "Doral Florist | Flower Delivery in Doral, Miami | Amorelia Luxury Floral Gifts",
    seoDescription: 'Premium flower delivery in Doral. Service to Doral Isles, Trump National Doral, corporate offices and family homes. Bilingual service in English and Spanish.',
    intro: "Doral is one of Miami's fastest-growing communities, home to international corporate headquarters, family neighborhoods and the iconic Trump National Doral resort. Amorelia Luxury Floral Gifts delivers premium fresh bouquets across all of Doral — from the corporate parks along NW 87th Avenue to the residential gated communities of Doral Isles. We cover the 33122, 33166 and 33178 zip codes.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Doral florist for same-day delivery',
      whyParagraph: "Doral has a unique mix: multinational corporate offices (Carnival, Univision, Ryder, hundreds of Latin American HQs) and large family-oriented residential communities. We deliver to both worlds. For corporate clients, we handle reception arrangements, executive gifts and welcome bouquets for international visitors. For families, we deliver birthday flowers, quinceañera arrangements and Mother's Day bouquets — often coordinated in Spanish on request, since over 70% of Doral residents speak Spanish at home.",
      zonesTitle: 'Areas we cover in Doral',
      zonesIntro: 'We deliver throughout Doral, including these specific areas:',
      zones: [
        'Trump National Doral Miami resort and golf club',
        'Doral Isles (Estancia, Antigua, Cayman, Marbella)',
        'Doral Park, Doral Estates',
        'Costa del Sol and Grand Bay at Doral',
        'Corporate offices along NW 87th Avenue and NW 36th Street',
        'CityPlace Doral and surrounding residences',
        'Downtown Doral and Doral Square',
        'Schools and family communities near Ronald W. Reagan / Doral Senior High',
      ],
      occasionsTitle: 'Popular occasions in Doral',
      occasionsIntro: 'Our Doral clients most commonly order flowers for:',
      occasions: [
        'Corporate gifts to multinational HQs (Carnival, Univision, Ryder and others)',
        'Birthday and anniversary deliveries to family homes',
        'Quinceañera arrangements and centerpieces',
        "Mother's Day and Father's Day bouquets",
        'Hotel guest welcome flowers at Trump National Doral',
        'Office reception and lobby weekly flower programs',
      ],
      deliveryTitle: 'Delivery information for Doral',
      deliveryParagraph: "Doral is one of the closest neighborhoods to our Miami atelier on NW 12th St — most Doral addresses fall comfortably within our 0–5 mile flat zone, so delivery typically costs $25. Beyond 5 miles, the rate is $1.60 per additional mile, up to 90 miles total.",
      faqTitle: 'Doral delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver flowers to homes in Doral? Do you serve customers in Spanish?',
          answer: 'Yes. We accept orders in both English and Spanish, and our delivery team is bilingual. Many of our Doral customers prefer to communicate in Spanish, and we are happy to do so. Delivery takes a minimum of 2 hours after ordering; same-day if you order before 3PM Miami time.',
        },
        {
          question: 'Do you deliver to Trump National Doral resort?',
          answer: "Yes. We deliver to guest rooms, the resort's events and to private homes inside the Trump Doral community. We coordinate with the front desk for guest deliveries.",
        },
        {
          question: 'Can you deliver to a corporate office in Doral?',
          answer: 'Absolutely. We deliver to the major corporate parks along NW 87th Avenue and NW 36th Street, including offices for Carnival, Univision, Ryder, US Century Bank and many Latin American multinationals. We handle reception protocols for each building.',
        },
        {
          question: 'Do you make arrangements for quinceañeras in Doral?',
          answer: 'Yes — quinceañeras are one of our most requested services in Doral. We design ceremony bouquets, centerpieces, party favors and entrance arrangements. We recommend booking ahead for full events.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: barrioInternalLinks('flower-delivery-doral'),
      ctaLabel: 'Order Doral Flower Delivery Now',
      areaServed: 'Doral, Miami',
    },
  },
  {
    slug: 'flower-delivery-hialeah',
    h1: 'Flower Delivery in Hialeah, Miami',
    seoTitle: "Hialeah Florist | Flower Delivery in Hialeah, Miami | Amorelia Luxury Floral Gifts",
    seoDescription: 'Premium fresh flower delivery in Hialeah. Service to homes, offices, funeral homes and hospitals. Bouquets for birthdays, quinceañeras and anniversaries. Bilingual service.',
    intro: "Hialeah is the heart of Cuban-American Miami and one of the most tight-knit communities in South Florida — where every birthday, quinceañera, anniversary and funeral is honored with flowers. Amorelia Luxury Floral Gifts delivers fresh, premium arrangements across all of Hialeah and Hialeah Gardens, with bilingual service to homes, hospitals, funeral homes and offices. Orders in Spanish are welcome.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Hialeah florist for same-day delivery',
      whyParagraph: "Hialeah has its own floral traditions that we understand and respect. We deliver regularly to Caballero Rivero Funeral Homes, Palm Springs Hospital, Hialeah Hospital and the family homes that fill the neighborhoods between West 49th Street and Okeechobee Road. Our team is fully bilingual, and we know that for our Hialeah clients, freshness and presentation matter as much as the gesture itself. Whether it's a birthday bouquet, a wreath for a viewing, or quinceañera centerpieces, we deliver with the care this community expects.",
      zonesTitle: 'Areas we cover in Hialeah',
      zonesIntro: 'We deliver throughout Hialeah and Hialeah Gardens, including:',
      zones: [
        'Hialeah Hospital and Palm Springs General Hospital',
        'Caballero Rivero Funeral Home (multiple Hialeah locations)',
        'Westchester General and surrounding medical offices',
        'Amelia Earhart Park area',
        'Hialeah Gardens residential communities',
        'Westland Mall and surrounding shops',
        'West Hialeah neighborhoods (West 49th Street corridor)',
        'Leah Arts District',
      ],
      occasionsTitle: 'Popular occasions in Hialeah',
      occasionsIntro: 'Our Hialeah clients most often order flowers for:',
      occasions: [
        'Birthdays — bouquets for family members',
        'Quinceañeras — centerpieces, party favors and ceremony flowers',
        'Funeral wreaths and sympathy arrangements',
        'Wedding anniversaries',
        "Mother's Day and Father's Day",
        'Hospital deliveries to Palm Springs and Hialeah Hospital',
      ],
      deliveryTitle: 'Delivery information for Hialeah',
      deliveryParagraph: "Our Miami atelier on NW 12th St is right on the Hialeah border, so most Hialeah addresses fall within our 0–5 mile flat zone — delivery typically costs $25. Beyond 5 miles (deeper Hialeah Gardens or West Hialeah), the rate is $1.60 per additional mile, up to 90 miles total.",
      faqTitle: 'Hialeah delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver funeral wreaths to Hialeah funeral homes?',
          answer: 'Yes. We deliver wreaths, crosses and funeral arrangements to every funeral home in Hialeah, including the various Caballero Rivero locations. We coordinate directly with the funeral home so the wreath arrives before the viewing.',
        },
        {
          question: 'Can you deliver flowers to Hialeah Hospital or Palm Springs?',
          answer: 'Of course. We deliver to Hialeah Hospital, Palm Springs General and other medical centers in the area. We just need the patient\'s name and room number if you have it; if not, we arrange it with the hospital reception desk.',
        },
        {
          question: 'Do you make arrangements for quinceañeras?',
          answer: 'Yes, quinceañeras are one of our most requested services in Hialeah. We design centerpieces, bouquets for the quinceañera, party favors and entrance arrangements. We recommend booking ahead for full events.',
        },
        {
          question: 'Do you speak Spanish? Can I order over WhatsApp?',
          answer: 'Yes, our whole team is bilingual. You can place your order by phone, WhatsApp or directly on the website — whichever you prefer. We are happy to take orders in Spanish. Delivery takes a minimum of 2 hours after ordering; same-day if you order before 3PM Miami time.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also deliver to:',
      internalLinks: barrioInternalLinks('flower-delivery-hialeah'),
      ctaLabel: 'Order Hialeah Flower Delivery Now',
      areaServed: 'Hialeah, Miami',
    },
  },
  {
    slug: 'flower-delivery-brickell',
    // SPEC §6: H1 pattern "Flower Delivery in <Barrio>, Miami" — "Luxury" removed.
    h1: 'Flower Delivery in Brickell, Miami',
    seoTitle: "Brickell Florist | Flower Delivery in Brickell, Miami | Amorelia Luxury Floral Gifts",
    seoDescription: 'Premium flower delivery to Brickell condos, offices and hotels. Service to Brickell City Centre, Four Seasons, SLS, Mandarin Oriental and all Brickell Avenue.',
    intro: "Brickell is Miami's financial heart, full of high-rise condos, executive offices and luxury hotels where every detail matters. At Amorelia Luxury Floral Gifts we deliver premium fresh bouquets directly to Brickell Avenue, Brickell Key and Brickell City Centre, with the discretion and presentation that this neighborhood expects. Whether it's a corporate gift, a romantic surprise to a 30th-floor condo, or a hotel suite delivery for a guest, our service has Brickell covered.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Brickell florist for same-day delivery',
      whyParagraph: "Brickell concentrates more luxury condo towers per square mile than any other Miami neighborhood. Our delivery team knows the building protocols at Echo Brickell, Reach, Rise, SLS Lux, Brickell Flatiron and Panorama Tower — including doorman procedures and concierge handoff. We understand that timing matters when sending flowers to a busy executive at Brickell City Centre or to a guest checking into the Four Seasons. That local expertise is why we're the preferred florist for Brickell residents and the businesses that operate here.",
      zonesTitle: 'Areas we cover in Brickell',
      zonesIntro: 'We deliver across the entire Brickell area, including these specific buildings and zones:',
      zones: [
        'Brickell City Centre (offices and residences)',
        'Four Seasons Hotel & Tower Brickell',
        'SLS Brickell Hotel and SLS Lux',
        'Mandarin Oriental Miami (Brickell Key)',
        'Brickell Flatiron, Echo Brickell, Reach, Rise, Panorama Tower',
        '1010 Brickell, Icon Brickell, The Plaza on Brickell',
        'Office towers along Brickell Avenue and Brickell Bay Drive',
        'Brickell Key residential towers (Carbonell, Asia, Three Tequesta Point)',
        'Mary Brickell Village area',
      ],
      occasionsTitle: 'Popular occasions in Brickell',
      occasionsIntro: 'These are the most common reasons our Brickell clients order flowers from us:',
      occasions: [
        'Corporate gifts and client appreciation deliveries to Brickell offices',
        'Romantic surprises delivered to high-rise condos',
        'Hotel guest welcome bouquets at Four Seasons, SLS and Mandarin Oriental',
        'Birthday and anniversary deliveries to Brickell residents',
        'Sympathy and get-well arrangements to Mercy Hospital nearby',
        'Executive assistant orders for partners, VIP clients and board members',
      ],
      deliveryTitle: 'Delivery information for Brickell',
      deliveryParagraph: "Brickell sits within our core delivery radius from our Miami atelier, so most addresses fall close to our flat-rate zone. Our delivery rate is $25 for the first 0–5 miles and $1.60 per additional mile, up to 90 miles total — doorman and concierge handoff included at no extra cost.",
      faqTitle: 'Brickell delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to Brickell City Centre offices?',
          answer: 'Yes. We deliver directly to the office towers at Brickell City Centre (Three Brickell City Centre, Two Brickell City Centre and SLS Lux). Our courier coordinates with reception or the security desk to ensure the recipient receives the bouquet personally during business hours.',
        },
        {
          question: 'Can you deliver to a guest staying at the Four Seasons or SLS Brickell?',
          answer: "Absolutely. We work regularly with Brickell luxury hotels and follow the concierge handoff process for each property. Just include the guest's full name and check-in date when ordering, and we coordinate directly with the concierge.",
        },
        {
          question: 'How is delivery handled at Brickell high-rise condos?',
          answer: "All major Brickell condos (Echo, Reach, Rise, Brickell Flatiron, Panorama, etc.) accept floral deliveries through their doorman or concierge. We follow each building's specific protocol so your bouquet always reaches the right resident.",
        },
        {
          question: 'What is your delivery timing policy for Brickell?',
          answer: 'Brickell orders follow our standard policy: a minimum of 2 hours preparation time, with same-day delivery available for orders placed before 3PM Miami time. Delivery rate is $25 for the first 0–5 miles and $1.60 per additional mile. Brickell typically falls within or close to our flat-rate zone from our NW 12th St atelier. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–5PM, closed Sundays.',
        },
      ],
      internalLinksTitle: "If you're looking for flower delivery in nearby areas, we also serve:",
      internalLinks: barrioInternalLinks('flower-delivery-brickell'),
      ctaLabel: 'Order Brickell Flower Delivery',
      areaServed: 'Brickell, Miami',
    },
  },
  {
    slug: 'flower-delivery-miami-beach',
    // SPEC §6: H1 pattern "Flower Delivery in <Barrio>" — "Luxury" removed.
    h1: 'Flower Delivery in Miami Beach',
    seoTitle: "Miami Beach Florist | Flower Delivery Miami Beach | Amorelia Luxury Floral Gifts",
    seoDescription: 'Premium flower delivery to Miami Beach hotels, condos and residences. Service to South Beach, Mid-Beach, North Beach, Fisher Island and Sunset Harbour.',
    intro: "Miami Beach is where Miami's glamour lives — from the Art Deco hotels of Ocean Drive to the oceanfront condos of Mid-Beach and the private estates of North Bay Road. Amorelia Luxury Floral Gifts delivers premium, design-forward arrangements across all of Miami Beach. We work directly with concierge teams at the Faena, Setai, Edition, Fontainebleau, W South Beach and dozens of other Miami Beach properties.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Miami Beach florist for same-day delivery',
      whyParagraph: "Miami Beach is a destination — meaning many of our orders are surprises for guests staying at hotels, romantic gestures to condo residents, or events at private estates. We've built relationships with the concierge teams at all major Miami Beach hotels, which means delivery is fast, discreet and properly handed off. We also know which buildings on Collins Avenue, Ocean Drive and West Avenue have specific delivery protocols, so your bouquet doesn't sit at security for hours.",
      zonesTitle: 'Areas we cover in Miami Beach',
      zonesIntro: 'We deliver across all of Miami Beach, including:',
      zones: [
        'South Beach (1st–23rd Street, Ocean Drive, Collins, Washington)',
        'Mid-Beach (Faena District, Fontainebleau, Eden Roc, Edition)',
        'North Beach and Surfside',
        'Fisher Island (driver coordinates ferry — standard delivery rate, no surcharge)',
        'Star Island, Hibiscus Island and Palm Island',
        'South of Fifth (SoFi)',
        'Sunset Harbour and West Avenue condos',
        'Bal Harbour Shops area',
      ],
      occasionsTitle: 'Popular occasions in Miami Beach',
      occasionsIntro: 'Our Miami Beach clients most often order flowers for:',
      occasions: [
        'Hotel guest welcome bouquets and in-room surprises',
        'Romantic surprises to oceanfront condos',
        'Birthday and anniversary deliveries to Miami Beach residents',
        'Wedding and event flowers at Faena, Edition and Setai',
        'Photoshoot and content creation florals',
        'Yacht and superyacht deliveries at Miami Beach Marina',
      ],
      deliveryTitle: 'Delivery information for Miami Beach',
      deliveryParagraph: "Miami Beach addresses sit roughly 8–12 miles from our atelier across the causeways, so most deliveries cost $25 (for the first 5 miles) plus $1.60 per additional mile — typically landing in the $25–$32 range. Maximum delivery distance is 90 miles. Fisher Island deliveries are charged at the standard rate — our driver handles the ferry coordination at no extra cost.",
      faqTitle: 'Miami Beach delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to hotels like Faena, Setai or Edition?',
          answer: 'Yes — we deliver to all major Miami Beach hotels including Faena, The Setai, The Edition, Fontainebleau, W South Beach, 1 Hotel, Eden Roc and many more. We coordinate with the concierge for in-room delivery or guest pickup.',
        },
        {
          question: 'Can you deliver to Fisher Island?',
          answer: "Yes. Fisher Island is only accessible by ferry, but our driver handles the ferry coordination directly with the island's security — there is no additional charge. The standard delivery rate applies ($25 for the first 5 miles plus $1.60 per additional mile), calculated from our atelier to the island.",
        },
        {
          question: 'Do you deliver to yachts at Miami Beach Marina?',
          answer: 'Yes. We coordinate with the marina office and the yacht\'s captain or crew to ensure timely delivery. Common for charter welcomes and onboard celebrations.',
        },
        {
          question: 'How does delivery work for Miami Beach addresses?',
          answer: 'Miami Beach addresses are typically 8–12 miles from our atelier across the causeways, so most deliveries land in the $25–$32 range ($25 for the first 5 miles plus $1.60 per additional mile). The exact cost is calculated at checkout. Every order needs a minimum of 2 hours preparation, and same-day delivery requires placing your order before 3PM Miami time. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–5PM, closed Sundays.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: barrioInternalLinks('flower-delivery-miami-beach'),
      ctaLabel: 'Order Miami Beach flower delivery now',
      areaServed: 'Miami Beach, Florida',
    },
  },
  // ── Restored barrios (CORRECCIONES punto 35: the previous build degraded
  // Coral Gables/Aventura/Kendall by mistake — Dani's exam only degrades
  // Wynwood). Copy restored verbatim from degradedNeighborhoodDrafts.ts;
  // titles re-optimized with the "florist [barrio]" head (punto 17). ──
  {
    slug: 'flower-delivery-coral-gables',
    h1: 'Flower Delivery in Coral Gables, Miami',
    seoTitle: 'Coral Gables Florist | Flower Delivery Coral Gables | Amorelia Luxury Floral Gifts',
    seoDescription: 'Flower delivery to Coral Gables homes, weddings and offices. Premium arrangements for Miracle Mile, Biltmore Hotel area, Gables Estates and Cocoplum.',
    intro: "Coral Gables — known as The City Beautiful — is one of Miami's most elegant neighborhoods, with Mediterranean Revival architecture, tree-lined streets and a culture of refined taste. Amorelia Luxury Floral Gifts delivers handcrafted luxury arrangements to Coral Gables homes, weddings, offices and hotels, including the historic Biltmore Hotel area, Miracle Mile and the prestigious Gables Estates.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Coral Gables florist for same-day delivery',
      whyParagraph: "Coral Gables clients appreciate the difference between mass-market florists and a true atelier. Many of our regular clients here are choosing flowers for weddings at the Biltmore, dinner parties in their Old Cutler Road homes, or executive lunches at the offices around Ponce de Leon Boulevard. We understand the aesthetic of Coral Gables — sophisticated, classic, never flashy — and our arrangements are designed to match that sensibility. We also work directly with several Coral Gables event planners and wedding coordinators.",
      zonesTitle: 'Areas we cover in Coral Gables',
      zonesIntro: 'We deliver across all of Coral Gables, including these specific zones and landmarks:',
      zones: [
        'The Biltmore Hotel and surrounding residential streets',
        'Miracle Mile and the downtown Coral Gables shopping district',
        'Gables Estates (gated community)',
        'Cocoplum and Tahiti Beach',
        'Old Cutler Road residential homes',
        'The Riviera and Granada Golf Course neighborhoods',
        'Ponce de Leon Boulevard office towers',
        'University of Miami area (Coral Gables campus)',
        'Merrick Park and surrounding luxury residences',
      ],
      occasionsTitle: 'Popular occasions in Coral Gables',
      occasionsIntro: 'Our Coral Gables clients most often order flowers for:',
      occasions: [
        'Weddings and bridal bouquets at the Biltmore and other historic venues',
        'Anniversary and dinner party arrangements for family homes',
        'Corporate gifts to law firms and financial offices on Ponce de Leon',
        "Mother's Day deliveries to multi-generational Coral Gables families",
        'Sympathy arrangements for services at Caballero Rivero Woodlawn',
        'University of Miami graduations, performances and faculty gifts',
      ],
      deliveryTitle: 'Delivery information for Coral Gables',
      deliveryParagraph: "Coral Gables sits close to our Miami atelier — most addresses fall right around our 0–5 mile flat zone, so delivery to The Gables typically costs $25. Beyond 5 miles, the rate is $1.60 per additional mile, up to 90 miles total.",
      faqTitle: 'Coral Gables delivery FAQs',
      faqs: [
        {
          question: 'Do you handle wedding flowers at the Biltmore Hotel?',
          answer: 'Yes. We have experience delivering ceremony arrangements, bridal bouquets and reception centerpieces to the Biltmore Hotel and other Coral Gables venues. For full wedding services we recommend a consultation in advance.',
        },
        {
          question: 'Can you deliver to a private home in Gables Estates or Cocoplum?',
          answer: "Yes. We're familiar with the security protocols at Coral Gables gated communities including Gables Estates, Cocoplum, Tahiti Beach and Snapper Creek Lakes. Just provide the recipient's name as it appears on the gate list.",
        },
        {
          question: 'Do you offer flower arrangements for Coral Gables dinner parties?',
          answer: "Absolutely. Many of our Coral Gables clients order centerpieces and entryway arrangements for dinner parties at home. We can match a specific palette or style — just describe the event and we'll design accordingly.",
        },
        {
          question: 'How does office delivery work on Ponce de Leon Boulevard?',
          answer: 'We deliver to office buildings along Ponce de Leon during business hours and coordinate with reception so the recipient gets the arrangement personally. Most Ponce de Leon addresses fall within our $25 flat-rate zone (0–5 miles from our NW 12th St atelier); beyond 5 miles the rate adds $1.60 per additional mile. Every order needs a minimum of 2 hours preparation, with same-day delivery available for orders placed before 3PM Miami time.',
        },
      ],
      internalLinksTitle: 'Looking for flower delivery in surrounding areas? We also serve:',
      internalLinks: barrioInternalLinks('flower-delivery-coral-gables'),
      ctaLabel: 'Order Coral Gables Flower Delivery Now',
      areaServed: 'Coral Gables, Miami',
    },
  },
  {
    slug: 'flower-delivery-kendall',
    h1: 'Flower Delivery in Kendall, Miami',
    seoTitle: 'Kendall Florist | Flower Delivery in Kendall, Miami | Amorelia Luxury Floral Gifts',
    seoDescription: 'Flower delivery to Kendall, Pinecrest and Palmetto Bay. Birthday, anniversary and sympathy bouquets to family homes, hospitals and schools.',
    intro: "Kendall is the suburban heart of Miami-Dade — a community of family homes, schools, parks and shopping centers stretching from the Palmetto Expressway to Pinecrest. Amorelia Luxury Floral Gifts delivers premium fresh arrangements across all of Kendall, Pinecrest and Palmetto Bay. We're the trusted choice for Kendall families who want flowers that are fresher and more thoughtfully designed than what supermarket florists offer.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Kendall florist for same-day delivery',
      whyParagraph: "Kendall residents tell us they switched to Amorelia Luxury Floral Gifts because they were tired of receiving flowers that looked tired the same evening. Our arrangements are made-to-order with flowers that arrive at our atelier mid-week, so what we deliver on Friday wasn't sitting in a cooler since Monday. We deliver to Kendall family homes, to Baptist Hospital and Doctors Hospital, to Dadeland Mall area offices and to schools across the area.",
      zonesTitle: 'Areas we cover in Kendall',
      zonesIntro: 'We deliver throughout Kendall and surrounding areas:',
      zones: [
        'Baptist Hospital of Miami and Doctors Hospital',
        'Dadeland Mall and Dadeland office towers',
        'Pinecrest residential homes (US-1 corridor)',
        'Palmetto Bay neighborhoods',
        'The Falls shopping center area',
        'Kendall Town Center and Kendall Village Center',
        'Kendall Lakes and West Kendall family communities',
        'Killian and Sunset corridor schools and homes',
      ],
      occasionsTitle: 'Popular occasions in Kendall',
      occasionsIntro: 'Our Kendall clients most often order flowers for:',
      occasions: [
        'Birthday bouquets to family homes',
        'Anniversary surprises for couples',
        'Get-well arrangements to Baptist Hospital and Doctors Hospital',
        'Teacher appreciation and graduation flowers for Kendall schools',
        "Mother's Day deliveries to multi-generational families",
        'Sympathy arrangements to local funeral homes and family residences',
      ],
      deliveryTitle: 'Delivery information for Kendall',
      deliveryParagraph: "Kendall sits roughly 8–15 miles from our Miami atelier depending on the address, so a typical Kendall delivery costs $25 for the first 5 miles plus $1.60 per additional mile — most addresses land in the $25–$35 range. Maximum delivery distance is 90 miles.",
      faqTitle: 'Kendall delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to Baptist Hospital and Doctors Hospital?',
          answer: "Yes — we deliver to both hospitals. We coordinate with the patient's room number or with the front desk if you don't have it. For ICU or restricted units, we leave the arrangement at the nursing station with a delivery note.",
        },
        {
          question: 'Can you deliver to a Pinecrest or Palmetto Bay home?',
          answer: 'Absolutely. Pinecrest and Palmetto Bay are within our delivery zone. We deliver to private homes throughout the US-1 corridor, Old Cutler Road and the residential streets between SW 67th Avenue and SW 87th Avenue.',
        },
        {
          question: 'Do you deliver to Kendall schools for teacher gifts or graduations?',
          answer: 'Yes. We deliver to elementary, middle and high schools throughout Kendall — including Sunset, Coral Reef, Killian and Palmetto Senior. We coordinate with the school office for the handoff during school hours.',
        },
        {
          question: 'Do you cover West Kendall and Kendall Lakes?',
          answer: 'Yes — we cover West Kendall, Kendall Lakes and the SW 137th Avenue corridor. These addresses sit farther from our atelier, so the per-mile rate applies ($25 flat for the first 5 miles plus $1.60 per additional mile), but the rest of our policy is the same: 2-hour minimum preparation and same-day delivery for orders placed before 3PM Miami time.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: barrioInternalLinks('flower-delivery-kendall'),
      ctaLabel: 'Order Kendall Flower Delivery Now',
      areaServed: 'Kendall, Miami',
    },
  },
  {
    slug: 'flower-delivery-aventura',
    h1: 'Flower Delivery in Aventura, Miami',
    seoTitle: 'Aventura Florist | Flower Delivery in Aventura | Amorelia Luxury Floral Gifts',
    seoDescription: 'Premium flower delivery to Aventura, Sunny Isles and Bal Harbour. Service to Aventura Mall area, Williams Island, Turnberry and Porto Vita. Same-day before 3PM.',
    intro: "Aventura is North Miami-Dade's upscale enclave — luxury high-rises, waterfront condos, the landmark Aventura Mall and gated communities like Williams Island and Turnberry. Amorelia Luxury Floral Gifts delivers premium handcrafted arrangements across all of Aventura, Sunny Isles Beach and Bal Harbour, with the presentation and concierge coordination these buildings expect. From 50 to 200 roses per bouquet with natural, glitter or painted finish, same-day service is available for orders placed before 3PM.",
    type: 'neighborhood',
    seo: {
      whyTitle: 'Your Aventura florist for same-day delivery',
      whyParagraph: "Aventura is a neighborhood of luxury towers and gated waterfront communities, and delivering here well means knowing the buildings. Our team is familiar with the concierge and front-desk protocols at Williams Island, Turnberry Isle, Porto Vita, Hamptons South and the condo lines along Biscayne Boulevard and Country Club Drive. Many of our Aventura orders are surprises to a resident on a high floor, welcome bouquets for guests, or corporate deliveries to offices around the Aventura Mall district — so discreet, on-time handoff matters. We deliver the same premium, made-to-order arrangements to neighboring Sunny Isles Beach and Bal Harbour.",
      zonesTitle: 'Areas we cover in Aventura',
      zonesIntro: 'We deliver across Aventura, Sunny Isles Beach and Bal Harbour, including these specific zones and landmarks:',
      zones: [
        'Williams Island (gated waterfront community)',
        'Turnberry Isle and the Turnberry towers on Country Club Drive',
        'Porto Vita, Hamptons South and Aventura waterfront condos',
        'Aventura Mall district and surrounding offices',
        'The Point and Point East residential communities',
        'Waterways and the marina area',
        'Sunny Isles Beach condo towers along Collins Avenue',
        'Bal Harbour Shops area and Bal Harbour residences',
      ],
      occasionsTitle: 'Popular occasions in Aventura',
      occasionsIntro: 'Our Aventura clients most often order flowers for:',
      occasions: [
        'Romantic surprises delivered to high-rise condos',
        'Birthday and anniversary deliveries to Aventura residents',
        'Corporate gifts to offices in the Aventura Mall district',
        'Hotel and guest welcome bouquets in Sunny Isles Beach',
        'Wedding and event flowers at Turnberry and Williams Island venues',
        'Sympathy and get-well arrangements across North Miami-Dade',
      ],
      deliveryTitle: 'Delivery information for Aventura',
      deliveryParagraph: "Aventura sits in North Miami-Dade, roughly 12–18 miles from our atelier depending on the address, so a typical Aventura delivery costs $25 for the first 5 miles plus $1.60 per additional mile — most addresses land in the $30–$40 range. Maximum delivery distance is 90 miles, so Aventura, Sunny Isles Beach and Bal Harbour are all well within range.",
      faqTitle: 'Aventura delivery FAQs',
      faqs: [
        {
          question: 'Do you deliver to gated communities like Williams Island or Turnberry?',
          answer: "Yes. We're familiar with the security and concierge protocols at Aventura's gated communities including Williams Island, Turnberry Isle and Porto Vita. Just provide the recipient's name as it appears on the resident or guest list and we coordinate with the front desk.",
        },
        {
          question: 'How is delivery handled at Aventura high-rise condos?',
          answer: "Most Aventura and Sunny Isles condo towers accept floral deliveries through their doorman or concierge. We follow each building's specific protocol along Biscayne Boulevard, Country Club Drive and Collins Avenue so your bouquet always reaches the right resident.",
        },
        {
          question: 'Do you also deliver to Sunny Isles Beach and Bal Harbour?',
          answer: 'Yes. Sunny Isles Beach and Bal Harbour are part of our Aventura delivery zone. We deliver to the condo towers along Collins Avenue and to the Bal Harbour Shops area. These addresses sit farther from our atelier, so the per-mile rate applies ($25 for the first 5 miles plus $1.60 per additional mile), but the rest of our policy is the same.',
        },
        {
          question: 'What is your delivery timing policy for Aventura?',
          answer: 'Aventura orders follow our standard policy: a minimum of 2 hours preparation time, with same-day delivery available for orders placed before 3PM Miami time. Delivery rate is $25 for the first 5 miles plus $1.60 per additional mile, so most Aventura addresses land in the $30–$40 range. Delivery hours: Mon–Fri 8AM–7PM, Sat 8AM–5PM, closed Sundays.',
        },
      ],
      internalLinksTitle: 'Need flowers in nearby areas? We also serve:',
      internalLinks: barrioInternalLinks('flower-delivery-aventura'),
      ctaLabel: 'Order Aventura Flower Delivery Now',
      areaServed: 'Aventura, Miami',
    },
  },
  {
    slug: 'valentines-day-flowers-miami',
    h1: "Valentine's Day Flower Delivery in Miami",
    seoTitle: "Valentine's Day Flowers Miami | Amorelia Luxury Floral Gifts",
    seoDescription: "Order Valentine's Day flowers in Miami with same-day delivery. Handcrafted rose bouquets from 50 to 200 roses. Glitter or natural finish. Order before 3PM.",
    intro: "Make this Valentine's Day unforgettable with a premium handcrafted bouquet from Amorelia Luxury Floral Gifts. We offer the largest selection of rose bouquets in Miami — from classic red roses to custom mixed arrangements. Choose from 50 to 200 roses with natural, glitter, or painted finish. Same-day delivery available across Miami when you order before 3PM. Don't wait until the last minute — order your Valentine's Day flowers today.",
    type: 'seasonal',
  },
  {
    slug: 'mothers-day-bouquets-miami',
    h1: "Mother's Day Bouquets — Miami Delivery",
    seoTitle: "Mother's Day Flowers Miami | Amorelia Luxury Floral Gifts",
    seoDescription: "Premium Mother's Day bouquets delivered across Miami. Hand-designed arrangements for moms, grandmothers and mother figures. Bilingual cards available.",
    intro: "Mother's Day is the busiest flower delivery day of the year in Miami — and the day where freshness, presentation and on-time delivery matter most. Amorelia Luxury Floral Gifts designs premium Mother's Day bouquets in our Miami atelier, with delivery across Brickell, Coral Gables, Miami Beach, Doral, Kendall, Hialeah and the rest of the city. Order early to guarantee your delivery window — Mother's Day fills up fast.",
    type: 'seasonal',
    seo: {
      whyTitle: "Why order Mother's Day flowers from us",
      whyParagraph: "Every Mother's Day, thousands of Miami families order flowers — and most wire-service florists run out of fresh stock by Saturday morning. Because we design every arrangement in our own atelier and source our flowers a full week in advance specifically for Mother's Day, we don't run out. We also expand our delivery team for the holiday weekend, meaning your mom's bouquet arrives on the day, in the time window you specified — not three days late or wilted.",
      zonesTitle: "Mother's Day delivery across Miami",
      zonesIntro: "We deliver Mother's Day bouquets across all of Miami:",
      zones: [
        'Brickell condos, Coral Gables family homes, Miami Beach properties',
        'Hialeah and Doral homes (Día de las Madres bilingual service)',
        'Kendall, Pinecrest and Palmetto Bay residential deliveries',
        'Wynwood lofts and Edgewater high-rises',
        'Aventura, Sunny Isles and Bal Harbour on request',
        'Miami hospitals (Baptist, Mercy, Mount Sinai) for moms in care',
      ],
      occasionsTitle: "Most popular Mother's Day designs",
      occasionsIntro: 'Most popular Mother\'s Day designs:',
      occasions: [
        'Classic peony and garden rose bouquets in soft pinks and creams',
        'Bold tropical arrangements with anthurium, protea and orchids',
        'Long-lasting orchid plants in luxury vessels',
        'Multi-bouquet sends (one for mom + one for grandma or mother-in-law)',
        'Custom-color arrangements matched to her favorite palette',
        'Bilingual cards in English and Spanish for Día de las Madres',
      ],
      deliveryTitle: "Mother's Day delivery information",
      deliveryParagraph: "We deliver across Miami-Dade up to 90 miles from our atelier. Delivery rate is $25 for the first 0–5 miles and $1.60 per additional mile. Every order needs a minimum of 2 hours of preparation. For same-day delivery on Mother's Day weekend, place your order before 3PM Miami time — but we strongly recommend pre-ordering at least 2–3 days in advance, since Mother's Day is our busiest delivery day and same-day windows fill up fast. Delivery hours are Monday to Friday 8AM–7PM and Saturday 8AM–5PM. We're normally closed on Sundays, but we do deliver on Mother's Day Sunday. Free pickup is also available at 7257 NW 12th St, Miami, FL 33126. Full details on our shipping policy page.",
      faqTitle: "Mother's Day flower FAQs",
      faqs: [
        {
          question: "When should I order Mother's Day flowers in Miami?",
          answer: "Ideally one week before Mother's Day. We accept Mother's Day orders up to the morning of (with our 2-hour minimum preparation window and the 3PM same-day cutoff), but specific time windows and premium designs sell out by the Wednesday before. The earlier you order, the more flexibility you have on delivery timing.",
        },
        {
          question: "Can I send flowers to my mom in another part of Miami while I'm away?",
          answer: 'Yes — this is exactly what we do. Many of our Mother\'s Day orders come from clients in New York, California or abroad sending flowers to moms in Miami. We deliver to any Miami neighborhood with full updates and photos when requested.',
        },
        {
          question: 'Do you offer bilingual Día de las Madres cards?',
          answer: 'Yes. All our Mother\'s Day cards can be written in English or Spanish, and we have a selection of pre-designed Día de las Madres options. For Hispanic families across Miami this is one of our most-requested details.',
        },
        {
          question: "Can I send Mother's Day flowers to my mom in the hospital?",
          answer: 'Yes. We deliver to Baptist Hospital, Mercy Hospital, Mount Sinai, Jackson Memorial and other Miami hospitals — and Mother\'s Day is no exception. Just provide the patient name and room number. Standard delivery rates apply ($25 for the first 5 miles plus $1.60 per additional mile).',
        },
      ],
      internalLinksTitle: 'Other categories you might be interested in:',
      internalLinks: [
        { label: 'Gender Reveal Flowers Miami', slug: 'gender-reveal-flowers-miami' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Hialeah (Día de las Madres)', slug: 'flower-delivery-hialeah' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: "Order Mother's Day flowers now",
      areaServed: 'Miami, Florida',
    },
  },
  {
    slug: 'flower-shop-miami',
    // SPEC §6: hub H1 "Flower Shop in Miami" — "Luxury" removed.
    h1: 'Flower Shop in Miami — Amorelia Luxury Floral Gifts',
    seoTitle: "Flower Shop Miami | Miami Florist Delivery | Amorelia Luxury Floral Gifts",
    seoDescription: "Amorelia Luxury Floral Gifts is Miami's luxury florist. Delivery to Brickell, Miami Beach, Coral Gables, Doral, Kendall, Aventura and Hialeah. Premium arrangements made fresh daily.",
    intro: "Amorelia Luxury Floral Gifts is a Miami-based luxury florist delivering premium fresh arrangements across all of Miami-Dade. We're not a wire service or a marketplace — every bouquet is designed and arranged in our Miami atelier, using flowers sourced fresh each week. Citywide delivery to Brickell, Miami Beach, Coral Gables, Doral, Kendall, Aventura, Hialeah and the surrounding neighborhoods.",
    type: 'niche',
    seo: {
      whyTitle: 'Why order from us in Miami',
      whyParagraph: "Most flower deliveries in Miami come from wire services that pass orders to the cheapest available florist — meaning what arrives often doesn't match the photo. We work differently: every order goes through our atelier, where each arrangement is designed by hand. Our flowers arrive directly from premium growers (Ecuador, Holland and local Florida farms) and are stored in cooled conditions until designed. The result is arrangements that last longer, look fresher and arrive looking like the photo.",
      // CORRECCIONES punto 35: H2 "Neighborhoods we deliver to" — REAL <a> to
      // the 7 validated barrios (Brickell/Doral/Miami Beach/Hialeah/Coral
      // Gables/Kendall/Aventura). Only Wynwood (0 searches) stays as a plain
      // H3 mention (punto 16).
      zonesTitle: 'Neighborhoods we deliver to',
      zonesIntro: 'We deliver to every major Miami neighborhood, including:',
      zones: [
        { label: 'Brickell — luxury condos, offices and hotels', slug: 'flower-delivery-brickell' },
        { label: 'Miami Beach — South Beach, Mid-Beach, North Beach and Fisher Island', slug: 'flower-delivery-miami-beach' },
        { label: 'Doral — corporate offices and family homes', slug: 'flower-delivery-doral' },
        { label: 'Hialeah and Hialeah Gardens — bilingual service', slug: 'flower-delivery-hialeah' },
        { label: 'Coral Gables — homes, weddings and Biltmore Hotel area', slug: 'flower-delivery-coral-gables' },
        { label: 'Kendall, Pinecrest and Palmetto Bay — residential deliveries', slug: 'flower-delivery-kendall' },
        { label: 'Aventura, Sunny Isles Beach and Bal Harbour — concierge coordination', slug: 'flower-delivery-aventura' },
        'Wynwood, Design District, Edgewater and Midtown — galleries, studios and lofts',
      ],
      occasionsTitle: 'Popular occasions across Miami',
      occasionsIntro: 'What our Miami clients order most often:',
      occasions: [
        'Birthday and anniversary deliveries',
        'Corporate gifts and weekly office programs',
        'Hotel guest welcome bouquets',
        'Wedding flowers and event florals',
        'Sympathy arrangements and funeral flowers',
        'Photoshoot and content creation florals',
      ],
      deliveryTitle: 'Delivery information across Miami',
      deliveryParagraph: "We deliver across Miami-Dade up to 90 miles from our atelier, with our own drivers — never a wire-service handoff. Our delivery rate is $25 for the first 0–5 miles and $1.60 per additional mile, calculated live from your address at checkout.",
      faqTitle: 'Miami flower shop FAQs',
      faqs: [
        {
          question: "What makes Amorelia Luxury Floral Gifts different from other Miami florists?",
          answer: "Three things: every arrangement is designed by hand in our Miami atelier (no wire service handoffs), our flowers arrive fresh weekly from premium growers, and our delivery team knows the protocols at Miami's hotels, condo towers and gated communities — meaning your bouquet arrives properly and on time.",
        },
        {
          question: 'Which Miami neighborhoods do you deliver to?',
          answer: 'We deliver to every major Miami-Dade neighborhood including Brickell, Miami Beach, Coral Gables, Wynwood, Design District, Doral, Kendall, Pinecrest, Palmetto Bay, Hialeah, Edgewater, Midtown, Aventura and Sunny Isles. Each neighborhood has a dedicated page with specific delivery details.',
        },
        {
          question: 'What are your delivery times and costs?',
          answer: 'Our delivery rate is $25 for the first 0–5 miles and $1.60 per additional mile, up to 90 miles total. Every order requires a minimum of 2 hours preparation. Same-day delivery is available for orders placed before 3PM Miami time. Delivery hours: Monday to Friday 8AM–7PM, Saturday 8AM–5PM (closed Sundays). Free pickup is available at 7257 NW 12th St, Miami, FL 33126.',
        },
        {
          question: 'Do you offer corporate or weekly subscription programs?',
          answer: 'Yes. We work with hotels, restaurants, offices and showrooms across Miami on weekly fresh flower programs. Custom designs, rotating palettes, and dedicated delivery slots. Contact us for a corporate quote.',
        },
      ],
      internalLinksTitle: 'Browse our delivery pages by neighborhood:',
      internalLinks: [...BARRIO_LINKS],
      ctaLabel: 'Browse Our Collections',
      areaServed: 'Miami, Florida',
    },
  },
  {
    slug: 'quinceanera-bouquets-miami',
    h1: 'Quinceanera Bouquets Miami | Custom Arrangements | Amorelia Luxury Floral Gifts',
    seoTitle: 'Quinceanera Bouquets Miami | Amorelia Luxury Floral Gifts',
    seoDescription: 'Custom quinceañera bouquets in Miami. Choose colors, quantity and finish. AI preview available. Same-day delivery or free pickup.',
    intro: "Celebrate her quinceañera with a stunning bouquet from Amorelia Luxury Floral Gifts. Our custom bouquet builder lets you design the perfect arrangement — choose her favorite colors, paper wrapping, quantity (50-200 roses), and finish (natural, glitter, or painted). Add special accessories like crowns, butterflies, or personalized ribbons. Preview your bouquet with AI before ordering. Same-day delivery available across Miami.",
    type: 'niche',
  },
  {
    slug: 'gender-reveal-flowers-miami',
    h1: 'Gender Reveal Flowers in Miami',
    seoTitle: "Gender Reveal Flowers Miami | Amorelia Luxury Floral Gifts",
    seoDescription: 'Custom gender reveal flower arrangements in Miami. Pink, blue or hidden-color reveal bouquets and centerpieces. Delivery to Miami homes and event venues.',
    intro: "A gender reveal is one of the most photographed moments of a pregnancy — and the flowers should match the magic. Amorelia Luxury Floral Gifts designs custom gender reveal arrangements in Miami: bold pink-or-blue bouquets, hidden-color reveal pieces, party centerpieces and statement entrance florals. Available across Miami for last-minute reveals, with full event setups available with advance notice.",
    type: 'niche',
    seo: {
      whyTitle: 'Why order gender reveal flowers from us',
      whyParagraph: "We've designed gender reveal florals for hundreds of Miami families, and we know the small details that make the photos better: how saturated the pink or blue should be to read on camera, how to design reveal arrangements that work for both possible outcomes, and how to coordinate with cake designers and balloon vendors so the whole reveal aesthetic is cohesive. Whether the reveal is at home in Coral Gables, at a venue in Wynwood, or at a beach setup in Miami Beach, our team designs florals that hold up under the South Florida heat and look stunning in every photo.",
      zonesTitle: 'Gender reveal delivery across Miami',
      zonesIntro: 'We deliver gender reveal flowers across all of Miami:',
      zones: [
        'Home reveals across Brickell, Coral Gables, Doral, Kendall, Hialeah',
        'Beach setup reveals at Miami Beach and Key Biscayne',
        'Venue reveals at Wynwood event spaces and private clubs',
        'Hotel reveals at Faena, Edition, Fontainebleau and other Miami Beach properties',
        'Restaurant private dining rooms across the city',
      ],
      occasionsTitle: 'Popular gender reveal floral options',
      occasionsIntro: 'Our most popular gender reveal floral options:',
      occasions: [
        "Pink-or-blue reveal bouquet (we know, you don't, until the moment)",
        'Centerpieces in coordinated pink or blue palettes once gender is known',
        'Entrance floral arches or statement pieces for the reveal venue',
        'Cake table floral surrounds',
        'Photo backdrop floral installations',
        'Take-home mini bouquets for guests as party favors',
      ],
      deliveryTitle: 'Gender reveal delivery information',
      deliveryParagraph: "We deliver reveal bouquets across Miami-Dade up to 90 miles from our atelier ($25 for the first 0–5 miles, $1.60 per additional mile). A single reveal bouquet can go out same-day; for full event setups (arches, centerpieces and installations) book at least 1–2 weeks in advance so we can coordinate design, sourcing and on-site setup.",
      faqTitle: 'Gender reveal flower FAQs',
      faqs: [
        {
          question: 'Can you keep the gender a secret from us until the reveal?',
          answer: "Yes — this is one of our most-requested services. The parents-to-be share the gender confidentially with us (or have their doctor or a friend share it directly), and we design the arrangement so that you don't know what's inside until the moment of the reveal. We're very experienced at keeping the surprise.",
        },
        {
          question: 'How far in advance should we book gender reveal flowers?',
          answer: 'For a single reveal bouquet, our standard 2-hour minimum preparation window applies and same-day delivery is available for orders placed before 3PM Miami time. For full event setups with arches, centerpieces and floral installations, we recommend booking at least 1–2 weeks in advance so we can coordinate design, sourcing and on-site setup with you.',
        },
        {
          question: 'Do you coordinate with cake designers and balloon vendors?',
          answer: "Yes — we regularly coordinate with Miami's top cake designers and event vendors so that the whole reveal aesthetic is cohesive. Just connect us and we'll handle the rest.",
        },
        {
          question: 'Can you deliver to a beach reveal at Miami Beach or Key Biscayne?',
          answer: "Yes. Beach setups require some specific design choices (heat-tolerant flowers, weighted bases that won't blow over) but we've done many of them. Allow extra setup time and let us know about parking access at the beach location.",
        },
      ],
      internalLinksTitle: 'Other event services we offer in Miami:',
      internalLinks: [
        { label: "Mother's Day Bouquets Miami", slug: 'mothers-day-bouquets-miami' },
        { label: 'Flower Delivery Brickell', slug: 'flower-delivery-brickell' },
        { label: 'Flower Delivery Miami Beach', slug: 'flower-delivery-miami-beach' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Book your gender reveal flowers',
      areaServed: 'Miami, Florida',
    },
  },
  {
    slug: '100-roses-bouquet-miami',
    // H1 cleaned from title-style "| … – Amorelia Luxury Floral Gifts" (UI labels/brand are not headings).
    h1: '100 Roses Bouquet in Miami',
    seoTitle: '100 Roses Bouquet Miami | Amorelia Luxury Floral Gifts',
    seoDescription: 'Order a stunning 100 roses bouquet in Miami. Choose your color, finish and paper. Same-day delivery up to 90 miles. Custom AI preview.',
    intro: "A 100-rose bouquet makes a powerful statement. At Amorelia Luxury Floral Gifts, our 100-rose arrangements are handcrafted with the freshest roses and available in every color — white, red, pink, hot pink, yellow, orange, purple, and painted options like black, blue, and green. Choose your finish (natural, glitter, or painted), paper color, and add accessories like crowns, ribbons, or butterflies. Preview your bouquet with AI before ordering. Same-day delivery across Miami up to 90 miles.",
    type: 'niche',
    // SEO long-tail expansion — every keyword taken from the REAL Keyword Planner
    // (geo 2840 US). Verified volumes: "100 roses bouquet" 5,400 · "rose bouquet 100"
    // 5,400 · "100 roses" 5,400 · "100 rose bouquet" 1,600 · "50 roses bouquet" 4,400 ·
    // "200 roses bouquet" 720 · "150 roses bouquet" 320 · "100 red roses bouquet" 390 ·
    // "100 roses bouquet near me" 480 · "100 roses bouquet price" 720 · "100 long stem
    // roses" 390 · "100 roses delivery" 320 · "100 roses same day delivery" 70 ·
    // "100 pink roses" 260 · "100 white roses" 210.
    seo: {
      whyTitle: 'Why order a 100 roses bouquet from us',
      whyParagraph: "A 100 roses bouquet is not an everyday order — it's the grand gesture: an engagement, a landmark anniversary, a proposal, an unforgettable birthday. Because a 100 rose bouquet lives or dies on the quality of every single stem, we hand-build each one to order the morning it ships, using 100 long stem roses sorted for uniform head size and color. Nothing is pre-packed and nothing sits in a cooler for days. And because we run our own builder, the same 100 roses bouquet is available in any single color or as a custom mix — with natural, glitter or painted finishes.",
      zonesTitle: 'Build your 100 roses bouquet — sizes and colors',
      zonesIntro: 'The most-requested ways our Miami clients order a rose bouquet of 100:',
      zones: [
        '100 roses bouquet in classic red — the #1 request for proposals and anniversaries',
        '100 red roses bouquet with long-stem, uniform heads',
        '100 pink roses or 100 white roses for softer, elegant statements',
        'Step down to a 50 roses bouquet for a slightly smaller grand gesture',
        'Step up to a 150 roses bouquet or a 200 roses bouquet for maximum impact',
        'Any color from the builder: white, red, pink, hot pink, yellow, orange, purple, black, blue, green',
        'Natural, glitter or painted finish, with a custom paper color and accessories',
      ],
      occasionsTitle: 'When people send a 100 rose bouquet',
      occasionsIntro: 'The occasions our clients most often choose 100 roses for:',
      occasions: [
        'Marriage proposals and engagements',
        'Milestone wedding anniversaries (10th, 25th, 50th)',
        'Big-birthday surprises and once-a-year grand gestures',
        'Valentine\'s Day statement deliveries',
        'Apologies and reconciliations that need to say it loudly',
        'Stage, red-carpet and VIP welcome arrangements',
      ],
      deliveryTitle: '100 roses bouquet delivery in Miami',
      deliveryParagraph: "We offer 100 roses delivery and same-day service across Miami: place your order before 3PM Miami time and we deliver the same day, up to 90 miles from our atelier ($25 for the first 0–5 miles, $1.60 per additional mile). A 100 roses bouquet is a large build, so for a guaranteed time window on a specific date we recommend ordering a day ahead.",
      faqTitle: '100 roses bouquet FAQs',
      faqs: [
        {
          question: 'How much does a 100 roses bouquet cost in Miami?',
          answer: "The price of a 100 roses bouquet depends on the color, finish (natural, glitter or painted) and any accessories you add. You can see the exact 100 roses bouquet price live in our builder as you customize it — pick your color and finish and the total updates before you order.",
        },
        {
          question: 'Can I get 100 roses delivered same day?',
          answer: 'Yes — we offer 100 roses same day delivery across Miami for orders placed before 3PM Miami time, up to 90 miles from our atelier. A 100-rose arrangement is a large build, so if you need it for a specific date and time window we recommend ordering a day in advance to guarantee it.',
        },
        {
          question: 'Does the 100 roses bouquet come in colors other than red?',
          answer: 'Absolutely. The 100 red roses bouquet is our most popular, but the same 100 rose bouquet is available in white, pink, hot pink, yellow, orange, purple, and painted options like black, blue and green — or as a custom multi-color mix. Choose natural, glitter or painted finish in the builder.',
        },
        {
          question: 'Can I order more or fewer than 100 roses?',
          answer: 'Yes. Our builder goes from 50 to 200 roses, so you can send a 50 roses bouquet for a smaller grand gesture or scale up to a 150 roses bouquet or a 200 roses bouquet for maximum impact. Same customization, same freshness, same-day delivery in Miami.',
        },
      ],
      internalLinksTitle: 'Popular rose bouquets and collections:',
      internalLinks: [
        { label: 'Red Roses Bouquet', slug: 'bouquets/red-roses' },
        { label: "Valentine's Day Flowers Miami", slug: 'valentines-day-flowers-miami' },
        { label: 'Quinceanera Bouquets Miami', slug: 'quinceanera-bouquets-miami' },
        { label: 'Main Miami Flower Shop', slug: 'flower-shop-miami' },
      ],
      ctaLabel: 'Build your 100 roses bouquet',
      areaServed: 'Miami, Florida',
    },
  },

];

export const getLandingPage = (slug: string): LandingPageData | undefined =>
  landingPages.find(p => p.slug === slug);
