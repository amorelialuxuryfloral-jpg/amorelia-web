import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Preview noindex — the SAME deploy serves both the production domain and the
 * Netlify preview domain (*.netlify.app). Google must never index the preview,
 * so every response whose Host is NOT the production domain gets
 * `X-Robots-Tag: noindex, nofollow`. Production (amorelialuxuryfloral.com /
 * www.amorelialuxuryfloral.com) is untouched — no noindex there.
 *
 * No `matcher` on purpose: the header must go out on ALL responses (pages,
 * static assets, images) of the preview host.
 *
 * Note: Next 16 renamed this file convention to `proxy.ts` (middleware.ts is
 * deprecated but still fully supported); we keep `middleware.ts` because the
 * Netlify Next.js runtime resolves it reliably.
 */

const PRODUCTION_HOSTS = new Set(["amorelialuxuryfloral.com", "www.amorelialuxuryfloral.com"]);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const host = (request.headers.get("host") ?? "")
    .split(":")[0]
    .trim()
    .toLowerCase();

  if (!PRODUCTION_HOSTS.has(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}
