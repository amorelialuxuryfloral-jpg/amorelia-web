import { getTranslator, type Language } from "@/i18n";
import type { FAQItem } from "@/components/CollectionFAQ";

/** Translated bouquet FAQs (same keys as the SPA's useBouquetFAQs hook). */
export function bouquetFAQsFor(language: Language): FAQItem[] {
  const { t } = getTranslator(language);
  return [
    { question: t("bouquetFaq.q1"), answer: t("bouquetFaq.a1") },
    { question: t("bouquetFaq.q2"), answer: t("bouquetFaq.a2") },
    { question: t("bouquetFaq.q3"), answer: t("bouquetFaq.a3") },
    { question: t("bouquetFaq.q4"), answer: t("bouquetFaq.a4") },
    { question: t("bouquetFaq.q5"), answer: t("bouquetFaq.a5") },
    { question: t("bouquetFaq.q6"), answer: t("bouquetFaq.a6") },
  ];
}
