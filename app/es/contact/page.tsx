import type { Metadata } from "next";
import ContactView, { contactMetadata } from "@/views/contact";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return contactMetadata("es");
}

export default function ContactPageEs() {
  return <ContactView language="es" />;
}
