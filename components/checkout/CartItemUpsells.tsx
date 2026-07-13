"use client";

import { useEffect, useState } from "react";
import { Plus, Check, X, ArrowUpCircle, Loader2 } from "lucide-react";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { GLITTER_VARIANTS } from "@/lib/accessoryVariants";
import { crownPrice, ribbonPrice } from "@/lib/productData";
import { toast } from "sonner";
import { fetchVariantsByHandle, findVariantByRoses, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { getNotePrice, getButterflyPrice } from "@/lib/shopifyAccessoryPrices";
import { supabase } from "@/integrations/supabase/client";
import type { Language } from "@/i18n";

const glitterRoseImg = "/assets/glitter-rose.webp";
const butterflyImg = "/assets/butterfly-gold.webp";
const noteImg = "/assets/accessory-note.webp";
const crownSilverImg = "/assets/crown-silver.webp";
const crownGoldImg = "/assets/crown-gold.webp";
const ribbonImg = "/assets/ribbon.webp";

interface Props {
  item: CartItem;
  language?: Language;
}

const ROSE_TIERS = [50, 75, 100, 125, 150, 175, 200] as const;

// Module-level cache so we don't refetch variants for the same handle
// every time the drawer opens.
const variantsByHandleCache = new Map<string, ShopifyHandleVariant[]>();

/**
 * Per-bouquet upsells shown in the cart (SPA port 1:1):
 *  - Size upgrade (next rose tier; FedEx items recalc shipping via edge fn)
 *  - Glitter Finish (paid, depends on roses)
 *  - Note / Butterflies / Crown / Ribbon
 *
 * Updates the cart item in-place. The checkout flow reads item.glitter /
 * item.accessory / item.accessoryText etc., so the upsell is sent to Shopify
 * exactly the same way as if the user had picked it on the product page.
 */
const CartItemUpsells = ({ item, language = "en" }: Props) => {
  const updateItem = useCartStore((s) => s.updateItem);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState(item.accessoryText || "");
  const [upgradeClicked, setUpgradeClicked] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [crownOpen, setCrownOpen] = useState(false);
  const [ribbonOpen, setRibbonOpen] = useState(false);
  const [ribbonText, setRibbonText] = useState(item.ribbonText || "");
  const [siblingVariants, setSiblingVariants] = useState<ShopifyHandleVariant[] | null>(
    item.shopifyHandle ? variantsByHandleCache.get(item.shopifyHandle) ?? null : null,
  );
  const [notePrice, setNotePrice] = useState<number | null>(null);
  const [butterflyPrice, setButterflyPrice] = useState<number | null>(null);

  // Room decor items get their OWN extras section (real data from
  // lib/roomDecorData.ts) — never the bouquet upsells (Note/Butterflies/
  // glitter don't apply to a room decoration).
  const isRoomDecor = item.bouquetType === "room-decor";

  // Only for bouquet products (skip room decors / coming-soon items / Mother's Day bundle).
  const isBouquet =
    !isRoomDecor &&
    !!item.shopifyVariantId &&
    !!item.bouquetType &&
    !item.isMothersDay;

  // Lazy-load sibling size variants for the size-upgrade button.
  useEffect(() => {
    if (!isBouquet || !item.shopifyHandle || siblingVariants) return;
    let cancelled = false;
    fetchVariantsByHandle(item.shopifyHandle)
      .then((variants) => {
        if (cancelled) return;
        variantsByHandleCache.set(item.shopifyHandle!, variants);
        setSiblingVariants(variants);
      })
      .catch(() => { /* silently ignore — upgrade just won't show */ });
    return () => { cancelled = true; };
  }, [isBouquet, item.shopifyHandle, siblingVariants]);

  // Fetch live Shopify prices for Note / Butterfly accessories.
  useEffect(() => {
    if (!isBouquet) return;
    let cancelled = false;
    getNotePrice().then((p) => { if (!cancelled && p) setNotePrice(p.amount); });
    getButterflyPrice().then((p) => { if (!cancelled && p) setButterflyPrice(p.amount); });
    return () => { cancelled = true; };
  }, [isBouquet]);

  // ── Room decor: real complementary extras from lib/roomDecorData.ts ──
  // Only the FREE (complementary) add-ons are offered from the cart, capped
  // at the package's maxAddons exactly like the product page. Paid extras
  // (banner / ribbon) are NOT offered here: they have no Shopify line of
  // their own, so adding them from the cart would desync the drawer total
  // from the Shopify checkout total. If the package has no add-ons
  // (Love Bomb), the whole section is hidden — nothing invented.
  if (isRoomDecor) {
    const pkg = roomDecorPackages.find(
      (p) => p.shopifyVariantId === item.shopifyVariantId || p.name === item.productName,
    );
    const currentAddons = item.addons ?? [];
    const selectedPkgAddons = pkg
      ? currentAddons.filter((label) => pkg.addons.some((a) => a.label === label))
      : [];
    const slotsLeft = pkg ? pkg.maxAddons - selectedPkgAddons.length : 0;
    const availableAddons = pkg
      ? pkg.addons.filter((a) => a.price === 0 && !currentAddons.includes(a.label))
      : [];
    if (!pkg || pkg.maxAddons === 0 || slotsLeft <= 0 || availableAddons.length === 0) {
      return null;
    }

    const rdLabels = {
      title: language === "es" ? "Añade un detalle a esta decoración" : "Add an extra to this room decor",
      free: language === "es" ? "Gratis" : "Free",
      added: language === "es" ? "Añadido a esta decoración" : "Added to this room decor",
    };

    const handleAddRoomDecorAddon = (label: string, shownLabel: string) => {
      if (currentAddons.includes(label)) return;
      if (selectedPkgAddons.length >= pkg.maxAddons) return;
      // Complementary (price 0) → no price/totalPrice change, checkout intact.
      updateItem(item.id, { addons: [...currentAddons, label] });
      toast.success(`${shownLabel} — ${rdLabels.added}`);
    };

    return (
      <div className="mt-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-2">
        <p className="flex items-center justify-between gap-2 text-[10px] sm:text-xs font-body font-semibold text-primary mb-2 uppercase tracking-wider">
          <span>+ {rdLabels.title}</span>
          {/* N/X = complementary extras picked / max the package allows */}
          <span className="flex-shrink-0 normal-case tracking-normal text-muted-foreground">
            {selectedPkgAddons.length}/{pkg.maxAddons}
          </span>
        </p>
        <div className="flex flex-col gap-1.5">
          {availableAddons.map((addon) => {
            const shown = language === "es" && addon.labelEs ? addon.labelEs : addon.label;
            return (
              <button
                key={addon.label}
                type="button"
                onClick={() => handleAddRoomDecorAddon(addon.label, shown)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
              >
                <span className="flex-1 text-xs sm:text-sm font-body text-foreground">{shown}</span>
                <span className="text-xs sm:text-sm font-body font-semibold text-primary">{rdLabels.free}</span>
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (!isBouquet) return null;

  const hasGlitter = !!item.glitter;
  const hasNote = item.accessory === "note";
  const hasButterfly =
    item.accessory === "butterfly" ||
    (item.addons?.some((a) => a.toLowerCase().includes("butterfl")) ?? false);
  const hasCrown = !!item.crownSize ||
    (item.addons?.some((a) => a.toLowerCase().includes("crown")) ?? false);
  const hasRibbon = !!item.ribbonText ||
    (item.addons?.some((a) => a.toLowerCase() === "ribbon") ?? false);

  const glitterAvailable = !!GLITTER_VARIANTS[item.roses];
  const glitterCost = Math.ceil(item.roses / 25) * 8;

  const canShowGlitter = !hasGlitter && glitterAvailable;
  const canShowNote = !hasNote;
  const canShowButterfly = !hasButterfly;
  const canShowCrown = !hasCrown;
  const canShowRibbon = !hasRibbon;

  // Size upgrade: only if we know the sibling variants and there is a next tier
  // with a real variant available.
  const isFedex = !!item.fedexServiceCode;
  // FedEx is capped at 100 roses (box constraint).
  const maxUpgradeRoses = isFedex ? 100 : Infinity;
  const currentTierIdx = ROSE_TIERS.indexOf(item.roses as typeof ROSE_TIERS[number]);
  const rawNextRoses = currentTierIdx >= 0 && currentTierIdx < ROSE_TIERS.length - 1
    ? ROSE_TIERS[currentTierIdx + 1]
    : null;
  const nextRoses = rawNextRoses !== null && rawNextRoses <= maxUpgradeRoses ? rawNextRoses : null;
  const nextVariant = nextRoses && siblingVariants ? findVariantByRoses(siblingVariants, nextRoses) : null;
  const currentVariant = siblingVariants ? findVariantByRoses(siblingVariants, item.roses) : null;
  const currentVariantPrice = currentVariant?.price?.amount ? parseFloat(currentVariant.price.amount) : null;
  const nextVariantPrice = nextVariant?.price?.amount ? parseFloat(nextVariant.price.amount) : null;
  const upgradeDelta =
    currentVariantPrice !== null && nextVariantPrice !== null
      ? Math.max(0, parseFloat((nextVariantPrice - currentVariantPrice).toFixed(2)))
      : null;
  const canShowUpgrade =
    !!nextVariant && upgradeDelta !== null && nextVariantPrice !== null;

  if (!canShowGlitter && !canShowNote && !canShowButterfly && !canShowUpgrade && !canShowCrown && !canShowRibbon) return null;

  // N/X counter next to "Add an extra to this bouquet": N = extras this item
  // already has, X = extras that exist for it. Real availability only —
  // glitter counts only if a glitter variant exists for this rose count (or
  // the item already has it). The size upgrade is a swap, not an extra, so it
  // is not counted.
  const extrasCatalog = [
    { exists: glitterAvailable || hasGlitter, has: hasGlitter },
    { exists: true, has: hasNote },
    { exists: true, has: hasButterfly },
    { exists: true, has: hasCrown },
    { exists: true, has: hasRibbon },
  ];
  const extrasAvailableCount = extrasCatalog.filter((e) => e.exists).length;
  const extrasAddedCount = extrasCatalog.filter((e) => e.exists && e.has).length;

  const labels = {
    title: language === "es" ? "Añade un detalle a este ramo" : "Add an extra to this bouquet",
    glitter: language === "es" ? "Acabado Glitter" : "Glitter Finish",
    notes: language === "es" ? "Tarjeta con nota" : "Card with note",
    butterflies: language === "es" ? "Mariposas doradas" : "Gold butterflies",
    upgrade: language === "es" ? `Subir a ${nextRoses} rosas` : `Upgrade to ${nextRoses} roses`,
    upgradeBadge: language === "es" ? "Mejor valor" : "Better value",
    recommended: language === "es" ? "Recomendado" : "Recommended",
    crown: language === "es" ? "Corona Tiara" : "Crown Tiara",
    crownSilver: language === "es" ? "Plata" : "Silver",
    crownGold: language === "es" ? "Oro" : "Gold",
    ribbon: language === "es" ? "Cinta personalizada" : "Custom ribbon",
    ribbonPlaceholder: language === "es" ? "Escribe el texto de la cinta..." : "Write the ribbon text...",
    save: language === "es" ? "Guardar" : "Save",
    free: language === "es" ? "Gratis" : "Free",
    add: language === "es" ? "Añadir" : "Add",
    saveNote: language === "es" ? "Guardar nota" : "Save note",
    cancel: language === "es" ? "Cancelar" : "Cancel",
    placeholder: language === "es" ? "Escribe el mensaje que irá en la nota..." : "Write the message for the note...",
    added: language === "es" ? "Añadido a este ramo" : "Added to this bouquet",
    upgraded: language === "es" ? "Tamaño actualizado" : "Size upgraded",
  };

  const handleAddGlitter = () => {
    updateItem(item.id, {
      glitter: true,
      price: parseFloat((item.price + glitterCost).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + glitterCost).toFixed(2)),
    });
    toast.success(`${labels.glitter} — ${labels.added}`);
  };

  const handleAddButterfly = () => {
    const currentAddons = item.addons ?? [];
    if (currentAddons.some((a) => a.toLowerCase().includes("butterfl"))) return;
    const cost = butterflyPrice ?? 0;
    updateItem(item.id, {
      addons: [...currentAddons, "Butterflies"],
      price: parseFloat((item.price + cost).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + cost).toFixed(2)),
    });
    toast.success(`${labels.butterflies} — ${labels.added}`);
  };

  const handleSaveNote = () => {
    const trimmed = noteText.trim();
    if (!trimmed) return;
    const wasAlreadyNote = item.accessory === "note";
    const cost = wasAlreadyNote ? 0 : (notePrice ?? 0);
    updateItem(item.id, {
      accessory: "note",
      accessoryText: trimmed,
      price: parseFloat((item.price + cost).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + cost).toFixed(2)),
    });
    setNoteOpen(false);
    toast.success(`${labels.notes} — ${labels.added}`);
  };

  const handleAddCrown = (size: "silver" | "gold") => {
    const currentAddons = (item.addons ?? []).filter(
      (a) => !a.toLowerCase().includes("crown"),
    );
    updateItem(item.id, {
      crownSize: size,
      addons: [...currentAddons, `Crown Tiara (${size})`],
      price: parseFloat((item.price + crownPrice).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + crownPrice).toFixed(2)),
    });
    setCrownOpen(false);
    toast.success(`${labels.crown} — ${labels.added}`);
  };

  const handleSaveRibbon = () => {
    const trimmed = ribbonText.trim();
    if (!trimmed) return;
    const currentAddons = (item.addons ?? []).filter(
      (a) => a.toLowerCase() !== "ribbon",
    );
    updateItem(item.id, {
      ribbonText: trimmed,
      addons: [...currentAddons, "Ribbon"],
      price: parseFloat((item.price + ribbonPrice).toFixed(2)),
      totalPrice: parseFloat((item.totalPrice + ribbonPrice).toFixed(2)),
    });
    setRibbonOpen(false);
    toast.success(`${labels.ribbon} — ${labels.added}`);
  };

  const handleUpgrade = async () => {
    if (!nextVariant || nextVariantPrice === null || !nextRoses) return;
    if (upgradeLoading) return;
    // Recompute glitter cost if the item already has glitter, since glitter
    // price scales with roses count.
    const newGlitterCost = item.glitter ? Math.ceil(nextRoses / 25) * 8 : 0;
    const newPrice = parseFloat((nextVariantPrice + newGlitterCost).toFixed(2));
    const productDelta = newPrice - item.price;

    // FedEx path: recalc shipping with new rose count before committing.
    if (isFedex && item.structuredAddress && item.deliveryDate) {
      setUpgradeLoading(true);
      try {
        const { data, error: invokeError } = await supabase.functions.invoke(
          "calculate-fedex-shipping",
          {
            body: {
              recipient: {
                streetLines: [item.structuredAddress.address1].filter(Boolean),
                city: item.structuredAddress.city,
                stateOrProvinceCode: item.structuredAddress.province,
                postalCode: item.structuredAddress.zip,
                countryCode: item.structuredAddress.country || "US",
                residential: true,
              },
              roses: nextRoses,
              deliveryDate: item.deliveryDate,
            },
          },
        );
        const opts = Array.isArray(data?.options) ? data.options : [];
        if (invokeError || data?.error || opts.length === 0) {
          toast.error(
            language === "es"
              ? "No se pudo recalcular el envío FedEx. Inténtalo de nuevo."
              : "Could not recalculate FedEx shipping. Please try again.",
          );
          return;
        }
        const match =
          opts.find((o: { serviceCode: string }) => o.serviceCode === item.fedexServiceCode) || opts[0];
        const newDeliveryCost = parseFloat(Number(match.amount).toFixed(2));
        updateItem(item.id, {
          roses: nextRoses,
          shopifyVariantId: nextVariant.id,
          price: newPrice,
          // Keep the drawer's Subtotal/Extras split in sync: the new BASE is
          // the new variant's price (extras = price - basePrice = glitter).
          basePrice: nextVariantPrice,
          totalPrice: parseFloat((item.totalPrice + productDelta).toFixed(2)),
          deliveryCost: newDeliveryCost,
          fedexServiceCode: match.serviceCode,
          fedexRosesCount: nextRoses,
        });
        setUpgradeClicked(true);
        toast.success(
          `${labels.upgraded} — ${nextRoses} ${language === "es" ? "rosas" : "roses"}`,
        );
      } catch {
        toast.error(
          language === "es"
            ? "Error al recalcular el envío FedEx."
            : "Error recalculating FedEx shipping.",
        );
      } finally {
        setUpgradeLoading(false);
      }
      return;
    }

    // Non-FedEx: original behavior.
    updateItem(item.id, {
      roses: nextRoses,
      shopifyVariantId: nextVariant.id,
      price: newPrice,
      // Keep the drawer's Subtotal/Extras split in sync: the new BASE is
      // the new variant's price (extras = price - basePrice = glitter).
      basePrice: nextVariantPrice,
      totalPrice: parseFloat((item.totalPrice + productDelta).toFixed(2)),
    });
    setUpgradeClicked(true);
    toast.success(`${labels.upgraded} — ${nextRoses} ${language === "es" ? "rosas" : "roses"}`);
  };

  return (
    <div className="mt-3 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-2">
      <p className="flex items-center justify-between gap-2 text-[10px] sm:text-xs font-body font-semibold text-primary mb-2 uppercase tracking-wider">
        <span>+ {labels.title}</span>
        <span className="flex-shrink-0 normal-case tracking-normal text-muted-foreground">
          {extrasAddedCount}/{extrasAvailableCount}
        </span>
      </p>
      <div className="flex flex-col gap-1.5">
        {canShowUpgrade && (
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={upgradeLoading}
            className="relative w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            {!upgradeClicked && (
              <span className="absolute -top-2.5 right-3 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] font-body font-semibold uppercase tracking-wider leading-none shadow-sm">
                {labels.recommended}
              </span>
            )}
            {upgradeLoading ? (
              <Loader2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary flex-shrink-0 animate-spin" />
            ) : (
              <ArrowUpCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            )}
            <span className="flex-1 text-xs sm:text-sm font-body text-foreground">
              {labels.upgrade}
              <span className="ml-1.5 text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-primary/80">
                {labels.upgradeBadge}
              </span>
            </span>
            <span className="text-xs sm:text-sm font-body font-semibold text-primary">+${upgradeDelta}</span>
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </button>
        )}

        {canShowGlitter && (
          <button
            type="button"
            onClick={handleAddGlitter}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={glitterRoseImg} alt="" className="w-7 h-7 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
            <span className="flex-1 text-xs sm:text-sm font-body text-foreground">{labels.glitter}</span>
            <span className="text-xs sm:text-sm font-body font-semibold text-primary">+${glitterCost}</span>
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </button>
        )}

        {canShowNote && !noteOpen && (
          <button
            type="button"
            onClick={() => setNoteOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={noteImg} alt="" className="w-7 h-7 sm:w-10 sm:h-10 object-contain rounded flex-shrink-0" />
            <span className="flex-1 text-xs sm:text-sm font-body text-foreground">{labels.notes}</span>
            {notePrice !== null && (
              <span className="text-xs sm:text-sm font-body font-semibold text-primary">
                +${notePrice.toFixed(2)}
              </span>
            )}
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </button>
        )}

        {canShowNote && noteOpen && (
          <div className="rounded-md bg-card border border-primary/40 p-3">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={labels.placeholder}
              maxLength={500}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                type="button"
                onClick={() => { setNoteOpen(false); setNoteText(item.accessoryText || ""); }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" /> {labels.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="w-3 h-3" /> {labels.saveNote}
              </button>
            </div>
          </div>
        )}

        {canShowButterfly && (
          <button
            type="button"
            onClick={handleAddButterfly}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={butterflyImg} alt="" className="w-7 h-7 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
            <span className="flex-1 text-xs sm:text-sm font-body text-foreground">{labels.butterflies}</span>
            {butterflyPrice !== null && (
              <span className="text-xs sm:text-sm font-body font-semibold text-primary">
                +${butterflyPrice.toFixed(2)}
              </span>
            )}
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </button>
        )}

        {canShowCrown && !crownOpen && (
          <button
            type="button"
            onClick={() => setCrownOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={crownGoldImg} alt="" className="w-7 h-7 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
            <span className="flex-1 text-xs sm:text-sm font-body text-foreground">{labels.crown}</span>
            <span className="text-xs sm:text-sm font-body font-semibold text-primary">+${crownPrice}</span>
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </button>
        )}

        {canShowCrown && crownOpen && (
          <div className="rounded-md bg-card border border-primary/40 p-3">
            <p className="text-[11px] sm:text-xs font-body font-semibold text-foreground mb-2">
              {labels.crown} — +${crownPrice}
            </p>
            <div className="flex gap-2">
              {(["silver", "gold"] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleAddCrown(size)}
                  className="flex-1 flex flex-col items-center gap-1 p-2 rounded-md border border-border hover:border-primary hover:bg-primary/10 transition-colors"
                >
                  <img
                    src={size === "silver" ? crownSilverImg : crownGoldImg}
                    alt=""
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                  <span className="text-[11px] sm:text-xs font-body text-foreground">
                    {size === "silver" ? labels.crownSilver : labels.crownGold}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setCrownOpen(false)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" /> {labels.cancel}
              </button>
            </div>
          </div>
        )}

        {canShowRibbon && !ribbonOpen && (
          <button
            type="button"
            onClick={() => setRibbonOpen(true)}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2.5 rounded-md bg-card border border-primary/30 hover:border-primary hover:bg-primary/10 transition-colors text-left"
          >
            <img src={ribbonImg} alt="" className="w-7 h-7 sm:w-10 sm:h-10 object-contain flex-shrink-0" />
            <span className="flex-1 text-xs sm:text-sm font-body text-foreground">{labels.ribbon}</span>
            <span className="text-xs sm:text-sm font-body font-semibold text-primary">+${ribbonPrice}</span>
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          </button>
        )}

        {canShowRibbon && ribbonOpen && (
          <div className="rounded-md bg-card border border-primary/40 p-3">
            <p className="text-[11px] sm:text-xs font-body font-semibold text-foreground mb-2">
              {labels.ribbon} — +${ribbonPrice}
            </p>
            <input
              type="text"
              value={ribbonText}
              onChange={(e) => setRibbonText(e.target.value)}
              placeholder={labels.ribbonPlaceholder}
              maxLength={60}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="flex gap-2 mt-2 justify-end">
              <button
                type="button"
                onClick={() => { setRibbonOpen(false); setRibbonText(item.ribbonText || ""); }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" /> {labels.cancel}
              </button>
              <button
                type="button"
                onClick={handleSaveRibbon}
                disabled={!ribbonText.trim()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-xs font-body bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                <Check className="w-3 h-3" /> {labels.save}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItemUpsells;
