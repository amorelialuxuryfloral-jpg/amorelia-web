"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMetaEvent } from "@/lib/metaPixel";
import { isProductionDomain } from "@/lib/isProductionDomain";
import { captureTrackingParams } from "@/lib/trackingParams";

/**
 * Client-side navigation tracking for the App Router — port of the SPA's
 * usePageTracking hook + boot-time captureTrackingParams().
 *
 * Fires GA4 `page_view` + Meta `PageView` (CAPI-deduped via trackMetaEvent)
 * on every route change. The FIRST render is skipped because:
 *   - GA4 auto-sends the initial page_view from gtag('config', …).
 *   - Meta Pixel fires its own initial PageView when init'd (metaPixel.ts).
 * Both are silent no-ops when consent is denied (Consent Mode v2) and the
 * whole component is inert outside the production domain.
 *
 * UTM/fbclid/gclid capture (first-touch, persisted) runs once on boot —
 * same as the SPA (SPEC §8.ter: attribution machinery preserved 1:1).
 */
const RouteTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const isFirstRender = useRef(true);

  // Boot: capture and persist tracking params for order attribution.
  useEffect(() => {
    captureTrackingParams();
  }, []);

  useEffect(() => {
    if (!isProductionDomain()) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const pagePath = pathname + (search ? `?${search}` : "");
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "page_view", {
      page_path: pagePath,
      page_title: typeof document !== "undefined" ? document.title : "",
      page_location: typeof window !== "undefined" ? window.location.href : "",
    });
    trackMetaEvent("PageView");
  }, [pathname, search]);

  return null;
};

export default RouteTracker;
