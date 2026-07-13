import type { Metadata } from "next";
import MothersDayView, { mothersDayMetadata } from "@/views/mothersDay";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  return mothersDayMetadata("en");
}

export default function MothersDayPage() {
  return <MothersDayView language="en" />;
}
