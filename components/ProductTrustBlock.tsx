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
      {/* Trust stickers — always 3 columns (left / middle / right), including mobile */}
      <div className="grid grid-cols-3 gap-3 items-center justify-items-center">
        <img src="/assets/sticker-same-day.webp" alt="Same Day Delivery" width={96} height={96} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" loading="lazy" />
        <img src="/assets/sticker-freshness.webp" alt="Freshness 100% Guaranteed" width={96} height={96} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" loading="lazy" />
        <img src="/assets/sticker-best-value.webp" alt="The Best Value" width={96} height={96} className="w-20 h-20 sm:w-24 sm:h-24 object-contain" loading="lazy" />
      </div>

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
