import type { Metadata } from "next";
import FaqView, { faqMetadata } from "@/views/faq";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return faqMetadata("es");
}

export default function FaqPageEs() {
  return <FaqView language="es" />;
}
