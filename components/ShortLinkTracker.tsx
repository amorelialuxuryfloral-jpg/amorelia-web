"use client";

import { useEffect } from "react";
import { applyManualTrackingParams, captureTrackingParams } from "@/lib/trackingParams";
import { SHORT_LINKS } from "@/lib/shortLinks";

/**
 * Short-link attribution (SPA's ShortLink.tsx port): applies the mapped UTMs
 * (first-touch, 90-day TTL) client-side while the URL stays clean (e.g. /wa).
 * The page itself renders the home content, noindex + canonical "/".
 */
const ShortLinkTracker = ({ slug }: { slug: string }) => {
  useEffect(() => {
    const mapping = SHORT_LINKS[slug];
    if (mapping) applyManualTrackingParams(mapping);
    captureTrackingParams();
  }, [slug]);

  return null;
};

export default ShortLinkTracker;
