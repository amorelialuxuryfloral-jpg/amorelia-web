import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Checkout — Amorelia Luxury Floral Gifts",
  description: "Completa tu pedido de Amorelia Luxury Floral Gifts.",
  path: "/checkout",
  language: "es",
  noindex: true,
});

export default function CheckoutPageEs() {
  return <CheckoutClient language="es" />;
}
