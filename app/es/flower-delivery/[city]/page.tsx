import { notFound, permanentRedirect } from "next/navigation";
import { findCityBySlug } from "@/lib/cityPagesData";

/** /es/flower-delivery/<city> → 301 to the ES canonical city URL. */
export const dynamicParams = true;

export function generateStaticParams(): Array<{ city: string }> {
  return [];
}

export default async function FlowerDeliveryCityEsRedirect({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const found = findCityBySlug(city);
  if (!found) notFound();
  permanentRedirect(`/es/envio-de-flores/${found.slugEs}`);
}
