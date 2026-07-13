import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout — Amorelia Luxury Floral Gifts",
  description: "Complete your Amorelia Luxury Floral Gifts order.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient language="en" />;
}
