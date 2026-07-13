import type { Metadata } from "next";
import LazyMapEmbed from "@/components/LazyMapEmbed";
import { MapPin, Phone, Clock, Mail } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/components/ContactForm";
import JsonLd, { localBusinessSchema, breadcrumbSchema } from "@/components/JsonLd";
import { GBP_EMBED_SRC, NAP_ADDRESS } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * /contact + /es/contact — SPA port. noindex (same as the live site), NAP in
 * the exact GBP form, GBP listing embed, Web3Forms contact form as a client
 * island.
 */

export function contactMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("seo.contact.title"),
    description: t("seo.contact.description"),
    path: "/contact",
    language,
    noindex: true,
  });
}

export default function ContactView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const l = (path: string) => localizePath(path, language);
  const base = language === "es" ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          localBusinessSchema(),
          breadcrumbSchema([
            { name: t("nav.home"), url: base },
            { name: t("nav.contact"), url: `${base}/contact` },
          ]),
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Breadcrumbs items={[{ label: t("nav.home"), to: l("/") }, { label: t("nav.contact") }]} />
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">
            {t("contact.title")}
          </h1>

          <div className="grid md:grid-cols-2 gap-10 mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.address")}</p>
                  <p className="font-body text-sm text-muted-foreground">{NAP_ADDRESS}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.phone")}</p>
                  <a href="tel:+17864948647" className="font-body text-sm text-primary hover:underline">
                    +1 786-494-8647
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.email")}</p>
                  <a href="mailto:amorelia.luxuryfloral@gmail.com" className="font-body text-sm text-primary hover:underline">
                    amorelia.luxuryfloral@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-foreground">{t("contact.hours")}</p>
                  <p className="font-body text-sm text-muted-foreground">{t("contact.hoursLine1")}</p>
                  <p className="font-body text-sm text-muted-foreground">{t("contact.hoursLine2")}</p>
                  <p className="font-body text-sm text-muted-foreground">{t("contact.hoursLine3")}</p>
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground italic">{t("contact.sameDayNote")}</p>
            </div>

            {/* Contact Form (client island) */}
            <ContactForm language={language} />
          </div>

          {/* GBP listing embed (SPEC §2.7) */}
          <div className="mt-16 overflow-hidden rounded-lg md:mt-24">
            <LazyMapEmbed
              src={GBP_EMBED_SRC}
              className="block h-[320px] w-full rounded-lg align-top md:h-[420px]"
              title={language === "es" ? "Ubicación de Amorelia Luxury Floral Gifts Miami" : "Amorelia Luxury Floral Gifts Miami location"}
              placeholderLabel={language === "es" ? "Mapa" : "Map"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
