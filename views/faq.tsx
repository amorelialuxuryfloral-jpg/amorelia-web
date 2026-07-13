import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { faqSchema, breadcrumbSchema } from "@/components/JsonLd";
import FaqAccordion from "@/components/FaqAccordion";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/** /faq + /es/faq — SPA port (pages/FAQ.tsx). FAQPage schema from the real Q&A copy. */

export function faqMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("seo.faq.title"),
    description: t("seo.faq.description"),
    path: "/faq",
    language,
  });
}

export default function FaqView({ language }: { language: Language }) {
  const { t, tRaw } = getTranslator(language);
  const faqs = tRaw("faqPage.faqs") as Array<{ q: string; a: string }>;
  const base = language === "es" ? "https://amorelialuxuryfloral.com/es" : "https://amorelialuxuryfloral.com";

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqSchema(faqs.map((f) => ({ question: f.q, answer: f.a })))} />
      <JsonLd
        data={breadcrumbSchema([
          { name: t("nav.home"), url: base },
          { name: "FAQ", url: `${base}/faq` },
        ])}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <Breadcrumbs items={[{ label: t("nav.home"), to: localizePath("/", language) }, { label: t("nav.faq") }]} />
          <h1 className="font-title-retro text-4xl md:text-5xl text-primary text-center mb-10">{t("faqPage.title")}</h1>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </div>
  );
}
