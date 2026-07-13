import type { Metadata } from "next";
import BouquetCollectionView from "@/components/BouquetCollectionView";
import { buildMetadata } from "@/lib/seo";
import { getTranslator } from "@/i18n";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  const { t } = getTranslator("es");
  return buildMetadata({
    title: t("seo.bouquets.title"),
    description: t("seo.bouquets.description"),
    path: "/bouquets",
    language: "es",
  });
}

export default function BouquetsPageEs() {
  return <BouquetCollectionView filter="all" language="es" />;
}
