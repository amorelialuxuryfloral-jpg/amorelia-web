"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { toast } from "sonner";
import { useCartStore } from "@/stores/cartStore";
import { performApiCheckout } from "@/lib/checkout";
import { buildAccessoryLineItems, BUTTERFLIES_VARIANT_ID } from "@/lib/accessoryVariants";
import type { DeliveryResult } from "@/components/DeliveryCalculator";
import type { FedExAttrs } from "@/components/FedExShippingOptions";
import { ArrowLeft } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import CheckoutOrderItem from "@/components/checkout/CheckoutOrderItem";
import CheckoutSummaryBlock from "@/components/checkout/CheckoutSummaryBlock";
import { getTranslator, type Language } from "@/i18n";
import { getPaperForCartItem } from "@/lib/paperHelper";
import { computeShippingProtection, getShippingProtectionFallback } from "@/lib/shippingProtection";

/**
 * /checkout page — SPA port 1:1 (framer-motion fade replaced by CSS).
 *
 * "Complete Order" builds the FULL Shopify cart in ONE performApiCheckout()
 * call: product + accessory + fee lines, the order NOTE with every
 * configurator detail, and the UTM/source attribution attributes
 * (SPEC §8.ter — Carlos keeps seeing note + origin on every order).
 */
const CheckoutClient = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const items = useCartStore((state) => state.items);
  const shippingProtectionEnabled = useCartStore((state) => state.shippingProtection);
  const removeItem = useCartStore((state) => state.removeItem);
  const isLoading = useCartStore((state) => state.isLoading);
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fedexAttrs, setFedexAttrs] = useState<FedExAttrs | null>(null);

  // Persisted cart renders after mount (server HTML ships the empty shell —
  // /checkout is noindex, no SEO content lives here).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const itemsSubtotal = parseFloat(items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0).toFixed(2));
  // Tiered by products+extras total (itemsSubtotal): ≤$180→$15, ≤$280→$25, else $35.
  const protectionTotal = shippingProtectionEnabled
    ? computeShippingProtection(getShippingProtectionFallback(), itemsSubtotal).amount
    : 0;

  // GA4: remove_from_cart wrapper around the store action.
  const handleRemoveItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'remove_from_cart', {
        currency: 'USD',
        value: parseFloat(item.price.toFixed(2)),
        items: [{
          item_id: item.shopifyVariantId || item.bouquetType,
          item_name: item.productName || item.bouquetType,
          price: parseFloat(item.price.toFixed(2)),
          quantity: 1,
        }],
      });
    }
    removeItem(id);
  };

  const existingDeliveryItem = items.find((i) => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");

  const [checkoutDeliveryMethod, setCheckoutDeliveryMethod] = useState<"pickup" | "delivery">(
    existingDeliveryItem ? "delivery" : "pickup",
  );

  const [deliveryResult, setDeliveryResult] = useState<DeliveryResult | null>(
    existingDeliveryItem && existingDeliveryItem.deliveryMiles !== null
      ? { miles: existingDeliveryItem.deliveryMiles, cost: existingDeliveryItem.deliveryCost, address: existingDeliveryItem.deliveryAddress }
      : null,
  );

  const itemWithDate = items.find((i) => i.deliveryDate);
  const itemWithHour = items.find((i) => i.deliveryHour);
  const [deliveryDate, setDeliveryDate] = useState(itemWithDate?.deliveryDate || "");
  const [deliveryHour, setDeliveryHour] = useState(itemWithHour?.deliveryHour || "");

  // Sync initial state from the persisted cart once it hydrates.
  useEffect(() => {
    if (!mounted) return;
    const deliveryItem = items.find((i) => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");
    if (deliveryItem) {
      setCheckoutDeliveryMethod("delivery");
      if (deliveryItem.deliveryMiles !== null) {
        setDeliveryResult((prev) => prev ?? { miles: deliveryItem.deliveryMiles!, cost: deliveryItem.deliveryCost, address: deliveryItem.deliveryAddress });
      }
    }
    const withDate = items.find((i) => i.deliveryDate);
    const withHour = items.find((i) => i.deliveryHour);
    if (withDate?.deliveryDate) setDeliveryDate((d) => d || withDate.deliveryDate);
    if (withHour?.deliveryHour) setDeliveryHour((h) => h || withHour.deliveryHour);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const needsAddress = checkoutDeliveryMethod === "delivery";
  const deliveryCost = needsAddress && deliveryResult ? deliveryResult.cost : 0;
  const canCheckout = !needsAddress || deliveryResult !== null;

  const handleCheckout = async () => {
    // GA4: begin_checkout event
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'begin_checkout', {
      currency: 'USD',
      value: itemsSubtotal,
    });
    // NOTE: InitiateCheckout is intentionally NOT fired here.
    // The checkout lives on Shopify and Meta Pixel + Conversions API there
    // already track InitiateCheckout/Purchase server-side.

    setIsCheckingOut(true);
    try {
      const noteLines: string[] = [];
      noteLines.push("DATOS DEL ENVÍO");
      noteLines.push(`- 🚚 Tipo: ${checkoutDeliveryMethod === "delivery" ? "Home Delivery" : "Store Pickup"}`);

      if (deliveryDate) {
        const dateObj = /^\d{4}-\d{2}-\d{2}$/.test(deliveryDate)
          ? new Date(deliveryDate + "T00:00:00")
          : new Date(deliveryDate);
        const formattedDate = !isNaN(dateObj.getTime())
          ? format(dateObj, "PPP", { locale: enUS })
          : deliveryDate;
        noteLines.push(`- 📅 Fecha: ${formattedDate}`);
      }
      if (deliveryHour) noteLines.push(`- ⏰ Hora: ${deliveryHour}`);
      if (checkoutDeliveryMethod === "delivery" && deliveryResult) {
        noteLines.push(`- 📍 Dirección: ${deliveryResult.address}`);
      }

      for (let idx = 0; idx < items.length; idx++) {
        const item = items[idx];
        noteLines.push("");
        noteLines.push(`DATOS DEL PRODUCTO ${idx + 1}`);
        if (item.isMothersDay) {
          noteLines.push(`- 🎀 Mother's Day Edition`);
        }
        noteLines.push(`- 🌹 Producto: ${item.productName || item.bouquetType}`);

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
        if (item.isMothersDay) {
          const crownChoice = item.crownSize ? item.crownSize.charAt(0).toUpperCase() + item.crownSize.slice(1) : "Silver";
          noteLines.push(`- 👑 Crown: ${crownChoice} (included)`);
          noteLines.push(`- 🦋 Butterflies: 1 Gold (included)`);
          noteLines.push(`- 🎀 Ribbon: ${item.ribbonText ? `"${item.ribbonText}"` : "(no text)"} (included)`);
          if (item.accessory === "note" && item.accessoryText) {
            noteLines.push(`- 💌 Card text: ${item.accessoryText}`);
          }
        } else {
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
        }
        if (item.specialText) noteLines.push(`- 🔤 Letters or numbers (Baby Breath): ${item.specialText}`);
        if (item.teddySize && item.teddyColor) noteLines.push(`- 🧸 Teddy Bear: ${item.teddySize} / ${item.teddyColor}`);
        if (item.balloonColor && item.balloonQty) noteLines.push(`- 🎈 Helium Balloons: ${item.balloonColor} ×${item.balloonQty}`);
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        if (vaseAddon) noteLines.push(`- 🏺 Vase: ${vaseAddon}`);
        if (item.customerNotes) {
          noteLines.push("");
          noteLines.push("NOTAS DEL CLIENTE");
          noteLines.push(`📝 Nota del cliente: ${item.customerNotes}`);
        }
      }

      const accessoryLineItems = items.flatMap((item) => {
        const vaseAddon = item.addons?.find(a => a.startsWith("Vase"));
        const vaseRosesMatch = vaseAddon?.match(/\((\d+)/);
        const hasButterflyAddon =
          item.addons?.some((a) => a.toLowerCase().includes("butterfl")) ?? false;
        // Scale accessories by the item's quantity (matches the cart drawer path).
        const qty = item.quantity || 1;
        // Mother's Day items have Crown + Butterflies + Ribbon BUNDLED into the
        // Shopify variant price — never double-charge them.
        if (item.isMothersDay) {
          return buildAccessoryLineItems({
            glitter: false,
            rosesCount: item.roses,
            accessory: item.accessory === "note" ? "note" : "none",
            specialText: "",
            addVase: false,
            addCrown: false,
            crownSize: "",
            addRibbon: false,
          }).map((l) => ({ ...l, quantity: l.quantity * qty }));
        }
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

      const cartTotalForFee = itemsSubtotal + protectionTotal + deliveryCost;

      const checkoutUrl = await performApiCheckout({
        deliveryMethod: checkoutDeliveryMethod,
        deliveryCost,
        serviceFeeBase: cartTotalForFee,
        deliveryAddress: checkoutDeliveryMethod === "delivery" ? (deliveryResult?.address || items[0]?.deliveryAddress) : undefined,
        deliveryZip: checkoutDeliveryMethod === "delivery" ? items[0]?.deliveryZip : undefined,
        structuredAddress: checkoutDeliveryMethod === "delivery"
          ? (deliveryResult?.structuredAddress || items.find((i) => i.structuredAddress)?.structuredAddress)
          : undefined,
        accessories: accessoryLineItems,
        note: noteLines.join("\n"),
        fedex: checkoutDeliveryMethod === "delivery" && fedexAttrs ? fedexAttrs : undefined,
      });

      if (!checkoutUrl) {
        toast.error("Could not get checkout URL. Please try again.");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error during checkout. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!mounted || items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-32 pb-16 text-center">
          <div className="max-w-md mx-auto px-6 animate-fade-up">
            <BrandLogo className="w-20 h-20 mx-auto mb-6" />
            <h2 className="font-display text-3xl font-semibold text-foreground mb-3">{t("checkout.emptyCart")}</h2>
            <p className="text-muted-foreground font-body mb-8">{t("checkout.addBouquet")}</p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("checkout.goBack")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-gold font-body text-sm tracking-[0.3em] uppercase mb-2">{t("checkout.checkout")}</p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground">{t("checkout.yourCart")}</h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-card border-2 border-primary/30 rounded-lg">
              <div className="p-6 space-y-6">
                {items.map((item, idx) => (
                  <CheckoutOrderItem key={item.id} item={item} index={idx} onRemove={handleRemoveItem} language={language} />
                ))}
              </div>

              <div className="border-t border-border" />

              <CheckoutSummaryBlock
                itemCount={items.length}
                itemsSubtotal={itemsSubtotal}
                deliveryMethod={checkoutDeliveryMethod}
                setDeliveryMethod={setCheckoutDeliveryMethod}
                deliveryResult={deliveryResult}
                setDeliveryResult={setDeliveryResult}
                deliveryDate={deliveryDate}
                setDeliveryDate={setDeliveryDate}
                deliveryHour={deliveryHour}
                setDeliveryHour={setDeliveryHour}
                canCheckout={canCheckout}
                isLoading={isLoading}
                isSyncing={false}
                isCheckingOut={isCheckingOut}
                onCheckout={handleCheckout}
                fedexBouquetRoses={items.length === 1 ? items[0]?.roses : 0}
                onFedexAttrs={setFedexAttrs}
                language={language}
              />
            </div>

            <div className="text-center pt-4">
              <Link
                href="/bouquets"
                className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("checkout.continueShopping")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
