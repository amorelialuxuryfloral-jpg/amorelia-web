import Link from "next/link";
import { getLongTail, type LongTailContent } from "@/lib/longTailSeo";
import type { Language } from "@/i18n";

/**
 * Long-tail on-page SEO renderer for collection pages (Server Component —
 * copy + internal links land directly in the server HTML).
 *
 * Two pieces (ported 1:1 from the SPA):
 *  - <LongTailIntro/> — 1-2 line paragraph under the existing H1.
 *  - <LongTailBody/>  — H2/H3 + copy block at the END of the page, incl. the
 *    internal-link sentence with EXACT anchor text ordered low → high volume.
 *
 * Nothing here changes the H1, prices, checkout, cart or tracking.
 */

interface Props {
  seoKey?: string;
  language?: Language;
}

const content = (seoKey?: string, language: Language = "en"): LongTailContent | undefined =>
  getLongTail(seoKey, language === "es" ? "es" : "en");

export const LongTailIntro = ({ seoKey, language = "en" }: Props) => {
  const c = content(seoKey, language);
  if (!c) return null;
  return (
    <p className="font-body text-sm md:text-base text-foreground/80 max-w-3xl mx-auto text-center mt-3 leading-relaxed">
      {c.intro}
    </p>
  );
};

/** Splits `closing` on `{{n}}` placeholders and injects the matching internal link. */
const renderClosing = (c: LongTailContent) => {
  const parts = c.closing.split(/(\{\{\d+\}\})/g);
  return parts.map((part, i) => {
    const m = /^\{\{(\d+)\}\}$/.exec(part);
    if (!m) return <span key={i}>{part}</span>;
    const link = c.links[Number(m[1])];
    if (!link) return null;
    return (
      <Link key={i} href={link.to} className="text-primary hover:underline">
        {link.anchor}
      </Link>
    );
  });
};

export const LongTailBody = ({ seoKey, language = "en" }: Props) => {
  const c = content(seoKey, language);
  if (!c) return null;
  return (
    <section className="container mx-auto px-6 max-w-3xl py-10 md:py-14">
      <div className="space-y-8">
        {c.sections.map((s, i) => (
          <div key={i}>
            <h2 className="font-title-retro text-2xl md:text-3xl text-foreground mb-3">{s.h2}</h2>
            <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">{s.body}</p>
          </div>
        ))}
        <p className="font-body text-sm md:text-base text-muted-foreground leading-relaxed">
          {renderClosing(c)}
        </p>
      </div>
    </section>
  );
};

export default LongTailBody;
