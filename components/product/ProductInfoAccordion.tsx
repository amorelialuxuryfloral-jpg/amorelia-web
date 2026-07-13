"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import JsonLd, { faqSchema } from "@/components/JsonLd";
import { bouquetFAQsFor } from "@/lib/bouquetFaqs";
import type { FAQItem } from "@/components/CollectionFAQ";
import { getTranslator, type Language } from "@/i18n";

/**
 * Product info accordion (mobile AND desktop) — placed AFTER the Google
 * reviews on every ficha:
 *
 *   1. First row = the PRODUCT DESCRIPTION — CLOSED by default (mobile AND
 *      desktop) so it doesn't get in the way; the customer opens it if they
 *      want (feedback Eric jul 2026). The full text still ships in the
 *      served HTML (collapsed = `hidden` attribute, never unmounted).
 *   2. Then the 6 existing product FAQs (bouquetFaqs — validated SPA copy).
 *
 * SEO/SSR: every answer (and the description) is ALWAYS rendered in the DOM —
 * collapsed rows only get the `hidden` attribute — so the full copy ships in
 * the served HTML and there is no mount/unmount hydration risk. The FAQPage
 * JSON-LD moves here 1:1 from the old page-level CollectionFAQ (same
 * faqSchema, same 6 Q&A).
 */
const ProductInfoAccordion = ({
  description,
  language = "en",
  faqs: faqsProp,
}: {
  /** Resolved product description (already price-substituted), \n-separated. */
  description: string;
  language?: Language;
  /**
   * FAQs to render after the description row. Default (undefined) = the 6
   * validated bouquet FAQs (existing fichas unchanged). Pass [] for products
   * with NO real FAQs (e.g. room decor) — NADA INVENTADO: the accordion then
   * shows only the description and emits NO FAQPage schema.
   */
  faqs?: FAQItem[];
}) => {
  const { t } = getTranslator(language);
  const isEs = language === "es";
  const faqs = faqsProp ?? bouquetFAQsFor(language);
  // Everything starts CLOSED — including the description (row 0). Its copy
  // is still in the served HTML for SEO (see `hidden` below).
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const rows: Array<{ title: string; body: React.ReactNode }> = [
    {
      title: t("product.productDescription"),
      body: (
        <div className="font-body text-sm text-muted-foreground leading-relaxed space-y-1">
          {description.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      ),
    },
    ...faqs.map((faq) => ({
      title: faq.question,
      body: (
        <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
      ),
    })),
  ];

  return (
    <section className="mt-12 lg:mt-16 max-w-3xl mx-auto">
      {/* No FAQs → no FAQPage schema (never an empty mainEntity). */}
      {faqs.length > 0 && (
        <JsonLd data={faqSchema(faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      )}
      <h2 className="font-display text-xl font-semibold text-foreground text-center mb-8">
        {faqs.length > 0
          ? (isEs ? "Detalles del Producto y Preguntas Frecuentes" : "Product Details & FAQs")
          : (isEs ? "Detalles del Producto" : "Product Details")}
      </h2>
      <div className="space-y-2">
        {rows.map((row, i) => {
          const open = openIdx === i;
          return (
            <div key={i} className="border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                aria-expanded={open}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-body text-sm font-medium text-foreground pr-4">{row.title}</span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {/* Always in the DOM (hidden when collapsed) → full copy in the served HTML. */}
              <div hidden={!open} className="px-5 pb-4">
                {row.body}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductInfoAccordion;
