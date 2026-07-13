import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import CartDrawer from "@/components/CartDrawer";
import MobileOrbitalNav from "@/components/MobileOrbitalNav";
import RouteTracker from "@/components/RouteTracker";
import { fontClassNames } from "@/lib/fonts";
import type { Language } from "@/i18n";

/**
 * Shared document shell for BOTH root layouts (app/(en)/layout.tsx and
 * app/es/layout.tsx). The two layouts differ ONLY in `<html lang>` and the
 * language passed to the chrome (Navbar / Footer / CookieBanner / CartDrawer).
 *
 * Everything tracking-related is IDENTICAL to the SPA (SPEC §8.ter — do not
 * touch): Consent Mode v2 defaults BEFORE any Google library, queue stubs
 * synchronous, network loads deferred to first interaction / idle.
 */

/**
 * Google Consent Mode v2 — defaults set BEFORE any Google script loads.
 * The heavy tracking libraries are injected by the deferred loader below,
 * which always runs after this inline script.
 */
const consentModeScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'granted',
  'security_storage': 'granted',
  'wait_for_update': 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`;

/**
 * Tracking — ONLY on production domains (Amorelia pixels PENDIENTES:
 * GA4/Ads/Meta/Klaviyo por configurar — líneas comentadas abajo).
 * The queue stubs (fbq / gtag) are created SYNCHRONOUSLY so any event fired
 * during the critical window is captured and flushed once the real libraries
 * load. The network scripts are DEFERRED off the critical path — they load on
 * the first user interaction OR when the browser goes idle (whichever comes
 * first). Do NOT move the network loads back to boot.
 */
const trackingLoaderScript = `
(function() {
  var hosts = ['amorelialuxuryfloral.com', 'www.amorelialuxuryfloral.com'];
  if (!hosts.includes(window.location.hostname)) return;

  // ---- 1) Queue stubs (synchronous, tiny — no network) ----

  // Meta Pixel stub — window.fbq queues calls until fbevents.js loads.
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[]}(window, document);

  // GA4 + Google Ads config (dataLayer/gtag defined by Consent Mode above).
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  /* Amorelia pixels PENDIENTES — no enviar a Charls */ /* gtag('config','G-XXXXXXX'); */
  /* gtag('config','AW-XXXXXXXXX'); */
  gtag('set', 'linker', {
    'domains': ['amorelia-luxury-floral-gifts.myshopify.com', 'checkout.shopify.com', 'shop.app'],
    'accept_incoming': true
  });

  // ---- 2) Deferred network loads (off the critical path) ----
  var loaded = false;
  var evts = ['scroll','mousemove','touchstart','keydown','click','pointerdown'];
  var opts = { passive: true, capture: true };
  function inject(src){ var t=document.createElement('script'); t.async=true; t.src=src; document.head.appendChild(t); }
  function loadLibs(){
    if (loaded) return;
    loaded = true;
    evts.forEach(function(evt){ window.removeEventListener(evt, loadLibs, opts); });
    /* inject('https://connect.facebook.net/en_US/fbevents.js'); */
    /* inject('https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX'); */
    /* inject('https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX'); */
    /* inject('https://static.klaviyo.com/onsite/js/PENDING/klaviyo.js'); */
  }
  evts.forEach(function(evt){ window.addEventListener(evt, loadLibs, opts); });
  // Fallback so tracking still fires without any interaction, but after the
  // LCP/critical window.
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadLibs, { timeout: 3000 });
  } else {
    setTimeout(loadLibs, 3000);
  }
})();
`;

export default function RootDocument({
  language,
  children,
}: Readonly<{
  language: Language;
  children: React.ReactNode;
}>) {
  // Resource hints for the critical render path (hero + product images).
  preconnect("https://cdn.shopify.com", { crossOrigin: "anonymous" });
  prefetchDNS("https://www.googletagmanager.com");
  prefetchDNS("https://connect.facebook.net");

  return (
    <html lang={language} className={fontClassNames()}>
      <body className="min-h-screen bg-background text-foreground">
        {/* Consent Mode defaults must execute before any Google library. */}
        <script dangerouslySetInnerHTML={{ __html: consentModeScript }} />

        {/* Navbar must NOT use useSearchParams — it would need a Suspense
            boundary that removes the menu (and its links) from the static
            HTML. See toggleLang() in Navbar.tsx. */}
        <Navbar language={language} />

        {/* Offset for the fixed announcement bar (30px) + navbar height is
            handled per page (the home hero intentionally runs underneath). */}
        {children}

        <Footer language={language} />
        {/* Mobile floating bottom nav (SPA parity — Romuald M12·01). */}
        <MobileOrbitalNav language={language} />
        <CookieBanner language={language} />
        <CartDrawer language={language} />
        <Toaster position="bottom-right" />

        {/* Client-side navigation tracking (GA4 page_view + Meta PageView with
            CAPI dedup) + first-touch UTM capture. useSearchParams requires a
            Suspense boundary; the component renders nothing so the static HTML
            is unaffected. */}
        <Suspense fallback={null}>
          <RouteTracker />
        </Suspense>

        {/* Deferred tracking loader (production domains only). */}
        <script dangerouslySetInnerHTML={{ __html: trackingLoaderScript }} />
      </body>
    </html>
  );
}
