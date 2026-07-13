import type { Metadata } from "next";
import BouquetCollectionView from "@/components/BouquetCollectionView";
import { buildMetadata } from "@/lib/seo";
import { getTranslator } from "@/i18n";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  const { t } = getTranslator("en");
  return buildMetadata({
    title: t("seo.bouquets.title"),
    description: t("seo.bouquets.description"),
    path: "/bouquets",
  });
}

export default function BouquetsPage() {
  return <BouquetCollectionView filter="all" language="en" />;
}
