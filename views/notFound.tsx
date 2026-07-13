import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * Real 404 (spec §2.2): unknown URLs return HTTP 404 with this page —
 * the SPA served the home HTML with status 200 for any path (soft-404).
 * Copy from the validated SPA translations (notFound.*).
 */
export default function NotFoundView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const l = (path: string) => localizePath(path, language);

  return (
    <main className="min-h-[70vh] flex items-center justify-center bg-background pt-32 pb-16">
      <div className="container mx-auto px-6 text-center">
        <p className="font-subtitle-script text-primary text-2xl mb-2">{t("notFound.errorLabel")}</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">{t("notFound.title")}</h1>
        <p className="font-body text-muted-foreground max-w-md mx-auto mb-8">
          {t("notFound.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={l("/")}
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
          >
            {t("notFound.goHome")} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={l("/bouquets")}
            className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-6 py-3 font-body text-xs tracking-widest uppercase hover:bg-muted transition-colors rounded-lg"
          >
            {t("notFound.shopBouquets")}
          </Link>
        </div>
      </div>
    </main>
  );
}
