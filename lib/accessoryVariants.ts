/**
 * Shopify variant IDs for bouquet accessories.
 * These are added as separate line items in checkout.
 */

// === Variant IDs de AMORELIA (sacados vía Admin API 2026-07-14). ===
// Amorelia solo tiene: Glitter, Butterflies, Crown(Silver/Gold), Notes,
// Home Delivery, Service Fee. NO tiene Baby Breath / Vase / Ribbon / Cards /
// Custom Bouquet (eran de Charls) → esas constantes van vacías y su opción no
// existe en la ficha, así que nunca se añaden.

// Glitter Finish — variant by roses count
export const GLITTER_VARIANTS: Record<number, string> = {
  50: "48213595291866",
  75: "48213595324634",
  100: "48213595357402",
  125: "48213595390170",
  150: "48213595422938",
  175: "48213595455706",
  200: "48213595488474",
};

// Baby Breath — NO existe en Amorelia (vacío = nunca se añade).
export const BABY_BREATH_VARIANTS: Record<number, string> = {};

// Notes ($3) · Butterflies ($3). Cards no existe en Amorelia → cae a Notes.
export const NOTES_VARIANT_ID = "48213595947226";
export const CARDS_VARIANT_ID = "48213595947226";
export const BUTTERFLIES_VARIANT_ID = "48213594865882";

// Vase — NO existe en Amorelia.
export const VASE_VARIANTS: Record<number, string> = {};

// Crown variants ($10 cada uno)
export const CROWN_SILVER_VARIANT_ID = "48213595160794";
export const CROWN_GOLD_VARIANT_ID = "48213595193562";

// Ribbon — NO existe en Amorelia.
export const RIBBON_VARIANT_ID = "";

// Custom Bouquet — NO existe en Amorelia.
export const CUSTOM_BOUQUET_VARIANT_ID = "";

// Home Delivery fee product (base $0.10, qty = cost × 10, e.g. $31.20 → qty 312)
export const DELIVERY_FEE_VARIANT_ID = "48213595652314";
export const DELIVERY_FEE_VARIANT_GID = `gid://shopify/ProductVariant/${DELIVERY_FEE_VARIANT_ID}`;

export interface AccessoryLineItem {
  variantId: string;
  quantity: number;
}

/**
 * Build accessory line items from cart item data.
 * Glitter and Baby Breath now select the correct Shopify variant
 * based on roses/digits — quantity is always 1, price comes from Shopify.
 */
export function buildAccessoryLineItems(opts: {
  glitter: boolean;
  rosesCount: number;
  accessory: string; // "none" | "note" | "card" | "butterfly"
  specialText: string; // letters/numbers text
  addVase: boolean;
  vaseRoses?: number;
  addCrown: boolean;
  crownSize: string; // "silver" | "gold"
  addRibbon: boolean;
}): AccessoryLineItem[] {
  const items: AccessoryLineItem[] = [];

  // Glitter: select variant by roses count
  if (opts.glitter) {
    const glitterVariant = GLITTER_VARIANTS[opts.rosesCount];
    if (glitterVariant) {
      items.push({ variantId: glitterVariant, quantity: 1 });
    } else {
      console.warn(`No Glitter variant for ${opts.rosesCount} roses`);
    }
  }

  if (opts.accessory === "note") {
    items.push({ variantId: NOTES_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "card") {
    items.push({ variantId: CARDS_VARIANT_ID, quantity: 1 });
  } else if (opts.accessory === "butterfly") {
    items.push({ variantId: BUTTERFLIES_VARIANT_ID, quantity: 1 });
  }

  // Baby Breath: select variant by digit count (1-4)
  if (opts.specialText && opts.specialText.length > 0) {
    const digitCount = Math.min(opts.specialText.length, 4);
    const bbVariant = BABY_BREATH_VARIANTS[digitCount];
    if (bbVariant) {
      items.push({ variantId: bbVariant, quantity: 1 });
    } else {
      console.warn(`No Baby Breath variant for ${digitCount} digits`);
    }
  }

  if (opts.addVase && opts.vaseRoses) {
    const vaseVariant = VASE_VARIANTS[opts.vaseRoses];
    if (vaseVariant) {
      items.push({ variantId: vaseVariant, quantity: 1 });
    }
  }

  if (opts.addCrown) {
    const crownVariant = opts.crownSize === "gold" ? CROWN_GOLD_VARIANT_ID : CROWN_SILVER_VARIANT_ID;
    items.push({ variantId: crownVariant, quantity: 1 });
  }

  if (opts.addRibbon && RIBBON_VARIANT_ID) {
    items.push({ variantId: RIBBON_VARIANT_ID, quantity: 1 });
  }

  return items;
}
