import type { Metadata } from "next";
import LazyMapEmbed from "@/components/LazyMapEmbed";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles, Star, Store, Truck, Flower2, Plane } from "lucide-react";
import JsonLd, { localBusinessSchema, serviceSchema, websiteSchema, faqSchema, homepageFaqs } from "@/components/JsonLd";
import DynamicClusters from "@/components/DynamicClusters";
import { WaveTop, WaveBottom } from "@/components/WaveDivider";
import { getTranslator, localizePath, type Language } from "@/i18n";
import { buildMetadata } from "@/lib/seo";
import { FOTO_DE_PORTADA, FOTO_DE_PORTADA_SRCSET } from "@/lib/constants";
import { COLOR_COLLECTIONS, productsForColor, colorCollectionForProduct } from "@/lib/colorCollections";
import { bouquetProducts } from "@/lib/catalogData";
import { occasionsByTier } from "@/lib/occasionPagesData";
import { landingPages } from "@/lib/landingPagesData";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import GoogleLogo from "@/components/GoogleLogo";
import HappyCustomersLine from "@/components/HappyCustomersLine";
import ReviewerAvatar from "@/components/ReviewerAvatar";
import { REVIEW_AGGREGATE, realReviews } from "@/lib/reviewsData";
import { GBP_CID_URL } from "@/lib/constants";
import { fetchProductSummary, shopifyImageWidth } from "@/lib/shopify";

/**
 * HOME view (EN + ES) — structure per SPEC-SSR-REBUILD §6:
 *   H1  EN: Miami Flower Delivery — Fresh Roses & Bouquets, Same Day
 *       ES: t("home.heroTitle") — the validated SPA Spanish H1.
 *   H2s ordered by search volume:
 *     1. Same-Day Delivery (90.5k)
 *     2. Color cluster — REAL LINKS (native ES slugs on /es)
 *     3. Occasion cluster — REAL LINKS (native ES slugs on /es)
 *     4. Custom AI builder
 *     5. Prices ("From $76" as a meaningful H2, not a bare UI label)
 *     6. Why Amorelia Luxury Floral Gifts
 *     7. Neighborhoods block (Dani §1.1) — 8 barrios + hub, REAL LINKS.
 *        The barrio pages are EN-only (same as the live site) → the chips
 *        keep their EN labels on /es too (they point at EN pages).
 *     8. New arrivals (dynamic cluster)
 *   All copy comes from the validated SPA translations / data — nothing invented.
 *   Entrance animations are CSS-only (the SPA's framer-motion initial states
 *   caused hydration error #418 — do not reintroduce them).
 */

export function homeMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("seo.home.title"),
    description: t("seo.home.description"),
    path: "/",
    language,
  });
}

export default async function HomeView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);

  const tickerTexts = [
    t("ticker.bestQuality"),
    t("ticker.unbeatablePrices"),
    t("ticker.handcrafted"),
    t("ticker.sameDayDelivery"),
    t("ticker.rosesPerBouquet"),
    t("ticker.finishOptions"),
  ];

  // Color cluster cards: one representative product per color collection.
  // The image is fetched LIVE from Shopify on the server and falls back to the
  // catalog image (placeholder until Amorelia uploads its own photos).
  const colorCards = (
    await Promise.all(
      COLOR_COLLECTIONS.map(async (c) => {
        const products = productsForColor(bouquetProducts, c);
        if (products.length === 0) return null;
        // Prefer a pure single-color bouquet as the card image (a red+white
        // bicolor also "matches" red, but shouldn't represent the red card).
        const rep =
          products.find((p) => colorCollectionForProduct(p)?.color === c.color) || products[0];
        // The rep's Shopify photo can be momentarily missing (mid-edit in the
        // admin) — walk the collection until SOME product yields an image so
        // the card never renders with an empty src.
        let rawImage = "";
        for (const candidate of [rep, ...products.filter((p) => p !== rep)]) {
          const live = await fetchProductSummary(candidate.shopifyHandle);
          if (live?.featuredImage?.url) { rawImage = live.featuredImage.url; break; }
        }
        if (!rawImage) rawImage = rep.image;
        if (!rawImage) return null;
        return {
          color: c.color,
          // Native ES slug on /es (not just a prefix) — same as the SPA.
          href: isEs ? `/es/bouquets/${c.slugEs}` : `/bouquets/${c.slug}`,
          label: t(`nav.${c.color}Roses`),
          count: products.length,
          image: shopifyImageWidth(rawImage, 400),
          imageSrcSet: `${shopifyImageWidth(rawImage, 400)} 400w, ${shopifyImageWidth(rawImage, 800)} 800w`,
        };
      }),
    )
  ).filter((c) => c !== null);

  // Occasion cluster: Mother's Day (live collection) + Tier-1 occasion pages
  // + the dedicated funeral money page (plan §3 — replaces the old sympathy
  // collection).
  const occasionLinks = [
    { href: l("/mothers-day"), label: t("nav.mothersDayBouquets"), icon: Heart },
    ...occasionsByTier(1).map((o) => ({
      href: isEs ? `/es/collections/${o.slugEs}` : `/collections/${o.slug}`,
      label: isEs ? o.h1.es.replace(" en Miami", "") : o.h1.en.replace(" in Miami", ""),
      icon: o.slug === "birthday-flowers" || o.slug === "christmas-flowers" ? Sparkles : Heart,
    })),
    {
      href: isEs ? "/es/flores-funeral-miami" : "/funeral-sympathy-flowers-miami",
      label: isEs ? "Flores para Funeral y Arreglos Fúnebres" : "Funeral & Sympathy Flowers",
      icon: Heart,
    },
    // Wedding lead page (plan §6 — replaces the old wedding collection).
    {
      href: "/wedding-flowers-miami",
      label: isEs ? "Flores para Boda y Ramos de Novia" : "Wedding Flowers & Bridal Bouquets",
      icon: Heart,
    },
  ];

  // Neighborhood block (Dani §1.1): the 8 barrio landing pages + the hub.
  // Barrio pages are EN-only canonicals → the href always points to the EN
  // page, but the CHIP LABEL follows the current language so the ES home isn't
  // peppered with English ("Flores en Brickell" vs "Flower Delivery in Brickell").
  const neighborhoods = landingPages
    .filter((p) => p.type === "neighborhood")
    .map((p) => {
      const name = p.h1.replace("Flower Delivery in ", "").replace(/,? Miami$/, "").trim();
      return { href: `/${p.slug}`, label: isEs ? `Flores en ${name}` : `Flower Delivery in ${name}` };
    });

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={serviceSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={faqSchema(homepageFaqs)} />

      {/* Hero */}
      <section className="relative h-[70vh] md:h-screen flex items-end md:items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={FOTO_DE_PORTADA}
            srcSet={FOTO_DE_PORTADA_SRCSET}
            sizes="100vw"
            width={1920}
            height={1080}
            alt={
              isEs
                ? "Amorelia Luxury Floral Gifts Miami – Ramos de rosas artesanales con entrega el mismo día"
                : "Amorelia Luxury Floral Gifts Miami – Fresh Handcrafted Rose Bouquets Same-Day Delivery"
            }
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-foreground/85 via-foreground/50 to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 pb-10 md:pb-0">
          <div className="max-w-xl">
            <p className="font-subtitle-script text-primary-foreground/70 text-lg md:text-2xl mb-2 md:mb-4">{t("home.heroSubtitle")}</p>
            <h1 className="font-display text-3xl md:text-6xl font-bold text-primary-foreground leading-tight mb-3 md:mb-6">
              {isEs ? t("home.heroTitle") : <>Luxury Rose Bouquets in Miami — Same-Day Delivery</>}
            </h1>
            <p className="text-primary-foreground/80 font-body text-sm md:text-lg mb-5 md:mb-8 leading-relaxed">
              {t("home.heroDescription")}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link href={l("/bouquets")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 md:px-8 py-3 md:py-4 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
                {t("home.viewBouquets")} <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options Bar */}
      <section className="py-5 md:py-6 bg-cream border-y border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-3 md:gap-12 flex-wrap md:flex-nowrap">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Store className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <span className="font-body text-[9px] md:text-xs tracking-wider text-foreground uppercase whitespace-nowrap">{t("home.storePickup")}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-primary/15 shrink-0" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Truck className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <span className="font-body text-[9px] md:text-xs tracking-wider text-foreground uppercase whitespace-nowrap">{t("home.homeDelivery")}</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-primary/15 shrink-0" />
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Plane className="w-3 h-3 md:w-4 md:h-4 text-primary" />
              </div>
              <span className="font-body text-[9px] md:text-xs tracking-wider text-foreground uppercase flex flex-wrap items-center justify-center gap-1">
                {t("home.nationwideShipping")}
                <span className="normal-case tracking-normal text-muted-foreground">·</span>
                <span className="inline-flex items-center gap-1 normal-case tracking-normal text-muted-foreground">
                  {t("home.poweredBy")}
                  <img src="/fedex-logo.webp" alt="FedEx" width={150} height={42} loading="lazy" className="h-3 md:h-3.5 w-auto inline-block" />
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Social-proof strip — compact reinforcement above the fold (jul 2026).
          Placed right before the first H2 (Same-Day) so visitors see the real
          5.0 Google rating and the 10,000+ served datum the moment they land.
          Reuses the shared review primitives (ReviewerAvatar / stars +
          REVIEW_AGGREGATE / GoogleLogo / HappyCustomersLine) — NADA INVENTADO.
          The full "What Our Clients Say" block (id="reviews") stays below; this
          is a short refuerzo, not a duplicate. The ★★★★★ 5.0 links to it. */}
      {REVIEW_AGGREGATE.reviewCount > 0 && (
      <section className="py-3.5 md:py-4 bg-cream/50 border-b border-primary/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-x-3 gap-y-1.5 flex-wrap text-center">
            {/* ★★★★★ 5.0 on Google → smooth-scrolls to the reviews section below. */}
            <a
              href="#reviews"
              className="group inline-flex items-center gap-1.5"
              aria-label={isEs ? "5.0 sobre 5 en Google — ver reseñas" : "5.0 out of 5 on Google — see reviews"}
            >
              {/* Reviewer initials (J / L / Z) — same avatars as the rating bar. */}
              <span className="flex -space-x-2 items-center mr-0.5" aria-hidden="true">
                {realReviews.map((r) => (
                  <ReviewerAvatar
                    key={r.author}
                    name={r.author}
                    profilePhoto={r.profilePhoto}
                    size="sm"
                    className="border-2 border-cream"
                  />
                ))}
              </span>
              <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </span>
              <span className="font-body text-sm font-semibold text-foreground">
                {REVIEW_AGGREGATE.ratingValue.toFixed(1)}
              </span>
              <span className="font-body text-xs sm:text-sm text-muted-foreground inline-flex items-center gap-1 group-hover:underline underline-offset-4">
                {isEs ? "en" : "on"}
                <GoogleLogo className="h-4" />
              </span>
            </a>
            <span className="hidden sm:inline-block w-px h-4 bg-primary/25" aria-hidden="true" />
            {/* REAL authority datum (shared wording — HappyCustomersLine), brand wine. */}
            <span className="font-body text-xs sm:text-sm font-semibold text-primary tracking-wide">
              <HappyCustomersLine language={language} />
            </span>
          </div>
        </div>
      </section>
      )}

      {/* H2 #1 — Same-Day Delivery (highest volume: 90.5k) */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6 text-left md:text-center">
          <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-4">{t("home.deliveryTitle")}</h2>
          <p className="text-muted-foreground font-body max-w-lg md:mx-auto">
            {t("footer.sameDayDelivery")}
          </p>
          <p className="text-muted-foreground font-body max-w-lg md:mx-auto mt-1">{t("home.deliverySubtitleLine1")}</p>
          <p className="text-muted-foreground font-body max-w-lg md:mx-auto mt-1">{t("home.deliverySubtitleLine2")}</p>
          <div className="mt-6">
            {/* Transactional same-day page (SPEC §4 — 90.5k, linked from home). */}
            <Link href={isEs ? "/es/collections/entrega-el-mismo-dia" : "/collections/same-day-delivery"}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-body text-xs md:text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg">
              {t("nav.sameDayDelivery")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* H2 #2 — Color cluster (REAL links, live Shopify images) */}
      <section className="py-4 pb-16 md:pb-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary capitalize">{t("clusters.byColor")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {colorCards.map((card) => (
              <Link key={card.color} href={card.href} className="group block">
                <div className="relative overflow-hidden rounded-none mb-4 aspect-square">
                  <img
                    src={card.image}
                    srcSet={card.imageSrcSet}
                    sizes="(min-width:1024px) 20vw, (min-width:768px) 33vw, 50vw"
                    alt={`${card.label} Miami – Amorelia Luxury Floral Gifts`}
                    loading="lazy"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-foreground/10 group-hover:bg-foreground/25 transition-colors" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground text-center uppercase tracking-wide">
                  {card.label}
                  <span className="ml-1.5 font-body text-xs text-muted-foreground normal-case tracking-normal">({card.count})</span>
                </h3>
              </Link>
            ))}
            <Link href={l("/bouquets")} className="group flex items-center justify-center rounded-lg border border-border aspect-square mb-4 hover:border-primary transition-colors">
              <span className="font-body text-xs tracking-widest uppercase text-muted-foreground group-hover:text-primary transition-colors inline-flex items-center gap-2">
                {t("nav.allColors")} <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker (CSS-only marquee) */}
      <div className="relative mt-[-1px]">
        <WaveTop />
        <div className="bg-primary py-4 overflow-hidden">
          <div className="flex whitespace-nowrap w-max will-change-transform animate-marquee motion-reduce:animate-none">
            {[...Array(2)].map((_, loop) => (
              <div key={loop} className="flex items-center gap-8 md:gap-12 px-4 md:px-6 shrink-0">
                {tickerTexts.map((text, i) => (
                  <span key={i} className="font-body text-xs md:text-sm tracking-widest uppercase text-primary-foreground flex items-center gap-8 md:gap-12 shrink-0">
                    {text}
                    <Star className="w-3 h-3 fill-primary-foreground text-primary-foreground shrink-0" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <WaveBottom />
      </div>



      {/* H2 #6 — Why Amorelia Luxury Floral Gifts */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-4">{t("home.whyUs.title")}</h2>
            <p className="text-muted-foreground font-body max-w-lg mx-auto">{t("home.whyUs.subtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 max-w-6xl mx-auto">
            {[
              { Icon: Flower2, title: t("home.whyUs.value1Title"), desc: t("home.whyUs.value1Desc") },
              { Icon: Truck, title: t("home.whyUs.value2Title"), desc: t("home.whyUs.value2Desc") },
              { Icon: Sparkles, title: t("home.whyUs.value3Title"), desc: t("home.whyUs.value3Desc") },
              { Icon: Heart, title: t("home.whyUs.value4Title"), desc: t("home.whyUs.value4Desc") },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center px-2 md:px-4">
                <Icon className="h-8 w-8 md:h-10 md:w-10 text-primary mb-3 md:mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-sm md:text-lg font-semibold text-foreground uppercase tracking-wide mb-2">{title}</h3>
                <p className="text-muted-foreground font-body text-xs md:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews — the 3 REAL Google reviews (RESENAS-REALES.md, verbatim,
          all 5★ — CORRECCIONES punto 3). aggregateRating lives in the
          LocalBusiness schema node only (punto 29). */}
      {REVIEW_AGGREGATE.reviewCount > 0 && (
      <section id="reviews" className="scroll-mt-28 py-16 md:py-20 bg-cream/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-3">
              {isEs ? "Lo Que Dicen Nuestros Clientes" : "What Our Clients Say"}
            </h2>
            <p className="font-body text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${REVIEW_AGGREGATE.ratingValue} / 5`}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </span>
              <span className="font-semibold text-foreground">{REVIEW_AGGREGATE.ratingValue.toFixed(1)}</span>
              {/* Opción A (jul 2026): "★★★★★ 5.0 on Google" without shouting
                  the review count (real 3 stays in the LocalBusiness schema). */}
              <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                {isEs ? "reseñas reales en" : "real reviews on"}
                <GoogleLogo className="h-4" />
              </a>
            </p>
            {/* REAL authority datum (shared wording — HappyCustomersLine):
                own line under the rating so it never wraps on mobile.
                Styled as a brand statement (wine/primary, semibold) —
                feedback Eric jul 2026: it read too plain in gray. */}
            <p className="font-body text-xs sm:text-sm font-semibold text-primary tracking-wide mt-1 whitespace-nowrap">
              <HappyCustomersLine language={language} />
            </p>
          </div>
          {/* Shared carousel component (also used on the 48 product fichas)
              — components/ReviewsCarousel.tsx, extracted 1:1 from here. */}
          <div className="max-w-6xl mx-auto">
            <ReviewsCarousel language={language} />
          </div>
        </div>
      </section>
      )}

      {/* H2 #7 — Neighborhoods (Dani §1.1: 8 barrios + hub, REAL links) + GBP map.
          ES heading composed from validated fragments ("Envío de Flores" +
          "barrios de Miami" — both in the SPA translations). */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-left md:text-center mb-8">
            <h2 className="font-title-retro text-4xl md:text-5xl text-primary mb-4">
              {isEs ? "Envío de Flores en los Barrios de Miami" : "Flower Delivery in Miami Neighborhoods"}
            </h2>
            <p className="text-primary font-body text-sm font-semibold mt-3">{t("home.deliveryAddress")}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto mb-10">
            {neighborhoods.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground font-body text-xs md:text-sm transition-all"
              >
                {n.label}
              </Link>
            ))}
          </div>
          <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-lg">
            {/* GBP listing embed (spec §2.7 — the business's own map, not a generic locator) */}
            <LazyMapEmbed
              src="https://www.google.com/maps?q=7257+NW+12th+St,+Miami,+FL+33126&output=embed"
              className="block h-[320px] w-full rounded-lg align-top md:h-[420px] border-0"
              title={isEs ? "Ubicación de Amorelia Luxury Floral Gifts Miami" : "Amorelia Luxury Floral Gifts Miami Location"}
              placeholderLabel={isEs ? "Mapa" : "Map"}
              allowFullScreen
            />
          </div>
          <div className="text-center mt-4 font-body text-sm text-muted-foreground space-y-1">
            <p>
              <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {isEs ? "Cómo llegar (Google Maps)" : "Get directions (Google Maps)"}
              </a>
            </p>
            <p><a href="tel:+17864948647" className="text-primary hover:underline font-semibold">+1 786-494-8647</a></p>
            <p>{t("home.hoursLine1")}</p>
            <p>{t("home.hoursLine2")}</p>
            <p>{t("home.hoursLine3")}</p>
          </div>
        </div>
      </section>

      {/* H2 #8 — New arrivals: dynamic in-body cluster (auto-refreshing internal
          links). The by-color block is hidden here — the home already has its
          own color cluster above. */}
      <DynamicClusters language={language} showColors={false} />
    </main>
  );
}
