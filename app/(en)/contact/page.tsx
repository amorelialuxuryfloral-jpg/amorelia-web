import type { Metadata } from "next";
import ContactView, { contactMetadata } from "@/views/contact";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return contactMetadata("en");
}

export default function ContactPageEn() {
  return <ContactView language="en" />;
}
