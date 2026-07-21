"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";
import { X, Trash2, Loader2, Plus, Minus, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import BrandLogo from "@/components/BrandLogo";
import { getTranslator, localizePath, type Language } from "@/i18n";
import { performApiCheckout } from "@/lib/checkout";
import { buildAccessoryLineItems, BUTTERFLIES_VARIANT_ID } from "@/lib/accessoryVariants";
import { getPaperForCartItem } from "@/lib/paperHelper";
import CartItemUpsells from "@/components/checkout/CartItemUpsells";
import ProductRatingBar from "@/components/product/ProductRatingBar";
import { computeShippingProtection, getShippingProtectionFallback, getShippingProtectionInfo, type ShippingProtectionInfo } from "@/lib/shippingProtection";

/**
 * Cart drawer — full FloatingCart port from the SPA (Phase 2).
 *
 * "Continue to Safe Checkout" builds the ENTIRE Shopify cart in one
 * `performApiCheckout()` call: product+accessory+fee lines, ORDER NOTE with
 * every configurator detail, delivery/FedEx attributes and the UTM/source
 * attribution attributes (SPEC §8.ter — preserved 1:1, do not touch).
 */
const CartDrawer = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const isLoading = useCartStore((s) => s.isLoading);
  // Shipping Protection DESACTIVADO en Amorelia (no existe ese producto) — off fijo.
  const shippingProtectionEnabled = false;
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Persisted state only renders after mount (server HTML has the drawer closed).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const cartTotal = items.reduce((sum, i) => sum + i.totalPrice * (i.quantity || 1), 0);
  const itemsSubtotal = parseFloat(items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0).toFixed(2));
  // Shipping Protection: REAL live price from Shopify, TIERED by the cart's
  // products+extras total (itemsSubtotal): ≤$180→$15, ≤$280→$25, else $35.
  // Same source + same tier the toggle and performApiCheckout use, so the
  // line always shows what Shopify will actually charge.
  const [shippingProtectionInfo, setShippingProtectionInfo] = useState<ShippingProtectionInfo>(getShippingProtectionFallback());
  useEffect(() => {
    let active = true;
    getShippingProtectionInfo().then((info) => {
      if (active && info) setShippingProtectionInfo(info);
    });
    return () => { active = false; };
  }, []);
  const shippingProtectionAmount = computeShippingProtection(shippingProtectionInfo, itemsSubtotal).amount;
  const deliveryItems = items.filter((i) => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");
  const deliveryItem = deliveryItems[0];
  const checkoutDeliveryMethod: "pickup" | "delivery" = deliveryItem ? "delivery" : "pickup";
  // Multiple bouquets to multiple addresses = one delivery fee PER address
  // (sum them all — not just the first). Each item's own delivery cost.
  const deliveryCost = parseFloat(
    deliveryItems.reduce((s, i) => s + (i.deliveryCost || 0), 0).toFixed(2),
  );
  const extrasTotal = parseFloat((deliveryCost + (shippingProtectionEnabled ? shippingProtectionAmount : 0)).toFixed(2));
  const displayTotal = parseFloat((itemsSubtotal + extrasTotal).toFixed(2));
  // ── Display-only breakdown (the checkout math above/below is UNTOUCHED) ──
  //  · Subtotal  = base product prices only (item.basePrice — no add-ons)
  //  · Extras    = the product add-ons (glitter, note, butterflies, crown,
  //                ribbon, vase, letters…) = Σ (price - basePrice)
  //  · Delivery  = the REAL stored shipping cost (own line, Home Delivery only)
  //  · Shipping Protection = its own line with the real Shopify price
  //  · Total     = Subtotal + Extras + Delivery + Shipping Protection
  //                (identical to displayTotal: baseSubtotal + productExtras
  //                 ≡ itemsSubtotal, so nothing desyncs from checkout).
  // Items persisted before basePrice existed fall back to price (extras 0).
  const baseSubtotal = parseFloat(
    items.reduce((sum, i) => sum + (i.basePrice ?? i.price) * (i.quantity || 1), 0).toFixed(2),
  );
  const productExtrasTotal = parseFloat(Math.max(0, itemsSubtotal - baseSubtotal).toFixed(2));
  const protectionDisplayTotal = shippingProtectionEnabled ? shippingProtectionAmount : 0;
  const showDeliveryLine = checkoutDeliveryMethod === "delivery";
  const isRoomDecorDelivery = deliveryItem?.bouquetType === "room-decor";

  // FedEx safety net: if a delivery item has an address >87 mi but no FedEx
  // service selected, block "Continue to Safe Checkout" and show a warning.
  const fedexBlockingItem = items.find(
    (i) =>
      i.deliveryMethod === "delivery" &&
      (i.deliveryMiles ?? 0) > 87 &&
      !i.fedexServiceCode,
  );
  const fedexNeedsMultiBouquet =
    !!fedexBlockingItem && items.filter((i) => i.bouquetType !== "addon").length > 1;

  // GA4: view_cart fires only on the closed→open transition
  const wasOpenRef = useRef(isOpen);
  useEffect(() => {
    if (!wasOpenRef.current && isOpen) {
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'view_cart', {
        currency: 'USD',
        value: parseFloat(cartTotal.toFixed(2)),
        items: items.map(i => ({
          item_id: i.shopifyVariantId || i.bouquetType,
          item_name: i.productName || i.bouquetType,
          item_category: i.bouquetType,
          price: parseFloat(i.price.toFixed(2)),
          quantity: i.quantity || 1,
        })),
      });
    }
    wasOpenRef.current = isOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // GA4: remove_from_cart wrapper around the store action
  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'remove_from_cart', {
        currency: 'USD',
        value: parseFloat((item.price * (item.quantity || 1)).toFixed(2)),
        items: [{
          item_id: item.shopifyVariantId || item.bouquetType,
          item_name: item.productName || item.bouquetType,
          price: parseFloat(item.price.toFixed(2)),
          quantity: item.quantity || 1,
        }],
      });
    }
    removeItem(id);
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setIsCheckingOut(true);
    try {
      const itemWithDate = items.find((i) => i.deliveryDate);
      const itemWithHour = items.find((i) => i.deliveryHour);
      const deliveryDate = itemWithDate?.deliveryDate || "";
      const deliveryHour = itemWithHour?.deliveryHour || "";

      // FedEx detection: any item carrying a selected FedEx service code.
      const fedexItem = items.find((i) => i.fedexServiceCode);
      const isFedex = !!fedexItem;
      const fedexServiceNames: Record<string, string> = {
        FIRST_OVERNIGHT: "FedEx First Overnight",
        PRIORITY_OVERNIGHT: "FedEx Priority Overnight",
        STANDARD_OVERNIGHT: "FedEx Standard Overnight",
        FEDEX_2_DAY_AM: "FedEx 2Day AM",
        FEDEX_2_DAY: "FedEx 2Day",
        FEDEX_EXPRESS_SAVER: "FedEx Express Saver",
        GROUND_HOME_DELIVERY: "FedEx Ground Home Delivery",
        FEDEX_GROUND: "FedEx Ground",
      };
      const fedexServiceName = fedexItem?.fedexServiceCode
        ? fedexServiceNames[fedexItem.fedexServiceCode] || `FedEx ${fedexItem.fedexServiceCode}`
        : "";

      const noteLines: string[] = [];
      noteLines.push("DATOS DEL ENVÍO");
      noteLines.push(
        `- 🚚 Tipo: ${
          isFedex
            ? fedexServiceName
            : checkoutDeliveryMethod === "delivery"
            ? "Home Delivery"
            : "Store Pickup"
        }`,
      );

      if (deliveryDate) {
        const dateObj = /^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)
          ? new Date(deliveryDate + "T00:00:00")
          : new Date(deliveryDate);
        const formattedDate = !isNaN(dateObj.getTime())
          ? format(dateObj, "PPP", { locale: enUS })
          : deliveryDate;
        noteLines.push(`- 📅 Fecha: ${formattedDate}`);
      }
      if (deliveryHour && !isFedex) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
      // Single delivery address → show it once up top. Multiple addresses →
      // each one is printed under its own product below (see the loop).
      if (checkoutDeliveryMethod === "delivery" && deliveryItems.length === 1 && deliveryItem) {
        noteLines.push(`- 📍 Dirección: ${deliveryItem.deliveryAddress}`);
      } else if (checkoutDeliveryMethod === "delivery" && deliveryItems.length > 1) {
        noteLines.push(`- 📍 ${deliveryItems.length} entregas a distintas direcciones (ver cada producto)`);
      }

      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        noteLines.push("");
        noteLines.push(`DATOS DEL PRODUCTO ${idx + 1}`);
        noteLines.push(`- 🌹 Producto: ${item.productName || item.bouquetType}`);
        // Multi-address orders: print THIS product's own delivery address + fee.
        if (
          deliveryItems.length > 1 &&
          item.deliveryMethod === "delivery" &&
          item.deliveryAddress &&
          item.deliveryAddress !== "Store pickup"
        ) {
          noteLines.push(`- 📍 Dirección de entrega: ${item.deliveryAddress}`);
          if (item.deliveryCost) noteLines.push(`- 🚚 Envío: $${item.deliveryCost.toFixed(2)}`);
        }
        if ((item.quantity || 1) > 1) {
          noteLines.push(`- 🔢 Cantidad: ${item.quantity}`);
        }

        if (item.bouquetType === "custom" && item.color) {
          const colors = item.color.split(",").map(c => c.trim()).filter(Boolean);
          colors.forEach((c, ci) => {
            noteLines.push(`- 🌸 Colour ${ci + 1}: ${c}`);
          });
        } else if (item.color) {
          noteLines.push(`- 🌸 Color: ${item.color}`);
        }

        const catalogPaper = await getPaperForCartItem(item.productName, item.bouquetType);
        const paperToShow = catalogPaper || item.paperColor;
        if (paperToShow) noteLines.push(`- 📄 Paper color: ${paperToShow}`);
        if (item.roses) noteLines.push(`- 🌹 Roses: ${item.roses}`);
        if (item.glitter) noteLines.push(`- ✨ Glitter finish: Yes`);
        if (item.crownSize) noteLines.push(`- 👑 Crown: ${item.crownSize}`);
        if (item.accessory && item.accessory !== "none") {
          const accLabel = item.accessory === "note" ? "Notes" : item.accessory === "card" ? "Card" : "Butterflies";
          noteLines.push(`- 🦋 Accessory: ${accLabel}`);
        }
        if (
          item.accessory !== "butterfly" &&
          item.addons?.some((a) => a.toLowerCase().includes("butterfl"))
        ) {
          noteLines.push(`- 🦋 Accessory: Butterflies`);
        }
        if (item.accessoryText) noteLines.push(`- 💌 Card text: ${item.accessoryText}`);
        if (item.ribbonText) noteLines.push(`- 🎀 Custom ribbon: ${item.ribbonText}`);
        if (item.specialText) noteLines.push(`- 🔤 Letters or numbers (Baby Breath): ${item.specialText}`);
        if (item.teddySize && item.teddyColor) noteLines.push(`- 🧸 Teddy Bear: ${item.teddySize} / ${item.teddyColor}`);
        if (item.balloonColor && item.balloonQty) noteLines.push(`- 🎈 Helium Balloons: ${item.balloonColor} ×${item.balloonQty}`);
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        if (vaseAddon) noteLines.push(`- 🏺 Vase: ${vaseAddon}`);
        // Room decor: print the package's complementary extras + bouquet color
        // so they reach the order (they have no Shopify line of their own).
        if (item.bouquetType === "room-decor" && item.addons?.length) {
          for (const addon of item.addons) {
            if (addon.startsWith("Ribbon:")) continue; // printed via 🎀 above
            if (addon.startsWith("Bouquet:")) noteLines.push(`- 💐 ${addon}`);
            else noteLines.push(`- 🎈 Extra: ${addon}`);
          }
        }
        if (item.customerNotes) {
          noteLines.push("");
          noteLines.push("NOTAS DEL CLIENTE");
          noteLines.push(`📝 Nota del cliente: ${item.customerNotes}`);
        }
      }

      const accessoryLineItems = items.flatMap((item) => {
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        const vaseRosesMatch = vaseAddon?.match(/\((\d+)/);
        const qty = item.quantity || 1;
        const hasButterflyAddon =
          item.addons?.some((a) => a.toLowerCase().includes("butterfl")) ?? false;
        const lines = buildAccessoryLineItems({
          glitter: item.glitter,
          rosesCount: item.roses,
          accessory: item.accessory,
          specialText: item.specialText,
          addVase: !!vaseAddon,
          vaseRoses: vaseRosesMatch ? parseInt(vaseRosesMatch[1], 10) : undefined,
          addCrown: !!item.crownSize,
          crownSize: item.crownSize,
          addRibbon: !!item.ribbonText,
          teddySize: item.teddySize,
          teddyColor: item.teddyColor,
          balloonColor: item.balloonColor,
          balloonQty: item.balloonQty,
        });
        if (hasButterflyAddon && item.accessory !== "butterfly") {
          lines.push({ variantId: BUTTERFLIES_VARIANT_ID, quantity: 1 });
        }
        return lines.map((l) => ({ ...l, quantity: l.quantity * qty }));
      });

      // Service-fee base = products + extras (extrasTotal ALREADY includes the
      // delivery cost + protection). Do NOT add deliveryCost again here — that
      // double-counted delivery in the 4.5% fee on every delivery order.
      const cartTotalForFee = itemsSubtotal + extrasTotal;

      const checkoutUrl = await performApiCheckout({
        deliveryMethod: checkoutDeliveryMethod,
        deliveryCost,
        serviceFeeBase: cartTotalForFee,
        deliveryAddress: checkoutDeliveryMethod === "delivery" ? deliveryItem?.deliveryAddress : undefined,
        deliveryZip: checkoutDeliveryMethod === "delivery" ? deliveryItem?.deliveryZip : undefined,
        structuredAddress: checkoutDeliveryMethod === "delivery" ? deliveryItem?.structuredAddress : undefined,
        accessories: accessoryLineItems,
        note: noteLines.join("\n"),
        fedex:
          isFedex && fedexItem?.fedexServiceCode && fedexItem?.fedexRecipientAddress
            ? {
                serviceCode: fedexItem.fedexServiceCode,
                rosesCount: fedexItem.fedexRosesCount ?? fedexItem.roses ?? 0,
                recipientAddress: fedexItem.fedexRecipientAddress,
              }
            : undefined,
      });

      if (!checkoutUrl) {
        toast.error("Could not get checkout URL. Please try again.");
        return;
      }

      setOpen(false);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-foreground/40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 bottom-0 right-0 z-[61] w-[85vw] max-w-md bg-background border-l border-border shadow-xl transition-transform duration-300 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal={isOpen}
        aria-label={t("floatingCart.yourCart")}
      >
        {/* Mobile: pt-3 (was pt-6) so "Your Cart" sits closer to the top edge
            and the product list below gains vertical space; desktop keeps pt-6. */}
        <div className="px-4 pt-3 pb-2 sm:px-6 sm:pt-6 border-b border-border">
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-lg sm:text-xl text-foreground flex items-center gap-2 m-0">
              <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7" />
              <span>
                {t("floatingCart.yourCart")} ({totalItems})
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close cart"
              className="-mr-1 w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted active:bg-muted transition-colors"
            >
              <X className="w-6 h-6" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4 sm:pt-4">
          {totalItems === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
              <p className="font-body text-sm text-muted-foreground">{t("floatingCart.empty")}</p>
              <Link
                href={localizePath("/bouquets", language)}
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 font-body text-xs tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
              >
                {t("floatingCart.continueShopping")}
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 pb-4 border-b last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.productName || item.bouquetType} width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <BrandLogo className="w-6 h-6" color="hsl(var(--primary))" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-base font-semibold text-foreground truncate">
                          {item.productName || item.bouquetType}
                        </p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {item.roses} {t("product.roses")}
                        </p>
                        <div className="flex items-center justify-between mt-1.5">
                          <p className="font-body text-xs sm:text-sm font-semibold text-foreground">
                            ${parseFloat((item.totalPrice * (item.quantity || 1)).toFixed(2))}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex items-center border-2 border-primary rounded-full overflow-hidden">
                              <button
                                type="button"
                                disabled={isLoading}
                                onClick={() => {
                                  const q = item.quantity || 1;
                                  if (q <= 1) handleRemoveItem(item.id);
                                  else updateQuantity(item.id, q - 1);
                                }}
                                aria-label="Decrease quantity"
                                className="px-2 sm:px-2.5 py-1 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                              >
                                <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                              <span className="font-body text-xs sm:text-sm font-semibold text-primary min-w-[1.25rem] text-center select-none">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                disabled={isLoading || (item.quantity || 1) >= 25}
                                onClick={() => {
                                  const q = item.quantity || 1;
                                  if (q < 25) updateQuantity(item.id, q + 1);
                                }}
                                aria-label="Increase quantity"
                                className="px-2 sm:px-2.5 py-1 text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                              >
                                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                              </button>
                            </div>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => handleRemoveItem(item.id)}
                              aria-label={t("floatingCart.remove")}
                              className="p-1 sm:p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CartItemUpsells item={item} language={language} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {totalItems > 0 && (
          <div className="border-t px-6 py-4 space-y-3 bg-background">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-body text-sm text-muted-foreground">
                  {t("floatingCart.subtotal")}
                </span>
                <span className="font-display text-base font-semibold text-foreground">
                  ${baseSubtotal.toFixed(2)}
                </span>
              </div>
              {productExtrasTotal > 0 && (
                /* Extras = the add-ons picked on the PRODUCTS (glitter, note,
                   butterflies, crown, ribbon, vase, letters…). Shipping
                   Protection is NOT here — it has its own line below. */
                <div className="flex items-center justify-between -mt-1">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("floatingCart.extras")}
                  </span>
                  <span className="font-body text-sm font-semibold text-foreground">
                    ${productExtrasTotal.toFixed(2)}
                  </span>
                </div>
              )}
              {showDeliveryLine && (
                /* Home Delivery only — Store Pickup shows no Delivery row.
                   The amount is the REAL stored cost (never invented):
                   local per-mile / FedEx rate; $0 is only legit for room
                   decor's free ≤10 mi radius, anything else unresolved
                   (e.g. FedEx pending) says "calculated at checkout". */
                <div className="flex items-center justify-between -mt-1">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("floatingCart.delivery")}
                  </span>
                  <span className="font-body text-sm font-semibold text-foreground">
                    {deliveryCost > 0
                      ? `$${deliveryCost.toFixed(2)}`
                      : isRoomDecorDelivery
                        ? t("floatingCart.deliveryFree")
                        : t("floatingCart.deliveryAtCheckout")}
                  </span>
                </div>
              )}
              {protectionDisplayTotal > 0 && (
                /* Shipping Protection: OWN line (never inside "Extras") with
                   the REAL price from lib/shippingProtection.ts — the same
                   variant performApiCheckout sends to Shopify (qty 1). */
                <div className="flex items-center justify-between -mt-1">
                  <span className="font-body text-sm text-muted-foreground">
                    {t("shippingProtection.label")}
                  </span>
                  <span className="font-body text-sm font-semibold text-foreground">
                    ${protectionDisplayTotal.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="font-body text-sm font-semibold text-foreground">
                  {t("floatingCart.total")}
                </span>
                <span className="font-display text-xl font-bold text-foreground">
                  ${displayTotal.toFixed(2)}
                </span>
              </div>
            </div>
            {/* Fees/taxes disclaimer — service fee (4.5%) + estimated taxes are
                added on the Shopify checkout, not in this local breakdown. */}
            <p className="font-body text-[11px] leading-snug text-muted-foreground text-center -mt-1">
              {language === "es"
                ? "La tarifa de servicio y los impuestos se calculan en el pago."
                : "Service fee and taxes are calculated at checkout."}
            </p>
            {/* Shipping Protection eliminado (Amorelia no lo tiene). */}
            {fedexBlockingItem && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-xs font-body text-foreground">
                {fedexNeedsMultiBouquet ? (
                  <span>{t("fedex.multiBouquetBlock")}</span>
                ) : (
                  <span>
                    La dirección está fuera del rango local (&gt;90 millas). Vuelve a
                    la página del producto y selecciona una opción de envío{" "}
                    <strong>FedEx</strong> antes de continuar al checkout.
                  </span>
                )}
              </div>
            )}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut || isLoading || !!fedexBlockingItem}
              className="flex items-center justify-center gap-2 w-full text-center bg-primary text-primary-foreground py-3 rounded-lg font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isCheckingOut && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("floatingCart.viewCart")}
            </button>
            {/* Social proof under the checkout button — REAL 5.0/3 Google
                rating (lib/reviewsData.ts), compact variant: no trust chips,
                no outbound link (nothing pulls the customer off checkout). */}
            <ProductRatingBar language={language} align="center" variant="compact" />
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
