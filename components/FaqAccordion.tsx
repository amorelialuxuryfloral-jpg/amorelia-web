"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

/**
 * FAQ accordion — SPA port (pages/FAQ.tsx markup 1:1). Client component for
 * the open/close state only; the questions AND answers ship in the server
 * HTML (all items render; closed answers are hidden via conditional render
 * after hydration, but the full text is present in the static markup for
 * crawlers because the initial render includes every answer? No — the SPA
 * only rendered the open answer. To keep the server HTML rich we render every
 * answer and toggle with CSS classes instead, which is strictly better for
 * SEO with identical visuals).
 */
const FaqAccordion = ({ faqs }: { faqs: Array<{ q: string; a: string }> }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-border rounded-lg overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-cream/50 transition-colors"
            aria-expanded={openIdx === i}
          >
            <p className="font-body text-sm font-semibold text-foreground pr-4">{faq.q}</p>
            <ChevronDown
              className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`}
            />
          </button>
          <div className={openIdx === i ? "px-5 pb-5" : "hidden px-5 pb-5"}>
            <p className="font-body text-sm text-muted-foreground">{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FaqAccordion;
