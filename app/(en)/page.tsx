import type { Metadata } from "next";
import HomeView, { homeMetadata } from "@/views/home";

export const metadata: Metadata = homeMetadata("en");

/** Every hour, refresh live Shopify data (color card images). */
export const revalidate = 3600;

export default function Home() {
  return <HomeView language="en" />;
}
