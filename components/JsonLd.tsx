/**
 * JSON-LD structured data — Server Component.
 *
 * The SPA injected schemas via react-helmet; here they render directly into
 * the HTML (body placement is valid for Google). Schema generators are ported
 * verbatim from the SPA — all business facts (NAP, hours, pricing) are the
 * validated ones. Product schema only emits `offers` with a real price > 0
 * (spec §2.3: never ship a 0-price offer).
 */

import { realReviews, REVIEW_AGGREGATE } from "@/lib/reviewsData";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

const JsonLd = ({ data }: JsonLdProps) => {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
};

export default JsonLd;

// ── Schema generators ──

export const localBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Florist"],
  "@id": "https://amorelialuxuryfloral.com/#localbusiness",
  name: "Amorelia Luxury Floral Gifts",
  url: "https://amorelialuxuryfloral.com",
  telephone: "+17864948647",
  email: "amorelia.luxuryfloral@gmail.com",
  image: "https://amorelialuxuryfloral.com/amorelia-logo.webp",
  priceRange: "$$",
  paymentAccepted: "Visa, Mastercard, American Express, Apple Pay, Google Pay, Shop Pay, Zelle",
  availableLanguage: ["English", "Spanish"],
  address: {
    "@type": "PostalAddress",
    streetAddress: "7257 NW 12th St",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33126",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "08:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "08:00", closes: "17:00" },
  ],
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: 25.7617, longitude: -80.3999 },
    geoRadius: "140000",
  },
  // Reseñas: SOLO se emiten si Amorelia tiene reseñas REALES (nada inventado).
  // Amorelia arranca sin reseñas → no se emite aggregateRating ni review
  // (evita fragmentos rotos / rating 0 que Google penaliza).
  ...(realReviews.length > 0
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: REVIEW_AGGREGATE.ratingValue.toFixed(1),
          reviewCount: REVIEW_AGGREGATE.reviewCount,
          bestRating: String(REVIEW_AGGREGATE.bestRating),
        },
        review: realReviews.map((r) => ({
          "@type": "Review",
          author: { "@type": "Person", name: r.author },
          reviewRating: { "@type": "Rating", ratingValue: String(r.rating), bestRating: "5" },
          inLanguage: r.language,
          datePublished: r.isoDate,
          reviewBody: r.text,
        })),
      }
    : {}),
});

export const serviceSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Same-Day Flower Delivery Miami",
  provider: { "@id": "https://amorelialuxuryfloral.com/#localbusiness" },
  areaServed: { "@type": "City", name: "Miami" },
  description: "Same-day flower delivery across Miami up to 90 miles. Order before 3PM. $30 flat rate for 0-10 miles, $1.60/mile after.",
  offers: { "@type": "Offer", price: "30.00", priceCurrency: "USD" },
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Amorelia Luxury Floral Gifts",
  url: "https://amorelialuxuryfloral.com",
});

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Amorelia Luxury Floral Gifts",
  url: "https://amorelialuxuryfloral.com",
  logo: "https://amorelialuxuryfloral.com/amorelia-logo.webp",
  image: "https://amorelialuxuryfloral.com/amorelia-logo.webp",
  telephone: "+17864948647",
  email: "amorelia.luxuryfloral@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "7257 NW 12th St",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33126",
    addressCountry: "US",
  },
  sameAs: [
    "https://www.instagram.com/amorelialuxury",
    "https://www.facebook.com/share/19G6f7g6c5/",
  ],
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(faq => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});

export const productSchema = (name: string, description: string, price: number, image?: string, nameSuffix = " Miami") => ({
  "@context": "https://schema.org",
  "@type": "Product",
  // `nameSuffix` lets each page align the schema name with its visible H1
  // (e.g. " Bouquet Miami" for bouquets, " Miami" for room decors).
  name: `${name}${nameSuffix}`,
  description,
  brand: { "@type": "Brand", name: "Amorelia Luxury Floral Gifts" },
  ...(image ? { image } : {}),
  // Only emit a (valid) Offer when there is a real price (> 0). Google rejects
  // an Offer with price 0 / missing, which would re-trigger the same critical.
  ...(price > 0
    ? {
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "Amorelia Luxury Floral Gifts" },
        },
      }
    : {}),
});

/**
 * ItemList schema for collection / listing pages.
 * `items` must already be in display order. URLs are absolute web routes.
 */
export const itemListSchema = (
  items: { name: string; url: string; image?: string; price?: number }[],
  listName?: string,
  // Availability for the emitted Offers. Defaults to InStock; seasonal/locked
  // collections pass "https://schema.org/OutOfStock" so we never tell Google a
  // blocked product is buyable.
  availability = "https://schema.org/InStock",
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  ...(listName ? { name: listName } : {}),
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => {
    // Only items with a REAL price (> 0) are emitted as a full Product with an
    // Offer — Google requires offers/review/aggregateRating on every Product.
    const hasPrice = typeof item.price === "number" && item.price > 0;
    return {
      "@type": "ListItem",
      position: i + 1,
      url: item.url,
      name: item.name,
      ...(hasPrice
        ? {
            item: {
              "@type": "Product",
              name: item.name,
              url: item.url,
              ...(item.image ? { image: item.image } : {}),
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: item.price!.toFixed(2),
                availability,
                seller: { "@type": "Organization", name: "Amorelia Luxury Floral Gifts" },
              },
            },
          }
        : {}),
    };
  }),
});

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

export const articleSchema = (headline: string, slug: string, datePublished: string, image?: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline,
  author: { "@type": "Organization", name: "Amorelia Luxury Floral Gifts" },
  publisher: {
    "@type": "Organization",
    name: "Amorelia Luxury Floral Gifts",
    logo: { "@type": "ImageObject", url: "https://amorelialuxuryfloral.com/amorelia-logo.webp" },
  },
  datePublished,
  dateModified: datePublished,
  ...(image ? { image } : {}),
  url: `https://amorelialuxuryfloral.com/blog/${slug}`,
});

export const blogPostingSchema = (args: {
  headline: string;
  slug: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  description?: string;
  author?: string;
  inLanguage?: string;
  /** Full canonical URL override (used for /es/blog/<slug> posts). */
  url?: string;
}) => {
  const url = args.url || `https://amorelialuxuryfloral.com/blog/${args.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: args.headline,
    ...(args.description ? { description: args.description } : {}),
    ...(args.image ? { image: args.image } : {}),
    datePublished: args.datePublished,
    dateModified: args.dateModified || args.datePublished,
    inLanguage: args.inLanguage || "en-US",
    author: { "@type": "Organization", name: args.author || "Amorelia Luxury Floral Gifts" },
    publisher: {
      "@type": "Organization",
      name: "Amorelia Luxury Floral Gifts",
      logo: {
        "@type": "ImageObject",
        url: "https://amorelialuxuryfloral.com/amorelia-logo.webp",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
};

export const homepageFaqs = [
  { question: "Do you offer same-day flower delivery in Miami?", answer: "Yes! We offer same-day delivery across Miami up to 90 miles. Order before 3PM and your bouquet will be delivered today. Minimum 2 hours preparation time." },
  { question: "How much does flower delivery cost in Miami?", answer: "$30 flat rate for the first 10 miles. $1.60 per mile from 10 to 90 miles. Free in-store pickup available at 7257 NW 12th St, Miami, FL 33126." },
  { question: "Can I choose the size and finish of my bouquet?", answer: "Yes. On every bouquet you choose the number of roses (from 50 to 200), the finish (natural, painted or glitter) and can add accessories like a note or butterflies at checkout." },
  { question: "What is the difference between glitter and natural bouquets?", answer: "Natural bouquets use fresh roses in their original color. Glitter bouquets have a premium glitter coating applied to the petals for a glamorous, long-lasting effect." },
  { question: "What flowers are best for birthdays?", answer: "For birthdays we recommend bright single-color bouquets like Fuchsia Glow, Golden Sunshine or Amber Radiance, or a vibrant mixed-color bouquet in the recipient's favorite tones." },
  { question: "Can I schedule a delivery for a specific time?", answer: "Yes, you can request a preferred delivery window at checkout. Same-day delivery requires ordering before 3PM with a minimum 2-hour preparation time." },
];
