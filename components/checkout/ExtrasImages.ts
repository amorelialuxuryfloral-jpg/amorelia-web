// Maps addon/extra names to their thumbnail images (served from /public/assets).
const glitterRoseImg = "/assets/glitter-rose.webp";
const crownSilverImg = "/assets/crown-silver.webp";
const crownGoldImg = "/assets/crown-gold.webp";
const butterflyImg = "/assets/butterfly-gold.webp";
const lettersImg = "/assets/letters-babybreathe.webp";
const noteImg = "/assets/accessory-note.webp";

export function getExtraImage(addonName: string): string | null {
  const lower = addonName.toLowerCase();
  if (lower.includes("glitter")) return glitterRoseImg;
  if (lower.includes("crown") && lower.includes("gold")) return crownGoldImg;
  if (lower.includes("crown")) return crownSilverImg;
  if (lower.includes("butterfl")) return butterflyImg;
  if (lower.includes("letter") || lower.includes("number")) return lettersImg;
  if (lower.includes("note")) return noteImg;
  // Vase, ribbon — no dedicated image asset
  return null;
}

export function getAccessoryImage(accessory: string): string | null {
  if (accessory === "butterfly") return butterflyImg;
  return null;
}
