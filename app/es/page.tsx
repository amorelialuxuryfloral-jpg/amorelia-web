import type { Metadata } from "next";
import HomeView, { homeMetadata } from "@/views/home";

export const metadata: Metadata = homeMetadata("es");

/** Every hour, refresh live Shopify data (color card images). */
export const revalidate = 3600;

export default function HomeEs() {
  return <HomeView language="es" />;
}
