import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import JsonLd, { localBusinessSchema, breadcrumbSchema } from "@/components/JsonLd";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * /flowers-that-represent-death — CORRECCIONES punto 20: informational
 * article for "flowers that represent death" 9,900 (LOW) + "flower symbolizing
 * death" 9,900 (LOW) (KEYWORD-RESEARCH-REAL). Mandatory correa a producto:
 * bridges to the funeral & sympathy money page (/funeral-sympathy-flowers-miami)
 * and the white roses collection. Flower-symbolism content is standard
 * general knowledge (same criterion as birthFlowersData). EN-only canonical.
 */

export const revalidate = 3600;

const PATH = "/flowers-that-represent-death";
const TITLE = "Flowers That Represent Death — Meanings & When to Send Them | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "Which flowers symbolize death and mourning — lilies, chrysanthemums, white roses, marigolds and more — what each one means, and what to send to a funeral in Miami.";

const SECTIONS: { id: string; h2: string; paragraphs: string[] }[] = [
  {
    id: "white-lily",
    h2: "White Lily — the classic funeral flower",
    paragraphs: [
      "The white lily is the flower most universally associated with death in Western tradition — especially the peace lily and the stargazer. Lilies represent the soul returning to a state of innocence and peace, which is why they anchor so many funeral sprays and sympathy arrangements. Their strong fragrance and tall, formal silhouette make them the centerpiece flower at services.",
      "When to send them: for the service itself — casket pieces, standing sprays and altar arrangements. Lilies read as formal and reverent, so they suit the funeral home better than the family's living room.",
    ],
  },
  {
    id: "chrysanthemum",
    h2: "Chrysanthemum — death and mourning across cultures",
    paragraphs: [
      "In much of Europe (France, Italy, Spain, Poland) and in several Asian cultures, the chrysanthemum is placed on graves and used almost exclusively for mourning — in those countries you simply do not gift mums for a birthday. In the United States the association is softer, but white chrysanthemums remain a staple of sympathy work, symbolizing truth and grief honored.",
      "When to send them: gravesite arrangements and All Souls' / Día de los Muertos tributes, or as part of a mixed sympathy piece for families with European or Latin American roots — a detail that matters to many Miami families.",
    ],
  },
  {
    id: "white-rose",
    h2: "White Rose — reverence, innocence and farewell",
    paragraphs: [
      "White roses carry the meaning of reverence, purity and remembrance. They are the most versatile mourning flower: appropriate at the service, at the graveside, and — unlike lilies — equally right as a gift to the grieving family's home in the days after the loss.",
      "When to send them: anytime during mourning. A hand-tied arrangement of white roses is the safest, most elegant condolence gesture there is, and it is the one we build most often at our Miami atelier.",
    ],
  },
  {
    id: "marigold",
    h2: "Marigold — Día de los Muertos and remembrance",
    paragraphs: [
      "The marigold (cempasúchil) is the flower of the dead in Mexican tradition: its color and scent are said to guide souls home during Día de los Muertos. Marigolds represent grief, but a grief that celebrates the person's life — bright, warm and full of memory rather than sorrow.",
      "When to send them: ofrendas, memorial anniversaries and Day of the Dead altars. In Miami's Latin American communities this symbolism is alive and deeply appreciated.",
    ],
  },
  {
    id: "carnation",
    h2: "Carnation — enduring love for the departed",
    paragraphs: [
      "Carnations are a mainstay of funeral wreaths and standing sprays because they last long and hold their shape through services and viewings. White carnations mean pure love and remembrance; red ones, admiration; pink carnations are tied in Christian tradition to a mother's undying love.",
      "When to send them: wreaths, crosses and coronas fúnebres — they are the workhorse flower of traditional funeral tributes, especially in Hispanic funeral customs.",
    ],
  },
  {
    id: "gladiolus",
    h2: "Gladiolus — strength of character",
    paragraphs: [
      "Tall spikes of gladiolus honor a person of strong character and moral integrity. They are the backbone of the classic standing spray: their height gives funeral pieces structure and their meaning gives the tribute a message — this was a person of principle.",
      "When to send them: standing sprays and large tribute pieces for someone who was a pillar of their family or community.",
    ],
  },
  {
    id: "other-flowers",
    h2: "Other flowers associated with death and mourning",
    paragraphs: [
      "Several more blooms carry mourning symbolism: dark red roses speak of deep grief and love beyond death; forget-me-nots of remembrance; hyacinths (purple) of sorrow; poppies of eternal sleep and remembrance of the fallen; and orchids — often given as plants — of everlasting love, a living tribute the family keeps.",
      "There is no single 'correct' death flower. The right choice depends on the family's culture, the setting (service, gravesite or home) and the message you want to leave — that is exactly what a florist is for. If in doubt, white flowers are always appropriate.",
    ],
  },
];

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: TITLE,
    description: DESCRIPTION,
    path: PATH,
    type: "article",
    noAlternateEs: true,
  });
}

export default function FlowersThatRepresentDeathPage() {
  const selfUrl = `https://amorelialuxuryfloral.com${PATH}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Flowers That Represent Death: Meanings and When to Send Them",
    description: DESCRIPTION,
    image: DEFAULT_OG_IMAGE,
    author: { "@type": "Organization", name: "Amorelia Luxury Floral Gifts" },
    publisher: {
      "@type": "Organization",
      name: "Amorelia Luxury Floral Gifts",
      logo: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": selfUrl },
    url: selfUrl,
  };
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://amorelialuxuryfloral.com" },
    { name: "Flowers That Represent Death", url: selfUrl },
  ]);

  const toc: TocItem[] = SECTIONS.map((s) => ({ id: s.id, label: s.h2 }));

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[localBusinessSchema(), articleLd, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Flowers That Represent Death" }]} />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            Flowers That Represent Death: Meanings and When to Send Them
          </h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">
            Flowers have carried the language of mourning for centuries — certain blooms say
            farewell, honor a life, or comfort the family better than words can. This guide covers
            the flowers that traditionally represent death and remembrance, what each one means
            across cultures, and which to choose for a service, a gravesite or the family&apos;s
            home. If you need a sympathy arrangement in Miami today, our atelier builds them to
            order with same-day delivery before 3PM.
          </p>

          <TableOfContents items={toc} heading="Jump to a flower" />

          <div className="space-y-14 mt-10">
            {SECTIONS.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-4">{s.h2}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="font-body text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Correa a producto — funeral money page + white roses */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mt-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-3">
              Need sympathy flowers in Miami today?
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              We design funeral and sympathy arrangements to order — casket pieces, standing
              sprays, coronas and white rose tributes — and coordinate delivery directly with
              Miami funeral homes. Same-day for orders before 3PM.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/funeral-sympathy-flowers-miami"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Funeral &amp; sympathy flowers <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/bouquets/white-roses"
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors"
              >
                White roses bouquets <Heart className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
