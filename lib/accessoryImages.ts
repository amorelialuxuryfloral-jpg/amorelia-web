import { storefrontApiRequest } from "@/lib/shopify";
import {
  TEDDY_PRODUCT_GID,
  BALLOON_PRODUCT_GID,
  BABY_BREATH_PRODUCT_GID,
} from "@/lib/accessoryVariants";

/**
 * Imágenes de los accesorios de la ficha (oso, globos, letras) servidas por
 * SHOPIFY — la web nunca guarda estas fotos en el repo. Diego cambia la foto
 * en el admin de Shopify y la ficha la refleja sola (mismo patrón que
 * shopifyAccessoryPrices). Si un producto aún no tiene foto, la UI cae al
 * icono de siempre.
 */

const QUERY = `
  query AccessoryImages($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        featuredImage { url(transform: { maxWidth: 320, maxHeight: 320 }) }
        variants(first: 20) {
          nodes {
            image { url(transform: { maxWidth: 320, maxHeight: 320 }) }
            selectedOptions { name value }
          }
        }
      }
    }
  }
`;

export interface ProductImages {
  featured: string | null;
  /** Color option value → variant image url (solo variantes con foto). */
  byColor: Record<string, string>;
}

export interface AccessoryImages {
  teddy: ProductImages;
  balloons: ProductImages;
  letters: ProductImages;
}

const EMPTY: ProductImages = { featured: null, byColor: {} };

let cache: AccessoryImages | null = null;
let inflight: Promise<AccessoryImages> | null = null;

interface ProductNode {
  id: string;
  featuredImage?: { url: string } | null;
  variants?: {
    nodes: Array<{
      image?: { url: string } | null;
      selectedOptions: Array<{ name: string; value: string }>;
    }>;
  };
}

function toProductImages(node: ProductNode | null | undefined): ProductImages {
  if (!node) return EMPTY;
  const byColor: Record<string, string> = {};
  for (const v of node.variants?.nodes ?? []) {
    if (!v.image?.url) continue;
    const color = v.selectedOptions.find((o) => o.name === "Color")?.value;
    if (color && !byColor[color]) byColor[color] = v.image.url;
  }
  return { featured: node.featuredImage?.url ?? null, byColor };
}

export async function getAccessoryImages(): Promise<AccessoryImages> {
  if (cache) return cache;
  if (inflight) return inflight;

  const ids = [TEDDY_PRODUCT_GID, BALLOON_PRODUCT_GID, BABY_BREATH_PRODUCT_GID];

  inflight = storefrontApiRequest(QUERY, { ids })
    .then((data) => {
      const nodes = (data?.data?.nodes ?? []) as Array<ProductNode | null>;
      const byId = new Map(nodes.filter(Boolean).map((n) => [n!.id, n!]));
      cache = {
        teddy: toProductImages(byId.get(TEDDY_PRODUCT_GID)),
        balloons: toProductImages(byId.get(BALLOON_PRODUCT_GID)),
        letters: toProductImages(byId.get(BABY_BREATH_PRODUCT_GID)),
      };
      inflight = null;
      return cache;
    })
    .catch((err) => {
      inflight = null;
      console.warn("[accessoryImages] fetch failed", err);
      return { teddy: EMPTY, balloons: EMPTY, letters: EMPTY };
    });

  return inflight;
}
