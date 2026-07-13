import type { Metadata } from "next";
import Link from "next/link";
import { Flower2, Truck, Store, Sparkles, Star, MapPin } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema, organizationSchema } from "@/components/JsonLd";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * /about + /es/about — SPA port (real founder story, verbatim copy from
 * translations, both languages validated).
 */

export function aboutMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("seo.about.title"),
    description: t("seo.about.description"),
    path: "/about",
    language,
  });
}

export default function AboutView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const l = (path: string) => localizePath(path, language);
  const base = language === "es" ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com";

  const features = [
    { icon: Flower2, title: t("about.roses"), desc: t("about.rosesDesc") },
    { icon: Sparkles, title: t("about.aiPreview"), desc: t("about.aiPreviewDesc") },
    { icon: Star, title: t("about.finishes"), desc: t("about.finishesDesc") },
    { icon: Truck, title: t("about.sameDayDelivery"), desc: t("about.sameDayDeliveryDesc") },
    { icon: Store, title: t("about.freePickup"), desc: t("about.freePickupDesc") },
    { icon: MapPin, title: t("about.address"), desc: t("about.addressDesc") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: t("nav.home"), url: base },
            { name: t("nav.about"), url: `${base}/about` },
          ]),
          organizationSchema(),
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Breadcrumbs items={[{ label: t("nav.home"), to: l("/") }, { label: t("nav.about") }]} />
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">{t("about.title")}</h1>

          <h2 className="font-title-retro text-2xl md:text-3xl text-primary text-center mb-6">{t("about.storyTitle")}</h2>
          <div className="prose-sm font-body text-muted-foreground space-y-5 mb-12">
            <p>{t("about.p1")}</p>
            <p>{t("about.p2")}</p>
            <p>{t("about.p3")}</p>
            <p>{t("about.p4")}</p>
            <p>{t("about.p5")}</p>
            <p>{t("about.p6")}</p>
            <p className="font-display text-foreground font-semibold">{t("about.founder")}</p>
          </div>

          {/* Features */}
          <h2 className="font-title-retro text-2xl md:text-3xl text-primary text-center mb-6">{t("about.offeringsTitle")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {features.map((f, i) => (
              <div key={i} className="bg-cream rounded-lg p-5 text-center">
                <f.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-display text-sm font-semibold text-foreground">{f.title}</h3>
                <p className="font-body text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href={l("/bouquets")}
              className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
            >
              {t("about.shopBouquets")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
