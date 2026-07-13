import type { Metadata } from "next";
import AboutView, { aboutMetadata } from "@/views/about";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return aboutMetadata("en");
}

export default function AboutPageEn() {
  return <AboutView language="en" />;
}
