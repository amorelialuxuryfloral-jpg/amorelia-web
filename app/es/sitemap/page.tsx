import type { Metadata } from "next";
import SitemapPageView, { sitemapPageMetadata } from "@/views/sitemapPage";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  return sitemapPageMetadata("es");
}

export default function SitemapPageEs() {
  return <SitemapPageView language="es" />;
}
