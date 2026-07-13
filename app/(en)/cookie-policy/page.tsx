import type { Metadata } from "next";
import { CookiePolicyView, cookiePolicyMetadata } from "@/views/legalPolicy";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return cookiePolicyMetadata("en");
}

export default function CookiePolicyPage() {
  return <CookiePolicyView language="en" />;
}
