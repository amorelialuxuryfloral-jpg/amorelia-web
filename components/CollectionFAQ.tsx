"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { getTranslator, type Language } from "@/i18n";

export interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
  language?: Language;
}

/**
 * Collection/product FAQ accordion + FAQPage JSON-LD. Client component for the
 * open/close state; the questions/answers are still server-rendered in the
 * HTML (SSR of client components) so Google sees the full copy.
 */
const CollectionFAQ = ({ faqs, language = "en" }: Props) => {
  const { t } = getTranslator(language);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="pt-5 pb-8 max-w-3xl mx-auto">
      <JsonLd data={faqSchema(faqs.map(f => ({ question: f.question, answer: f.answer })))} />
      <h2 className="font-display text-xl font-semibold text-foreground text-center mb-8">{t("collectionFaq.title")}</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="font-body text-sm font-medium text-foreground pr-4">{faq.question}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-4">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CollectionFAQ;
