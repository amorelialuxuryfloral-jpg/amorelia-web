import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { productSchema, breadcrumbSchema } from "@/components/JsonLd";
import RoomDecorDetailClient from "@/components/roomdecor/RoomDecorDetailClient";
import GoogleReviewsSummary from "@/components/product/GoogleReviewsSummary";
import { roomDecorPackages, type RoomDecorPackage } from "@/lib/roomDecorData";
import { seoData } from "@/lib/seoData";
import { fetchProductPageData, type ProductPageData } from "@/lib/shopifyProduct";
import { buildMetadata } from "@/lib/seo";
import { getTranslator } from "@/i18n";

/**
 * /room-decors/[packageId] — Server Component port of the SPA's
 * RoomDecorDetail page:
 *   1. Canonical package ids (love-bomb / overly-romantic /
 *      deluxe-love-package) → detail page (live Shopify description with
 *      catalog fallback; Product schema ALWAYS with a real-price offer).
 *   2. Legacy ids: /room-decors/rd-deluxe-love → 301 to
 *      /room-decors/deluxe-love-package (explicit App.tsx route), and any
 *      other rd-* prefix → 301 stripping the prefix (RoomDecorRedirect).
 *   3. Anything else → REAL 404 (no soft-404).
 */

export const revalidate = 300;
// Legacy rd-* ids must resolve at runtime (301) — keep dynamic params on.
export const dynamicParams = true;

export function generateStaticParams() {
  return roomDecorPackages.map((pkg) => ({ packageId: pkg.id }));
}

type Resolution =
  | { kind: "package"; pkg: RoomDecorPackage }
  | { kind: "redirect"; to: string }
  | { kind: "notFound" };

function resolvePackageId(packageId: string): Resolution {
  const pkg = roomDecorPackages.find((p) => p.id === packageId);
  if (pkg) return { kind: "package", pkg };

  // Explicit legacy route (App.tsx): rd-deluxe-love → deluxe-love-package
  // ("deluxe-love" alone is not a valid id, so the generic rule can't fix it).
  if (packageId === "rd-deluxe-love") {
    return { kind: "redirect", to: "/room-decors/deluxe-love-package" };
  }
  // RoomDecorRedirect: rd-* prefixed legacy/duplicate URLs → strip the prefix.
  if (packageId.startsWith("rd-")) {
    return { kind: "redirect", to: `/room-decors/${packageId.slice(3)}` };
  }

  return { kind: "notFound" };
}

// SEO resolution — SPA logic 1:1 (live Shopify SEO → seoData → hardcoded fallback).
function seoPieces(pkg: RoomDecorPackage, data: ProductPageData | null) {
  const seo = seoData[pkg.shopifyHandle];
  const resolvedSeoTitle =
    data?.seoTitle || seo?.seoTitle || `${pkg.name} Miami | Room Decoration | Amorelia Luxury Floral Gifts`;
  const resolvedSeoDescription =
    data?.seoDescription || seo?.seoDescription || pkg.description;
  const resolvedDescription = data?.description || pkg.description;
  return { resolvedSeoTitle, resolvedSeoDescription, resolvedDescription };
}

export async function generateMetadata({ params }: { params: Promise<{ packageId: string }> }): Promise<Metadata> {
  const { packageId } = await params;
  const res = resolvePackageId(packageId);
  // Redirects/404 → minimal (the page function handles the response).
  if (res.kind !== "package") return { robots: { index: false, follow: false } };

  const data = await fetchProductPageData(res.pkg.shopifyHandle);
  const pieces = seoPieces(res.pkg, data);
  return buildMetadata({
    title: pieces.resolvedSeoTitle,
    description: pieces.resolvedSeoDescription,
    path: `/room-decors/${res.pkg.id}`,
    image: res.pkg.image,
  });
}

export default async function RoomDecorDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const res = resolvePackageId(packageId);

  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();

  const pkg = res.pkg;
  const data = await fetchProductPageData(pkg.shopifyHandle);
  const pieces = seoPieces(pkg, data);
  const { t } = getTranslator("en");

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          // Product schema ALWAYS with offers (real package price + USD) — SPEC §2.3.
          productSchema(pkg.name, pieces.resolvedSeoDescription, pkg.price, pkg.image),
          breadcrumbSchema([
            { name: "Home", url: "https://amorelialuxuryfloral.com" },
            { name: "Room Decors", url: "https://amorelialuxuryfloral.com/room-decors" },
            { name: pkg.name, url: `https://amorelialuxuryfloral.com/room-decors/${pkg.id}` },
          ]),
        ]}
      />
      <div className="pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: t("nav.home"), to: "/" },
              { label: t("nav.roomDecors"), to: "/room-decors" },
              { label: pkg.name },
            ]}
          />

          <RoomDecorDetailClient
            pkg={pkg}
            resolvedDescription={pieces.resolvedDescription}
            language="en"
          />

          {/* Closing Google-reviews summary (aggregate + CID link) — same
              structure as the bouquet fichas. */}
          <GoogleReviewsSummary language="en" />
        </div>
      </div>
    </div>
  );
}
