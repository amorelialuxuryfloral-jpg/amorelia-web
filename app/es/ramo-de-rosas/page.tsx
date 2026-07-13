import type { Metadata } from "next";
import CollectionLanding from "@/components/CollectionLanding";
import { ramoDeRosasPage, RAMO_DE_ROSAS_PATH } from "@/lib/ramoDeRosasData";
import { buildMetadata } from "@/lib/seo";

/**
 * /es/ramo-de-rosas — plan §5 (cola ES): "ramo de rosas" 12.100. ES-only
 * canonical; the full REAL rose catalog hangs as the grid. /ramo-de-rosas
 * under the EN tree 301s here (next.config.ts).
 */
export const revalidate = 600;

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: ramoDeRosasPage.title.es,
    description: ramoDeRosasPage.description.es,
    path: RAMO_DE_ROSAS_PATH,
    language: "es",
    esOnly: true,
  });
}

export default function RamoDeRosasPage() {
  return (
    <CollectionLanding
      page={ramoDeRosasPage}
      language="es"
      pathOverride={{ en: RAMO_DE_ROSAS_PATH, es: RAMO_DE_ROSAS_PATH }}
      parent={{
        path: "/es/bouquets",
        url: "https://amorelialuxuryfloral.com/es/bouquets",
        label: "Ramos",
      }}
    />
  );
}
