import type { Metadata } from "next";
import FuneralFlowersView, { funeralMetadata } from "@/views/funeralFlowers";

/**
 * /funeral-sympathy-flowers-miami — plan §3 (Romuald+Dani): local funeral &
 * sympathy money page. The old /collections/sympathy-flowers 301s here.
 */
export const revalidate = 600;

export function generateMetadata(): Metadata {
  return funeralMetadata("en");
}

export default function FuneralSympathyFlowersMiamiPage() {
  return <FuneralFlowersView language="en" />;
}
