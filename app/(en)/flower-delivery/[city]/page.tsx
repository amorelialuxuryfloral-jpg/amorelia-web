import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CityShippingView, { cityShippingMetadata, resolveCity } from "@/views/cityShipping";
import { cityPages } from "@/lib/cityPagesData";

export const revalidate = 3600;
// ES city slugs under the EN tree resolve at runtime (301).
export const dynamicParams = true;

export function generateStaticParams() {
  return cityPages.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city } = await params;
  return cityShippingMetadata(city, "en");
}

export default async function CityShippingPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const res = resolveCity(city, "en");
  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();
  return <CityShippingView city={res.city} language="en" />;
}
