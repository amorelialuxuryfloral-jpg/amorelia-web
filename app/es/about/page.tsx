import type { Metadata } from "next";
import AboutView, { aboutMetadata } from "@/views/about";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return aboutMetadata("es");
}

export default function AboutPageEs() {
  return <AboutView language="es" />;
}
