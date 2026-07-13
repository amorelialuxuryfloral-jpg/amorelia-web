import type { Metadata } from "next";
import FaqView, { faqMetadata } from "@/views/faq";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return faqMetadata("en");
}

export default function FaqPage() {
  return <FaqView language="en" />;
}
