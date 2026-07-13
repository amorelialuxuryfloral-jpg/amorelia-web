import type { Metadata } from "next";
import NotFoundView from "@/views/notFound";
import { getTranslator } from "@/i18n";

const { t } = getTranslator("es");

export const metadata: Metadata = {
  title: t("notFound.seoTitle"),
  description: t("notFound.seoDescription"),
  robots: { index: false, follow: false },
};

export default function NotFoundEs() {
  return <NotFoundView language="es" />;
}
