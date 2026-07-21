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

// === Plush Teddy Bear (producto "Plush Teddy Bear", creado 2026-07-21) ===
export interface TeddySizeOption {
  key: "small" | "medium" | "large";
  label: string;
  heightIn: number;
  heightCm: number;
  price: number;
}

export const TEDDY_SIZES: TeddySizeOption[] = [
  { key: "small", label: "Small", heightIn: 10, heightCm: 26, price: 45 },
  { key: "medium", label: "Medium", heightIn: 17, heightCm: 43, price: 69 },
  { key: "large", label: "Large", heightIn: 42, heightCm: 107, price: 89 },
];

export const TEDDY_COLORS = ["Black", "Red", "Brown", "Light Brown"] as const;

// size key → Shopify color name → variant numeric id
export const TEDDY_VARIANT_IDS: Record<string, Record<string, string>> = {
  small: {
    Black: "48252691611866",
    Red: "48252691644634",
    Brown: "48252691677402",
    "Light Brown": "48252691710170",
  },
  medium: {
    Black: "48252691742938",
    Red: "48252691775706",
    Brown: "48252691808474",
    "Light Brown": "48252691841242",
  },
  large: {
    Black: "48252691874010",
    Red: "48252691906778",
    Brown: "48252691939546",
    "Light Brown": "48252691972314",
  },
};

// === Helium Balloons (producto "Helium Balloons", creado 2026-07-21) ===
export const BALLOON_COLORS = ["Red", "Pastel Pink", "Iridescent"] as const;
export const BALLOON_UNIT_PRICE = 6.9;

export const BALLOON_VARIANT_IDS: Record<string, string> = {
  Red: "48252692431066",
  "Pastel Pink": "48252692463834",
  Iridescent: "48252692496602",
};

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
  // Teddy bear + balloons (optional — older call sites simply omit them)
  teddySize?: string; // "small" | "medium" | "large"
  teddyColor?: string; // Shopify color name, e.g. "Light Brown"
  balloonColor?: string; // Shopify color name, e.g. "Pastel Pink"
  balloonQty?: number;
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

  if (opts.teddySize && opts.teddyColor) {
    const teddyVariant = TEDDY_VARIANT_IDS[opts.teddySize]?.[opts.teddyColor];
    if (teddyVariant) {
      items.push({ variantId: teddyVariant, quantity: 1 });
    } else {
      console.warn(`No Teddy Bear variant for ${opts.teddySize} / ${opts.teddyColor}`);
    }
  }

  if (opts.balloonColor && (opts.balloonQty ?? 0) > 0) {
    const balloonVariant = BALLOON_VARIANT_IDS[opts.balloonColor];
    if (balloonVariant) {
      items.push({ variantId: balloonVariant, quantity: opts.balloonQty! });
    } else {
      console.warn(`No Balloon variant for color ${opts.balloonColor}`);
    }
  }

  return items;
}
