"use client";

import { openCookiePreferences } from "@/hooks/useCookieConsent";

/** Footer "Cookie Preferences" trigger — the only interactive bit of the Footer. */
const CookiePreferencesButton = ({ label }: { label: string }) => (
  <button
    type="button"
    onClick={openCookiePreferences}
    className="text-left inline-block py-1 hover:text-primary transition-colors"
  >
    {label}
  </button>
);

export default CookiePreferencesButton;
