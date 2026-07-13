"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { COOKIE_PREFS_EVENT, useCookieConsent } from "@/hooks/useCookieConsent";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * Cookie banner + preferences modal — self-contained client component
 * (no Radix). The banner is NEVER in the server HTML nor the first client
 * render (consent state lives in localStorage) — it appears after mount,
 * so there is no hydration mismatch. Crawlers never see it.
 */

const Toggle = ({
  checked,
  disabled = false,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    disabled={disabled}
    onClick={() => onChange?.(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
      checked ? "bg-primary" : "bg-muted-foreground/30"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
  >
    <span
      className={`inline-block h-5 w-5 rounded-full bg-background shadow transform transition-transform ${
        checked ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
);

const CookieBanner = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const { consent, hasResponded, ready, acceptAll, rejectAll, updateConsent } = useCookieConsent();
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsOn, setAnalyticsOn] = useState(false);
  const [marketingOn, setMarketingOn] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Trigger fade-in once we know there's no stored consent
  useEffect(() => {
    if (ready && !hasResponded) {
      const id = window.setTimeout(() => setVisible(true), 50);
      return () => window.clearTimeout(id);
    }
    setVisible(false);
  }, [ready, hasResponded]);

  // Sync toggles with stored consent whenever the modal opens
  useEffect(() => {
    if (customizeOpen) {
      setAnalyticsOn(consent?.analytics ?? false);
      setMarketingOn(consent?.marketing ?? false);
    }
  }, [customizeOpen, consent]);

  // Allow Footer (or any caller) to reopen the preferences dialog
  useEffect(() => {
    const handler = () => setCustomizeOpen(true);
    window.addEventListener(COOKIE_PREFS_EVENT, handler as EventListener);
    return () => window.removeEventListener(COOKIE_PREFS_EVENT, handler as EventListener);
  }, []);

  const handleSave = () => {
    updateConsent(analyticsOn, marketingOn);
    setCustomizeOpen(false);
  };

  const showBanner = mounted && ready && !hasResponded;

  const btnBase = "font-body text-xs tracking-wide rounded-lg px-4 py-2 transition-colors";

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-label={t("cookies.title")}
          className={`fixed inset-x-0 bottom-20 md:bottom-0 z-[60] border-t border-border bg-background shadow-lg transition-all duration-300 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="container mx-auto px-6 py-4 md:py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="md:max-w-2xl">
                <p className="font-display text-sm font-semibold text-foreground">{t("cookies.title")}</p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {t("cookies.description")}{" "}
                  <Link
                    href={localizePath("/cookie-policy", language)}
                    className="text-primary underline underline-offset-2"
                    aria-label={t("cookies.learnMoreAriaLabel")}
                  >
                    {t("cookies.learnMore")}
                  </Link>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:shrink-0">
                <button className={`${btnBase} border border-border text-foreground hover:bg-muted`} onClick={rejectAll}>{t("cookies.rejectAll")}</button>
                <button className={`${btnBase} text-foreground hover:bg-muted`} onClick={() => setCustomizeOpen(true)}>{t("cookies.customize")}</button>
                <button className={`${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`} onClick={acceptAll}>{t("cookies.acceptAll")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {customizeOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setCustomizeOpen(false)} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("cookies.preferencesTitle")}
            className="relative w-full max-w-md rounded-lg border border-border bg-background p-6 shadow-xl"
          >
            <h2 className="font-display text-lg font-semibold text-foreground">{t("cookies.preferencesTitle")}</h2>
            <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.description")}</p>

            <div className="space-y-4 py-4">
              <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{t("cookies.necessary")}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.necessaryDesc")}</p>
                </div>
                <Toggle checked disabled label={t("cookies.necessary")} />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{t("cookies.analytics")}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.analyticsDesc")}</p>
                </div>
                <Toggle checked={analyticsOn} onChange={setAnalyticsOn} label={t("cookies.analytics")} />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-md border border-border p-3">
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{t("cookies.marketing")}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{t("cookies.marketingDesc")}</p>
                </div>
                <Toggle checked={marketingOn} onChange={setMarketingOn} label={t("cookies.marketing")} />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button className={`${btnBase} border border-border text-foreground hover:bg-muted`} onClick={rejectAll}>{t("cookies.rejectAll")}</button>
              <button className={`${btnBase} bg-primary text-primary-foreground hover:bg-primary/90`} onClick={handleSave}>{t("cookies.save")}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
