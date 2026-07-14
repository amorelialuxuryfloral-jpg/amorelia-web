import Link from "next/link";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import PaymentIcons from "@/components/PaymentIcons";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { GBP_CID_URL } from "@/lib/constants";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * Footer — Server Component. Every link is a real <a> in the HTML (spec §2.4).
 * Amorelia: SOLO enlaces a rutas reales. Se quitaron las columnas de barrios /
 * ciudades FedEx / ocasiones (esas páginas no existen en Amorelia y daban 404).
 * Only the cookie-preferences trigger is a client island.
 */
const Footer = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const l = (path: string) => localizePath(path, language);
  const isEs = language === "es";

  // "Shop" column: bouquet categories + a few top color collections (real routes).
  const colorLink = (slug: string, slugEs: string) =>
    isEs ? `/es/bouquets/${slugEs}` : `/bouquets/${slug}`;
  const shopColors = COLOR_COLLECTIONS.slice(0, 4); // red, white, pink, yellow

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 — Info (NAP + CID "Get directions" link) */}
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
                { to: l("/contact"), label: t("nav.contact") },
                { to: l("/faq"), label: t("nav.faq") },
                { to: l("/sitemap"), label: t("nav.sitemap") },
              ].map(link => (
                <Link key={link.to} href={link.to} className="inline-block py-1 hover:text-primary transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Col 3 — Shop (bouquet categories + top colors) */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{isEs ? "Comprar" : "Shop"}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground">
              <Link href={l("/bouquets")} className="inline-block py-1 hover:text-primary transition-colors">{t("nav.allColors")}</Link>
              <Link href={l("/bouquets/single-color")} className="inline-block py-1 hover:text-primary transition-colors">{t("nav.singleColor")}</Link>
              <Link href={l("/bouquets/mixed-color")} className="inline-block py-1 hover:text-primary transition-colors">{t("nav.mixedBouquets")}</Link>
              {shopColors.map((c) => (
                <Link key={c.color} href={colorLink(c.slug, c.slugEs)} className="inline-block py-1 hover:text-primary transition-colors">{t(`nav.${c.color}Roses`)}</Link>
              ))}
            </div>
          </div>

          {/* Col 4 — Legal + Social + Payments */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-4">{t("footer.legal")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground mb-6">
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
            <p className="font-body text-xs tracking-widest uppercase text-primary-foreground mb-3">{t("footer.followUs")}</p>
            <div className="flex flex-col gap-2 font-body text-xs text-primary-foreground mb-6">
              <a href="https://www.instagram.com/amorelialuxuryfloral" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">Instagram</a>
              <a href="https://www.facebook.com/amorelialuxuryfloral" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">Facebook</a>
              <a href="https://www.tiktok.com/@amorelialuxuryfloral?_r=1&_t=ZN-96sa6qDFByA" target="_blank" rel="noopener noreferrer" className="inline-block py-1 hover:text-primary transition-colors">TikTok</a>
            </div>
            <PaymentIcons size={20} />
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
