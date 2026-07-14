"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getTranslator, type Language } from "@/i18n";

/** Trust stickers + product FAQ accordion under the Order button (SPA port). */
const ProductTrustBlock = ({ language = "en" }: { language?: Language }) => {
  const { tRaw } = getTranslator(language);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = (tRaw("trustBlock.faqs") as Array<{ q: string; a: string }>) || [];

  return (
    <div className="space-y-5 pt-2">
      {/* (3 stickers eliminados a petición de Amorelia — solo queda el acordeón de FAQ.) */}

      {/* FAQ accordion */}
      <div className="border-t border-border">
        {faqs.map((faq, i) => {
          const open = openIdx === i;
          return (
            <div key={i} className="border-b border-border">
              <button
                type="button"
                onClick={() => setOpenIdx(open ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left"
                aria-expanded={open}
              >
                <span className="font-body text-sm font-semibold text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                />
              </button>
              {open && (
                <div className="pb-4 font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTrustBlock;
