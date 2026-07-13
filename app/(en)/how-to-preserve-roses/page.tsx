import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import TableOfContents, { type TocItem } from "@/components/TableOfContents";
import JsonLd, { localBusinessSchema, breadcrumbSchema } from "@/components/JsonLd";
import { buildMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";

/**
 * /how-to-preserve-roses — CORRECCIONES punto 20: informational article for
 * the preservation cluster ("silica gel for drying flowers" 18,100 ·
 * "preserving wedding bouquet" 12,100 · "preserving bridal bouquets" 12,100 ·
 * "preserved flowers in resin" 1,900 — KEYWORD-RESEARCH-REAL). Correa a
 * producto REAL: fresh roses (/bouquets/red-roses) and the wedding lead page.
 * Amorelia does NOT sell preserved roses (confirmed 2026-07-11) — this article
 * must never claim otherwise. How-to content is standard craft general
 * knowledge. EN-only canonical.
 */

export const revalidate = 3600;

const PATH = "/how-to-preserve-roses";
const TITLE = "How to Preserve Roses — Silica Gel, Air-Drying, Pressing & Resin | Amorelia Luxury Floral Gifts";
const DESCRIPTION =
  "How to preserve roses and keep a bouquet forever: silica gel drying, air-drying, pressing, wax and resin — step by step, plus how professionals preserve bridal bouquets.";

const SECTIONS: { id: string; h2: string; paragraphs: string[] }[] = [
  {
    id: "silica-gel",
    h2: "Silica gel — the best way to dry roses at home",
    paragraphs: [
      "Silica gel is the gold standard for home preservation because it dries the flower while holding its three-dimensional shape and most of its color. It is not a gel but a sand-like desiccant, sold in craft stores, and it is reusable.",
      "How to do it: pour 1–2 inches of silica gel into an airtight container, trim the rose stem to about an inch, sit the bloom upright, then gently pour more gel around and between the petals until the flower is completely buried. Seal the container and leave it for 3–7 days (thicker, denser roses need the full week). Uncover slowly, pour the gel off at an angle and brush the residue away with a soft paintbrush.",
      "The result keeps the rose's shape and color far better than hanging it to dry — which is why silica gel is what most keepsake framers use for bridal bouquets. Handle the finished flower gently: dried petals are brittle.",
    ],
  },
  {
    id: "air-drying",
    h2: "Air-drying — the classic hang-upside-down method",
    paragraphs: [
      "Air-drying is the simplest method: strip the lower leaves, tie 3–6 stems together with twine, and hang them upside down in a dark, dry, well-ventilated place for two to three weeks. Hanging them inverted keeps the stems straight and the heads from drooping as they dry.",
      "Expect the trade-off: air-dried roses darken (reds go burgundy, whites go cream) and the petals contract into a vintage, papery look. Keep them out of direct sunlight afterwards — UV fades dried flowers fast. A light mist of unscented hairspray helps reduce petal shedding.",
    ],
  },
  {
    id: "pressing",
    h2: "Pressing — for frames, cards and keepsake albums",
    paragraphs: [
      "Pressing flattens the rose but preserves it beautifully for two-dimensional keepsakes. Place petals or whole thin blooms between two sheets of parchment paper inside a heavy book, stack more weight on top, and change the paper every few days. In two to four weeks the flowers are fully pressed and paper-dry.",
      "Pressed roses work best framed behind glass, in wedding invitations kept as mementos, or in resin bookmarks. For thick, many-petaled roses, press individual petals rather than the whole head.",
    ],
  },
  {
    id: "wax-resin",
    h2: "Wax dipping and resin — showpiece preservation",
    paragraphs: [
      "Wax dipping gives a fresh rose a few extra months of soft, natural-looking life: melt paraffin, let it cool until just workable, dip the bloom for a few seconds, and hang it to set. It is a short-term preservation but the result looks remarkably fresh.",
      "Resin is the opposite — permanent. Petals or small dried blooms are cast inside clear epoxy to make paperweights, rings, bookmarks and display blocks. Always dry the flower first (silica gel gives the best result); trapped moisture will cloud the resin. 'Preserved flowers in resin' keepsakes are one of the most popular ways couples keep wedding flowers forever.",
    ],
  },
  {
    id: "bridal-bouquet",
    h2: "Preserving a wedding bouquet — do this first",
    paragraphs: [
      "The most-preserved flowers in the world are bridal bouquets — and the biggest mistake is waiting. Preservation works dramatically better on fresh flowers, so decide before the wedding, keep the bouquet in water and out of the sun during the reception, and start (or ship it to a professional preservationist) within 2–3 days.",
      "Professionals typically freeze-dry or silica-dry the bouquet and mount it in a shadow box or cast it in resin. If you are planning your flowers now, tell your florist you intend to preserve the bouquet — flower choice matters: roses, and sturdier blooms in general, preserve far better than delicate soft-petaled varieties.",
    ],
  },
  {
    id: "professional",
    h2: "What about professionally preserved roses?",
    paragraphs: [
      "Everything above dries the flower. Professional preservation is a different process entirely: fresh roses are infused with a glycerin solution that replaces the sap, so the rose stays soft, flexible and full-color for one to three years — no water, no sunlight, no care. That is what 'preserved roses' or 'rosas eternas' means. They are produced by specialist preservation studios and sold as finished pieces.",
      "One tip that matters more than the method: preservation always works best on the freshest possible roses. If you're starting with a bouquet, begin any of the methods above within the first two or three days — the fresher the bloom, the better the shape and color hold.",
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

export default function HowToPreserveRosesPage() {
  const selfUrl = `https://amorelialuxuryfloral.com${PATH}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Preserve Roses: Silica Gel, Air-Drying, Pressing and Resin",
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
    { name: "How to Preserve Roses", url: selfUrl },
  ]);

  const toc: TocItem[] = SECTIONS.map((s) => ({ id: s.id, label: s.h2 }));

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={[localBusinessSchema(), articleLd, breadcrumbs]} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "How to Preserve Roses" }]} />

          <h1 className="font-title-retro text-3xl md:text-5xl text-primary mb-4">
            How to Preserve Roses: Every Method That Actually Works
          </h1>
          <p className="font-body text-base md:text-lg text-foreground leading-relaxed mb-8">
            A rose worth keeping deserves better than wilting in a vase. Whether it&apos;s a
            single stem from a first date or an entire bridal bouquet, these are the methods that
            actually preserve roses — from silica gel drying (the home gold standard) to pressing,
            wax, resin and professional glycerin preservation — with honest notes on what each
            one does to color and shape.
          </p>

          <TableOfContents items={toc} heading="Jump to a method" />

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

          {/* Correa a producto REAL — fresh roses + wedding lead page */}
          <section className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mt-14">
            <h2 className="font-title-retro text-2xl md:text-3xl text-primary mb-3">
              Start with roses worth preserving
            </h2>
            <p className="font-body text-sm md:text-base text-muted-foreground mb-6">
              Every method above works best on fresh, sturdy blooms. Our roses are hand-tied in
              Miami the morning of delivery — same-day across Miami-Dade when you order before
              3PM. Planning a wedding? Tell us you intend to preserve the bouquet and we&apos;ll
              design it with preservation in mind.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/bouquets/red-roses"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Red roses bouquets <Package className="w-4 h-4" />
              </Link>
              <Link
                href="/wedding-flowers-miami"
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-4 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/5 transition-colors"
              >
                Wedding flowers Miami <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
