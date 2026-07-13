import type { Metadata } from "next";
import LegalDisclaimer from "@/components/LegalDisclaimer";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { fetchShopPolicy, type ShopifyPolicyKey } from "@/lib/shopifyPolicies";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, type Language } from "@/i18n";

/**
 * Legal pages — SPA port 1:1.
 *
 *  - privacy-policy / terms-of-service / refund-policy / shipping-policy pull
 *    their body straight from the Shopify Storefront API (shop.<policyKey>),
 *    exactly like the SPA's ShopifyPolicyPage — but server-rendered, so the
 *    legal text arrives as real HTML instead of a client spinner.
 *  - cookie-policy renders from the validated translations (SPA CookiePolicy).
 *  - All legal pages are noindex (same as the live site).
 */

const EMAIL = "amorelia.luxuryfloral@gmail.com";

export interface LegalPageDef {
  policyKey: ShopifyPolicyKey;
  /** i18n namespace under `legal.` (privacy / terms / refund / shipping). */
  ns: string;
  path: string;
}

export const LEGAL_PAGES: Record<string, LegalPageDef> = {
  "privacy-policy": { policyKey: "privacyPolicy", ns: "privacy", path: "/privacy-policy" },
  "terms-of-service": { policyKey: "termsOfService", ns: "terms", path: "/terms-of-service" },
  "refund-policy": { policyKey: "refundPolicy", ns: "refund", path: "/refund-policy" },
  "shipping-policy": { policyKey: "shippingPolicy", ns: "shipping", path: "/shipping-policy" },
};

export function legalMetadata(def: LegalPageDef, language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t(`legal.${def.ns}.seoTitle`),
    description: t(`legal.${def.ns}.seoDescription`),
    path: def.path,
    language,
    noindex: true,
  });
}

const POLICY_BODY_CLASSES =
  "shopify-policy-body space-y-4 [&_h1]:font-display [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:text-foreground [&_h1]:pt-4 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:pt-4 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:pt-3 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_a]:text-primary [&_a:hover]:underline [&_strong]:text-foreground";

export async function ShopifyPolicyView({
  def,
  language,
}: {
  def: LegalPageDef;
  language: Language;
}) {
  const { t } = getTranslator(language);
  const policy = await fetchShopPolicy(def.policyKey);
  const title = policy?.title || t(`legal.${def.ns}.title`);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{title}</h1>
          <div className="font-body text-sm text-muted-foreground leading-relaxed">
            {policy?.body ? (
              <div
                className={POLICY_BODY_CLASSES}
                // Body comes straight from Shopify admin (merchant-controlled HTML).
                dangerouslySetInnerHTML={{ __html: policy.body }}
              />
            ) : (
              <p className="text-destructive">
                Could not load this policy from Shopify. Please try again later.
              </p>
            )}
            <LegalDisclaimer language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Cookie policy (static, from validated translations) ─────────────────

export function cookiePolicyMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("legal.cookie.seoTitle"),
    description: t("legal.cookie.seoDescription"),
    path: "/cookie-policy",
    language,
    noindex: true,
  });
}

export function CookiePolicyView({ language }: { language: Language }) {
  const { t, tRaw } = getTranslator(language);
  const usedItems = tRaw("legal.cookie.usedItems") as { label: string; text: string }[];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="font-title-retro text-4xl text-primary text-center mb-8">{t("legal.cookie.title")}</h1>
          <div className="font-body text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p><strong>{t("legal.lastUpdated")}</strong></p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.whoHeading")}</h2>
            <p>{t("legal.cookie.whoText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.whatHeading")}</h2>
            <p>{t("legal.cookie.whatText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.essentialHeading")}</h2>
            <p>{t("legal.cookie.essentialText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.analyticsHeading")}</h2>
            <p>{t("legal.cookie.analyticsText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.functionalHeading")}</h2>
            <p>{t("legal.cookie.functionalText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.choicesHeading")}</h2>
            <p>{t("legal.cookie.choicesText")}</p>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.cookie.usedHeading")}</h2>
            <ul className="list-disc pl-5 space-y-1">
              {usedItems.map((it, i) => (
                <li key={i}><strong>{it.label}</strong>{it.text}</li>
              ))}
            </ul>

            <p>{t("legal.cookie.changeText")}</p>
            <div className="mt-2 inline-block rounded-md border border-border px-3 text-foreground hover:border-primary transition-colors">
              <CookiePreferencesButton label={t("legal.cookie.manageButton")} />
            </div>

            <h2 className="font-display text-lg font-semibold text-foreground pt-4">{t("legal.contactHeading")}</h2>
            <p>
              <a href={`mailto:${EMAIL}`} className="text-primary hover:underline">{EMAIL}</a><br />
              {t("legal.cookie.contactAddress")}
            </p>

            <LegalDisclaimer language={language} />
          </div>
        </div>
      </div>
    </div>
  );
}
