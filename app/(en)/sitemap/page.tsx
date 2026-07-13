import type { Metadata } from "next";
import SitemapPageView, { sitemapPageMetadata } from "@/views/sitemapPage";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  return sitemapPageMetadata("en");
}

export default function SitemapPage() {
  return <SitemapPageView language="en" />;
}
