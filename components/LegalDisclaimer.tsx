import { Info } from "lucide-react";
import { getTranslator, type Language } from "@/i18n";

/**
 * Subtle disclaimer note rendered ONLY in Spanish (SPA port): clarifies that
 * the EN version of a legal page is the legally binding one.
 */
const LegalDisclaimer = ({ language }: { language: Language }) => {
  if (language !== "es") return null;
  const { t } = getTranslator(language);
  return (
    <div className="mt-8 flex gap-3 items-start rounded-lg border border-border bg-muted/40 px-4 py-3 text-xs text-muted-foreground">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <p className="font-body leading-relaxed">{t("legal.disclaimer")}</p>
    </div>
  );
};

export default LegalDisclaimer;
