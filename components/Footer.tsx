import Link from "next/link";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import PaymentIcons from "@/components/PaymentIcons";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { occasionsByTier } from "@/lib/occasionPagesData";
import { BARRIO_LINKS } from "@/lib/landingPagesData";
import { cityPages } from "@/lib/cityPagesData";
import { GBP_CID_URL } from "@/lib/constants";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * Footer — Server Component. Every link is a real <a> in the HTML (spec §2.4).
 * Only the cookie-preferences trigger is a client island.
 */
const Footer = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const l = (path: string) => localizePath(path, language);
  // Nationwide city index uses different slugs per language.
  const nationwidePath = language === "es" ? "/es/envio-de-flores" : "/flower-delivery";
  // Occasion collection URLs are native per language.
  const occasionsIndexPath = language === "es" ? "/es/collections/ocasiones" : "/collections/occasions";
  const occasionPath = (slug: string, slugEs: string) =>
    language === "es" ? `/es/collections/${slugEs}` : `/collections/${slug}`;
  // Tier 2 + 3 in the footer (Tier 1 lives in the top menu).
  const footerOccasions = [...occasionsByTier(2), ...occasionsByTier(3)];
  const stripCity = (h1: string) =>
    h1
      .replace(/ — Miami Delivery$/, "")
      .replace(/ (in|en) Miami$/, "")
      .replace(/ Miami$/, "");
  // Delivery Areas column (CORRECCIONES puntos 27/28): the 7 barrios validated
  // by real Miami-geo volume. Barrio pages are EN-only canonicals → EN hrefs
  // in both trees. Short display names from the shared BARRIO_LINKS list.
  const deliveryAreas = BARRIO_LINKS.map((b) => ({
    href: `/${b.slug}`,
    label: b.label.replace(/^Flower Delivery /, ""),
  }));
  // Local hub was consolidated into the home (Dani's verdict) → the "Delivery
  // Areas" column now points to the home (which holds the neighborhoods section).
  const localHubPath = language === "es" ? "/es" : "/";
  // Nationwide FedEx block (Romuald's internal-linking audit): the 14 FedEx
  // cities with the highest REAL "flower delivery [city]" volume (Google Ads
  // Keyword Planner), ordered by volume desc. The other 21 cities stay
  // reachable via the "View all cities" hub link (not crammed into the footer,
  // to avoid diluting the link equity). Localized per tree like every other
  // footer link: EN → /flower-delivery/[slug], ES → /es/envio-de-flores/[slugEs].
  const NATIONWIDE_CITY_SLUGS = [
    "new-york", "chicago", "houston", "dallas", "los-angeles", "san-antonio",
    "austin", "san-diego", "las-vegas", "denver", "atlanta", "san-francisco",
    "boston", "nashville",
  ];
  const nationwideCities = NATIONWIDE_CITY_SLUGS
    .map((s) => cityPages.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      href: language === "es" ? `/es/envio-de-flores/${c.slugEs}` : `/flower-delivery/${c.slug}`,
      label: language === "es" ? `Flores a ${c.name}` : `Flower Delivery ${c.name}`,
    }));
  // NOTE (spec §4): the "Shop by Flower" footer block was intentionally NOT
  // ported — every flower-type page (tulips, peonies, orchids…) has ZERO
  // products. Empty transactional pages stay out of menu/footer/sitemap until
  // real product exists. Ramo Buchón (the one with product) lives in the menu.

  return (
    <div className="relative mt-[-1px]">
      <div className="absolute -top-[50px] left-0 w-full h-[55px] z-10 overflow-hidden pointer-events-none">
        <svg className="h-full animate-wave" style={{ width: "200%", minWidth: "3840px" }} viewBox="0 0 2880 60" preserveAspectRatio="none">
          <path d="M0,60 C360,20 720,50 1080,30 C1440,10 1800,50 2160,25 C2520,5 2880,40 2880,40 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.3" />
          <path d="M0,60 C480,35 960,55 1440,40 C1920,25 2400,50 2880,35 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.55" />
          <path d="M0,60 C320,48 640,56 960,50 C1280,44 1600,54 1920,48 C2240,42 2560,52 2880,46 L2880,60 Z" fill="hsl(var(--primary))" opacity="0.8" />
        </svg>
      </div>
      <footer className="relative bg-primary pt-12 pb-8 overflow-hidden">
        <JsonLd data={organizationSchema()} />
        <div className="container mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1 — Info (NAP + CID "Get directions" link, punto 19) */}
          <div>
            <img src="/amorelia-logo.webp" alt="Amorelia Luxury Floral Gifts" className="h-10 w-auto mb-3 brightness-0 invert" width={90} height={40} loading="lazy" />
            <div className="space-y-2 font-body text-xs text-primary-foreground">
              <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" /> 7257 NW 12th St, Miami, FL 33126</p>
              <p className="flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5 shrink-0" />
                <a href={GBP_CID_URL} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline underline-offset-2 hover:text-primary transition-colors">{t("footer.getDirections")}</a>
              </p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> <a href="tel:+17864948647" className="inline-block py-2 hover:text-primary transition-colors">+1 786-494-8647</a></p>
              <div className="flex items-start gap-2"><Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <ul className="space-y-0.5">
                  <li>{t("footer.hoursLine1")}</li>
                  <li>{t("footer.hoursLine2")}</li>
                  <li>{t("footer.hoursLine3")}</li>
                </ul>
              </div>
            </div>
            <p className="font-body text-[10px] text-primary-foreground/90 mt-3 italic">{t("footer.sameDayDelivery")}</p>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.navigation")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground">
              {[
                { to: l("/"), label: t("nav.home") },
                { to: l("/bouquets"), label: t("nav.bouquets") },
                { to: l("/delivery"), label: t("nav.delivery") },
                { to: l("/about"), label: t("nav.about") },
                { to: l("/contact"), label: t("nav.contact") },
                { to: l("/faq"), label: t("nav.faq") },
                { to: nationwidePath, label: t("footer.nationwideDelivery") },
                { to: l("/sitemap"), label: t("nav.sitemap") },
              ].map(link => (
                <Link key={link.to} href={link.to} className="inline-block py-1 hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Delivery Areas (CORRECCIONES puntos 27/28: barrios
              validados por volumen real + hub header + FedEx nationwide). */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">
              <Link href={localHubPath} className="hover:text-primary transition-colors">{t("footer.deliveryAreas")}</Link>
            </p>
            <p className="font-body text-[10px] tracking-widest uppercase text-primary-foreground/90 mb-2">{t("footer.sameDayMiami")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground">
              {deliveryAreas.map((area) => (
                <Link key={area.href} href={area.href} className="inline-block py-1 hover:text-primary transition-colors">{area.label}</Link>
              ))}
              <Link href={nationwidePath} className="inline-block py-1 mt-2 border-t border-primary-foreground/15 pt-3 hover:text-primary transition-colors">{t("footer.shipUsa")}</Link>
            </div>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.legal")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground">
              {[
                { to: l("/privacy-policy"), label: t("footer.privacyPolicy") },
                { to: l("/terms-of-service"), label: t("footer.termsOfService") },
                { to: l("/refund-policy"), label: t("footer.refundPolicy") },
                { to: l("/shipping-policy"), label: t("footer.shippingPolicy") },
                { to: l("/cookie-policy"), label: t("footer.cookiePolicy") },
              ].map(link => (
                <Link key={link.to} href={link.to} className="inline-block py-1 hover:text-primary transition-colors">{link.label}</Link>
              ))}
              <CookiePreferencesButton label={t("footer.cookiePreferences")} />
            </div>
          </div>

          {/* Col 5 — Social & Payments */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.followUs")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground mb-6">
              <a href="https://www.instagram.com/amorelialuxuryfloral" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">Instagram</a>
              <a href="https://www.facebook.com/amorelialuxuryfloral" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">Facebook</a>
              <a href="https://www.tiktok.com/@amorelialuxuryfloral?_r=1&_t=ZN-96sa6qDFByA" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">TikTok</a>
            </div>
            <PaymentIcons size={20} />
          </div>
        </div>


          {/* Nationwide FedEx delivery — separate from the Miami barrios block
              (national intent, not local). 14 top-volume cities + hub link. */}
          <div className="border-t border-primary-foreground/15 pt-8 mb-8">
            <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
              <p className="font-body text-xs tracking-widest uppercase text-primary-foreground">
                {language === "es" ? "Envío de Flores a Todo EE. UU." : "Nationwide Flower Delivery (USA)"}
              </p>
              <Link
                href={nationwidePath}
                className="font-body text-[11px] tracking-widest uppercase text-primary-foreground/90 hover:text-primary-foreground underline-offset-2 hover:underline"
              >
                {language === "es" ? "Ver todas las ciudades" : "View all cities"} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2 font-body text-xs text-primary-foreground/95">
              {nationwideCities.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="inline-block py-1 hover:text-primary transition-colors"
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-primary-foreground/20 pt-6 text-center">
            <p className="font-body text-[10px] text-primary-foreground/90">{t("footer.copyright")}</p>
            <p className="font-body text-[10px] text-primary-foreground/90 mt-1">{t("footer.tagline")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
