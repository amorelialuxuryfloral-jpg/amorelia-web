import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { productSchema, breadcrumbSchema } from "@/components/JsonLd";
import RoomDecorDetailClient from "@/components/roomdecor/RoomDecorDetailClient";
import GoogleReviewsSummary from "@/components/product/GoogleReviewsSummary";
import { roomDecorPackages, type RoomDecorPackage } from "@/lib/roomDecorData";
import { fetchProductPageData, type ProductPageData } from "@/lib/shopifyProduct";
import { buildMetadata } from "@/lib/seo";
import { getTranslator } from "@/i18n";

/**
 * /es/room-decors/[packageId] — ES twin of the room decor detail page.
 * Same resolution as the EN tree (rd-* legacy ids → 301 within /es); the
 * SEO/description cascade prefers the Shopify ES metafields, then the
 * hardcoded descriptionEs, then EN (SPA RoomDecorDetail 1:1).
 */

export const revalidate = 300;
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

  if (packageId === "rd-deluxe-love") {
    return { kind: "redirect", to: "/es/room-decors/deluxe-love-package" };
  }
  if (packageId.startsWith("rd-")) {
    return { kind: "redirect", to: `/es/room-decors/${packageId.slice(3)}` };
  }

  return { kind: "notFound" };
}

// SEO resolution — SPA cascade with ES metafields first.
function seoPiecesEs(pkg: RoomDecorPackage, data: ProductPageData | null) {
  // ES page: prefer Shopify ES metafields, then the hardcoded Spanish SEO,
  // then a Spanish fallback — NEVER the English seoData (would ship an English
  // <title>/meta on the /es twin).
  const resolvedSeoTitle =
    data?.seoTitleEs || pkg.seoTitleEs ||
    `${pkg.name} Miami | Decoración Romántica | Amorelia Luxury Floral Gifts`;
  const resolvedSeoDescription =
    data?.seoDescriptionEs || pkg.seoDescriptionEs || pkg.descriptionEs || pkg.description;
  const resolvedDescription =
    data?.descriptionEs || pkg.descriptionEs || data?.description || pkg.description;
  return { resolvedSeoTitle, resolvedSeoDescription, resolvedDescription };
}

export async function generateMetadata({ params }: { params: Promise<{ packageId: string }> }): Promise<Metadata> {
  const { packageId } = await params;
  const res = resolvePackageId(packageId);
  if (res.kind !== "package") return { robots: { index: false, follow: false } };

  const data = await fetchProductPageData(res.pkg.shopifyHandle);
  const pieces = seoPiecesEs(res.pkg, data);
  return buildMetadata({
    title: pieces.resolvedSeoTitle,
    description: pieces.resolvedSeoDescription,
    path: `/room-decors/${res.pkg.id}`,
    language: "es",
    image: res.pkg.image,
  });
}

export default async function RoomDecorDetailPageEs({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const res = resolvePackageId(packageId);

  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();

  const pkg = res.pkg;
  const data = await fetchProductPageData(pkg.shopifyHandle);
  const pieces = seoPiecesEs(pkg, data);
  const { t } = getTranslator("es");

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          // Product schema ALWAYS with offers (real package price + USD) — SPEC §2.3.
          productSchema(pkg.name, pieces.resolvedSeoDescription, pkg.price, pkg.image),
          breadcrumbSchema([
            { name: "Inicio", url: "https://amorelialuxuryfloral.com/es" },
            { name: "Decoración", url: "https://amorelialuxuryfloral.com/es/room-decors" },
            { name: pkg.name, url: `https://amorelialuxuryfloral.com/es/room-decors/${pkg.id}` },
          ]),
        ]}
      />
      <div className="pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: t("nav.home"), to: "/es" },
              { label: t("nav.roomDecors"), to: "/es/room-decors" },
              { label: pkg.name },
            ]}
          />

          <RoomDecorDetailClient
            pkg={pkg}
            resolvedDescription={pieces.resolvedDescription}
            language="es"
          />

          {/* Closing Google-reviews summary (aggregate + CID link) — same
              structure as the bouquet fichas. */}
          <GoogleReviewsSummary language="es" />
        </div>
      </div>
    </div>
  );
}
