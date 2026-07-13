import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CityShippingView, { cityShippingMetadata, resolveCity } from "@/views/cityShipping";
import { cityPages } from "@/lib/cityPagesData";

export const revalidate = 3600;
// EN city slugs under the ES tree resolve at runtime (301).
export const dynamicParams = true;

export function generateStaticParams() {
  return cityPages.map((c) => ({ city: c.slugEs }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  return cityShippingMetadata(city, "es");
}

export default async function CityShippingPageEs({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const res = resolveCity(city, "es");
  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();
  return <CityShippingView city={res.city} language="es" />;
}
