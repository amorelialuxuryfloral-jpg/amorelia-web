import type { Metadata } from "next";
import CityIndexView, { cityIndexMetadata } from "@/views/cityIndex";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return cityIndexMetadata("es");
}

export default function EnvioDeFloresIndexPageEs() {
  return <CityIndexView language="es" />;
}
