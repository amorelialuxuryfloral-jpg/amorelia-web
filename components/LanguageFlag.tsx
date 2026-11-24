/**
 * Small inline-SVG flags for the language toggle.
 *
 * Emoji flags (🇺🇸 🇪🇸) are NOT used on purpose: Windows does not render
 * regional-indicator emoji, so desktop Chrome/Edge would show the letters
 * "US"/"ES" instead of a flag. Inline SVG renders identically everywhere
 * and needs no network request.
 *
 * `lang` is the language the flag stands for: "en" → USA, "es" → Spain.
 */
import type { Language } from "@/i18n";

const LanguageFlag = ({ lang, className = "" }: { lang: Language; className?: string }) => {
  if (lang === "en") {
    // USA: 13 stripes + blue canton (stars simplified to dots, legible at icon size).
    return (
      <svg viewBox="0 0 30 20" className={`rounded-[3px] ring-1 ring-black/15 shrink-0 ${className}`} aria-hidden="true">
        <rect width="30" height="20" fill="#B22234" />
        {[1, 3, 5, 7, 9, 11].map((i) => (
          <rect key={i} y={(i * 20) / 13} width="30" height={20 / 13} fill="#FFFFFF" />
        ))}
        <rect width="12" height={(7 * 20) / 13} fill="#3C3B6E" />
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3, 4].map((c) => (
            <circle key={`${r}-${c}`} cx={1.4 + c * 2.3 + (r % 2) * 1.15} cy={1.5 + r * 2.4} r="0.45" fill="#FFFFFF" />
          )),
        )}
      </svg>
    );
  }
  // Spain: red / yellow (double height) / red.
  return (
    <svg viewBox="0 0 30 20" className={`rounded-[3px] ring-1 ring-black/15 shrink-0 ${className}`} aria-hidden="true">
      <rect width="30" height="20" fill="#AA151B" />
      <rect y="5" width="30" height="10" fill="#F1BF00" />
    </svg>
  );
};

export default LanguageFlag;
