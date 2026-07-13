import type { Metadata } from "next";
import { ShopifyPolicyView, legalMetadata, LEGAL_PAGES } from "@/views/legalPolicy";

const DEF = LEGAL_PAGES["shipping-policy"];

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return legalMetadata(DEF, "es");
}

export default function ShippingPolicyPageEs() {
  return <ShopifyPolicyView def={DEF} language="es" />;
}
