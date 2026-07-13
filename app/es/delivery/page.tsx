import type { Metadata } from "next";
import DeliveryView, { deliveryMetadata } from "@/views/delivery";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return deliveryMetadata("es");
}

export default function DeliveryPageEs() {
  return <DeliveryView language="es" />;
}
