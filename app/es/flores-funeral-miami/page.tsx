import type { Metadata } from "next";
import FuneralFlowersView, { funeralMetadata } from "@/views/funeralFlowers";

/**
 * /es/flores-funeral-miami — ES twin of /funeral-sympathy-flowers-miami
 * (plan §3). The old /es/collections/arreglos-funebres 301s here.
 */
export const revalidate = 600;

export function generateMetadata(): Metadata {
  return funeralMetadata("es");
}

export default function FloresFuneralMiamiPage() {
  return <FuneralFlowersView language="es" />;
}
