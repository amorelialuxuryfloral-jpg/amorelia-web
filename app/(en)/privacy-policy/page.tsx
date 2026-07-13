import type { Metadata } from "next";
import { ShopifyPolicyView, legalMetadata, LEGAL_PAGES } from "@/views/legalPolicy";

const DEF = LEGAL_PAGES["privacy-policy"];

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return legalMetadata(DEF, "en");
}

export default function PrivacyPolicyPage() {
  return <ShopifyPolicyView def={DEF} language="en" />;
}
