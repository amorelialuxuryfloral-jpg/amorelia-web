import { notFound, permanentRedirect } from "next/navigation";
import { findCityBySlug } from "@/lib/cityPagesData";

/** /envio-de-flores/<city> at root → 301 to the EN canonical city URL. */
export const dynamicParams = true;

export function generateStaticParams(): Array<{ city: string }> {
  return [];
}

export default async function EnvioDeFloresCityRedirect({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const found = findCityBySlug(city);
  if (!found) notFound();
  permanentRedirect(`/flower-delivery/${found.slug}`);
}
