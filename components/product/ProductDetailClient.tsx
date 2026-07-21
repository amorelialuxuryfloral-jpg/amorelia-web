"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { format, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { findVariantByRoses, buildShopifySizeOptions, type ShopifyHandleVariant } from "@/lib/shopifyVariants";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { trackMetaEvent } from "@/lib/metaPixel";
import { toast } from "sonner";
import PaymentIcons from "@/components/PaymentIcons";
import ProductTrustBlock from "@/components/ProductTrustBlock";
import ProductRatingBar from "@/components/product/ProductRatingBar";
import ProductReviewsSection from "@/components/product/ProductReviewsSection";
import ProductInfoAccordion from "@/components/product/ProductInfoAccordion";
import ProductGuaranteeBadges from "@/components/product/ProductGuaranteeBadges";
import StorePickupAlert from "@/components/StorePickupAlert";
import CalendarLite from "@/components/ui/CalendarLite";
import PopoverLite from "@/components/ui/PopoverLite";
import FedExShippingOptions, { type FedExAttrs } from "@/components/FedExShippingOptions";
import { bouquetSizeOptions, type BouquetProduct } from "@/lib/catalogData";
import { colorCollectionForProduct } from "@/lib/colorCollections";
import { galleryImageAlt } from "@/lib/thumbnailAlts";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";
import { vaseOptions, getPrice, crownPrice, ribbonPrice } from "@/lib/productData";
import {
  TEDDY_SIZES,
  TEDDY_COLORS,
  BALLOON_COLORS,
  BALLOON_UNIT_PRICE,
  BABY_BREATH_MAX_CHARS,
  BABY_BREATH_PRICE_PER_CHAR,
  babyBreathCharCount,
} from "@/lib/accessoryVariants";
import { getAccessoryImages, type AccessoryImages } from "@/lib/accessoryImages";
import { getTranslator, type Language } from "@/i18n";
import {
  Check, Store, Truck, CalendarIcon, Clock, MapPin, Search, Loader2,
} from "lucide-react";

const glitterRoseImg = "/assets/glitter-rose.webp";
const butterflyImg = "/assets/butterfly-gold.webp";
const noteImg = "/assets/accessory-note.webp";

/**
 * Product configurator — client part of the PDP, ported 1:1 from the SPA's
 * BouquetProductDetail (standard products; the seasonal Mother's Day virtual
 * catalog ships with the occasions phase).
 *
 * Everything the server already fetched (variants, images, description)
 * arrives as props: the first paint is full server HTML (real price, no
 * loading flash) and there are NO client refetches for the same data.
 */

interface Props {
  product: BouquetProduct;
  /** Live Shopify variants (server-fetched). */
  initialVariants: ShopifyHandleVariant[];
  /** Live Shopify images (server-fetched; falls back to catalog images). */
  initialImages: string[];
  /** Resolved description (Shopify native → catalog fallback, done server-side). */
  resolvedDescription: string;
  /** Keyword-first H1 (computed server-side, same for schema + title). */
  headingH1: string;
  /** EN keyword for image alts (e.g. "White Roses Bouquet"). */
  productKeywordEn: string;
  language?: Language;
}

const ProductDetailClient = ({
  product,
  initialVariants,
  initialImages,
  resolvedDescription,
  headingH1,
  productKeywordEn,
  language = "en",
}: Props) => {
  const { t } = getTranslator(language);
  const addItem = useCartStore(state => state.addItem);
  const setCartOpen = useCartStore(state => state.setOpen);
  const cartItems = useCartStore(state => state.items);

  // Purchase blocking: during the Mother's Day promo window standard products
  // are not purchasable (same rule as the SPA).
  const promoActive = isMothersDayPromoActive();
  const purchaseBlocked = promoActive;

  const primaryImage = initialImages[0] || product.image;
  const secondaryImage = initialImages[1] || product.image2;
  const allImages: string[] = initialImages.length > 0
    ? initialImages
    : ([primaryImage, secondaryImage].filter(Boolean) as string[]);

  // Desktop gallery: top image is swappable via thumbnails; bottom image is fixed.
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  // La foto principal cambia SOLO al hacer clic en una miniatura (no al pasar
  // el cursor) — decisión de Amorelia. Por eso no hay estado de hover.
  const displayedIdx = activeImageIdx;
  const desktopMainImage = allImages[displayedIdx] || primaryImage;
  const bottomIdx = allImages.length >= 6 ? 5 : allImages.length - 1;
  const desktopBottomImage = allImages[bottomIdx] || secondaryImage;
  const desktopThumbs: Array<{ url: string; idx: number }> = allImages
    .map((url, idx) => ({ url, idx }))
    .filter(({ url }) => url && url !== desktopBottomImage);

  // GA4: view_item event + Meta ViewContent (CAPI-deduped)
  useEffect(() => {
    const firstPrice = product.customSizes?.[0]?.price ?? getPrice(product.pricingTier, product.pricingTier === 'mix3red' ? 75 : 50);
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'view_item', {
      currency: 'USD',
      value: firstPrice,
      items: [{ item_id: product.shopifyHandle, item_name: product.name }],
    });
    trackMetaEvent('ViewContent', {
      content_ids: [product.shopifyHandle],
      content_name: product.name,
      content_type: 'product',
      value: firstPrice,
      currency: 'USD',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.shopifyHandle]);

  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [addNote, setAddNote] = useState(false);
  const [addButterfly, setAddButterfly] = useState(false);
  const [addTeddy, setAddTeddy] = useState(false);
  const [teddySizeKey, setTeddySizeKey] = useState<"small" | "medium" | "large">("medium");
  const [teddyColor, setTeddyColor] = useState<string>("Brown");
  const [addBalloons, setAddBalloons] = useState(false);
  const [balloonColor, setBalloonColor] = useState<string>("Red");
  const [balloonQty, setBalloonQty] = useState(1);
  const [addLetters, setAddLetters] = useState(false);
  const [lettersText, setLettersText] = useState("");

  // Fotos de los accesorios servidas por Shopify (null hasta que cargan;
  // la UI cae al icono si un producto no tiene foto).
  const [accImages, setAccImages] = useState<AccessoryImages | null>(null);
  useEffect(() => {
    let alive = true;
    getAccessoryImages().then((imgs) => { if (alive) setAccImages(imgs); });
    return () => { alive = false; };
  }, []);
  const [accessoryText, setAccessoryText] = useState("");
  const [addGlitter, setAddGlitter] = useState<boolean | null>(null); // null = not yet selected
  const [addVase] = useState(false);
  const [selectedVaseIdx] = useState(0);
  const [paperColor] = useState("Blanco");
  const [isAdding, setIsAdding] = useState(false);
  const [customerNotes, setCustomerNotes] = useState("");

  const productVariants = initialVariants;
  const variantsLoading = false;

  // Delivery state — auto-fill from existing cart items
  const existingDeliveryItem = cartItems.find(i => i.deliveryMethod === "delivery" && i.deliveryAddress && i.deliveryAddress !== "Store pickup");
  const hasExistingDelivery = !!existingDeliveryItem;

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">(hasExistingDelivery ? "delivery" : "pickup");
  const [desktopCalendarOpen, setDesktopCalendarOpen] = useState(false);
  const [mobileCalendarOpen, setMobileCalendarOpen] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(() => {
    const existing = cartItems.find(i => i.deliveryDate);
    if (existing?.deliveryDate) {
      const d = new Date(existing.deliveryDate + "T00:00:00");
      return !isNaN(d.getTime()) ? d : undefined;
    }
    return undefined;
  });
  const [deliveryHour, setDeliveryHour] = useState(() => cartItems.find(i => i.deliveryHour)?.deliveryHour || "");
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(existingDeliveryItem?.deliveryMiles ?? null);
  const [deliveryZip, setDeliveryZip] = useState(existingDeliveryItem?.deliveryZip || "");
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [distanceTooFar, setDistanceTooFar] = useState(false);
  const [addressQuery, setAddressQuery] = useState(existingDeliveryItem?.deliveryAddress || "");
  const [predictions, setPredictions] = useState<Array<{ placeId: string; description: string; mainText: string; secondaryText: string }>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(existingDeliveryItem?.deliveryAddress || "");
  const [mapUrl, setMapUrl] = useState("");
  const [mapImageUrl, setMapImageUrl] = useState("");
  const [structuredAddress, setStructuredAddress] = useState<{ address1: string; city: string; province: string; zip: string; country: string } | undefined>(existingDeliveryItem?.structuredAddress);
  // FedEx national shipping (>87 mi). fedexCost overrides the local delivery cost.
  const [fedexAttrs, setFedexAttrs] = useState<FedExAttrs | null>(
    existingDeliveryItem?.fedexServiceCode
      ? {
          serviceCode: existingDeliveryItem.fedexServiceCode,
          rosesCount: existingDeliveryItem.fedexRosesCount ?? 0,
          recipientAddress: existingDeliveryItem.fedexRecipientAddress ?? "",
        }
      : null,
  );
  const [fedexCost, setFedexCost] = useState<number>(
    existingDeliveryItem?.fedexServiceCode && existingDeliveryItem?.deliveryCost
      ? existingDeliveryItem.deliveryCost
      : 0,
  );
  const autocompleteDesktopRef = useRef<HTMLDivElement>(null);
  const autocompleteMobileRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sticky bar visibility — show when main "Order Now" button leaves viewport
  const [showStickyBar, setShowStickyBar] = useState(false);
  const orderButtonsDesktopRef = useRef<HTMLButtonElement>(null);
  const orderButtonsMobileRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const desktopEl = orderButtonsDesktopRef.current;
    const mobileEl = orderButtonsMobileRef.current;
    const targets = [desktopEl, mobileEl].filter(Boolean) as HTMLElement[];
    if (targets.length === 0) return;
    const visibility = new WeakMap<Element, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting));
        const anyVisible = targets.some((el) => visibility.get(el));
        setShowStickyBar(!anyVisible);
      },
      { threshold: 0, rootMargin: "0px 0px -10px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.shopifyHandle]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = autocompleteDesktopRef.current?.contains(target);
      const insideMobile = autocompleteMobileRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) setShowPredictions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) { setPredictions([]); return; }
    setAutocompleteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("places-autocomplete", { body: { input } });
      if (!error && data?.predictions) { setPredictions(data.predictions); setShowPredictions(true); }
    } catch (e) { console.error("Predictions error:", e); } finally { setAutocompleteLoading(false); }
  }, []);

  const handleAddressInput = useCallback((value: string) => {
    setAddressQuery(value); setSelectedAddress(""); setDeliveryMiles(null); setMapUrl(""); setMapImageUrl(""); setDistanceError("");
    setDistanceTooFar(false);
    setFedexAttrs(null); setFedexCost(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 350);
  }, [fetchPredictions]);

  const handleSelectPrediction = useCallback((prediction: { placeId: string; description: string; mainText: string; secondaryText: string }) => {
    setAddressQuery(prediction.description); setSelectedAddress(prediction.description); setShowPredictions(false); setPredictions([]);
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    if (zipMatch) setDeliveryZip(zipMatch[1]);
    setStructuredAddress(undefined);
    setFedexAttrs(null); setFedexCost(0);
    (async () => {
      setDistanceLoading(true); setDistanceError(""); setDistanceTooFar(false); setDeliveryMiles(null);
      try {
        const { data, error } = await supabase.functions.invoke("calculate-distance", { body: { fullAddress: prediction.description, placeId: prediction.placeId } });
        if (error) throw new Error("Error de conexión");
        if (data.error) {
          if (data.tooFar) {
            // >87 mi → switch to FedEx national shipping flow (no red error).
            setDistanceTooFar(true);
            setDeliveryMiles(data.miles);
            if (data.structuredAddress) setStructuredAddress(data.structuredAddress);
            setMapUrl("");
            if (data.mapImageUrl) setMapImageUrl(data.mapImageUrl);
          } else {
            setDistanceError(data.error);
          }
        }
        else {
          setDeliveryMiles(data.miles); setDeliveryDuration(data.duration);
          if (data.mapUrl) setMapUrl(data.mapUrl);
          setMapImageUrl("");
          if (data.structuredAddress) setStructuredAddress(data.structuredAddress);
        }
      } catch (e) { setDistanceError((e as Error).message || "Error calculating distance"); }
      finally { setDistanceLoading(false); }
    })();
  }, []);

  const minLeadHours = deliveryMethod === "delivery" ? 1.5 : 2;
  const minMiamiHour = miamiHourNow() + minLeadHours;
  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const day = date.getDay();
    if (day === 0) return []; // Sunday closed
    const closeHour = day === 6 ? 17 : 19;
    const hours: string[] = [];
    if (deliveryMethod === "pickup") {
      if (!isTodayInMiami(date) || 9.5 >= minMiamiHour) {
        hours.push("9:30 AM");
      }
    }
    for (let h = 10; h <= closeHour; h++) {
      if (isTodayInMiami(date) && h < minMiamiHour) continue;
      const ampm = h < 12 ? "AM" : "PM";
      const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
      hours.push(`${h12}:00 ${ampm}`);
    }
    return hours;
  };
  const availableHours = getAvailableHours(deliveryDate);

  const shopifySizes = productVariants.length > 0 ? buildShopifySizeOptions(productVariants) : [];

  // Default selection: 200 Roses (maximize conversion). Falls back to last available size.
  const hasCustomSizes = !!(product.customSizes && product.customSizes.length > 0);
  const useDynamicSizes = shopifySizes.length > 0;
  const sizeOptions = useDynamicSizes ? shopifySizes : (hasCustomSizes ? product.customSizes! : bouquetSizeOptions);
  const defaultAppliedRef = useRef(false);
  useEffect(() => {
    if (defaultAppliedRef.current) return;
    defaultAppliedRef.current = true;
    if (!sizeOptions.length) return;
    const idx200 = sizeOptions.findIndex((o: { roses: number }) => o.roses === 200);
    setSelectedSizeIdx(idx200 >= 0 ? idx200 : sizeOptions.length - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Same-color indexable collection cross-link (single-color products only).
  const sameColorCollection = colorCollectionForProduct(product);
  const colorCollectionTo = sameColorCollection
    ? (language === "es"
        ? `/es/bouquets/${sameColorCollection.slugEs}`
        : `/bouquets/${sameColorCollection.slug}`)
    : undefined;
  const colorCollectionAnchor = sameColorCollection
    ? t(`nav.${sameColorCollection.color}Roses`)
    : "";

  // Range-benefit subtitle under the H1 (fórmula de Romuald: the "50 to 200
  // roses" range is OUT of the H1 and becomes a benefit line). Computed from
  // the REAL size options of THIS ficha (Shopify variants → catalog fallback),
  // so e.g. the sunflowers ficha honestly says 50 to 150.
  const rangeRoses = sizeOptions.map((o: { roses: number }) => o.roses).filter((n: number) => n > 0);
  const rangeMinRoses = rangeRoses.length > 0 ? Math.min(...rangeRoses) : 0;
  const rangeMaxRoses = rangeRoses.length > 0 ? Math.max(...rangeRoses) : 0;
  const rangeSubtitle =
    rangeMinRoses > 0 && rangeMaxRoses > rangeMinRoses
      ? language === "es"
        ? `Elige de ${rangeMinRoses} a ${rangeMaxRoses} rosas`
        : `Choose from ${rangeMinRoses} to ${rangeMaxRoses} roses`
      : null;

  const colorCount = product.color.split(/,\s*|\s+y\s+/).length;
  const minSizeIdx = useDynamicSizes ? 0 : (hasCustomSizes ? 0 : (colorCount >= 3 ? 1 : 0));

  const effectiveSizeIdx = selectedSizeIdx < minSizeIdx ? minSizeIdx : (selectedSizeIdx >= sizeOptions.length ? sizeOptions.length - 1 : selectedSizeIdx);
  const selectedSize = { roses: sizeOptions[effectiveSizeIdx]?.roses ?? bouquetSizeOptions[0].roses };
  const sizePrice = useDynamicSizes
    ? (shopifySizes[effectiveSizeIdx]?.price ?? 0)
    : (hasCustomSizes ? (product.customSizes![effectiveSizeIdx]?.price || 0) : getPrice(product.pricingTier, selectedSize.roses));
  const glitterCost = addGlitter === true ? Math.ceil(selectedSize.roses / 25) * 8 : 0;
  const vaseCost = addVase ? vaseOptions[selectedVaseIdx].price : 0;
  const selectedTeddySize = TEDDY_SIZES.find((s) => s.key === teddySizeKey) ?? TEDDY_SIZES[1];
  const teddyCost = addTeddy ? selectedTeddySize.price : 0;
  const balloonCost = addBalloons ? Math.round(BALLOON_UNIT_PRICE * balloonQty * 100) / 100 : 0;
  const lettersCount = addLetters ? babyBreathCharCount(lettersText) : 0;
  const lettersCost = lettersCount * BABY_BREATH_PRICE_PER_CHAR;
  const accessoryCost = (addNote ? 3 : 0) + (addButterfly ? 3 : 0) + teddyCost + balloonCost + lettersCost;
  const deliveryCost =
    deliveryMethod === "delivery"
      ? distanceTooFar
        ? fedexCost // FedEx national shipping (>87 mi)
        : deliveryMiles
          ? calculateDeliveryCost(deliveryMiles)
          : 0
      : 0;
  const basePrice = sizePrice + glitterCost + vaseCost + accessoryCost;
  const totalPrice = basePrice + deliveryCost;

  // Replace "From $X" / "Desde $X" in description with dynamic Shopify price
  const dynamicMinPrice = useDynamicSizes && shopifySizes.length > 0 ? shopifySizes[0].price : null;
  const replaceDescriptionPrice = (text: string): string => {
    if (dynamicMinPrice === null) return text;
    return text
      .replace(/From \$\d+(\.\d+)?/i, () => `From $${dynamicMinPrice}`)
      .replace(/Desde \$\d+(\.\d+)?/i, () => `Desde $${dynamicMinPrice}`);
  };

  let step = 1;

  const handleAddToCart = async (): Promise<string | null> => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return null; }
    if (deliveryMethod === "delivery" && deliveryMiles === null) { toast.error("The address is invalid or out of range."); return null; }
    if (deliveryMethod === "delivery" && distanceTooFar && !fedexAttrs) {
      toast.error("Selecciona una opción de envío FedEx para continuar.");
      return null;
    }
    if (!deliveryDate) { toast.error("Please select a date and time."); return null; }
    if (!(deliveryMethod === "delivery" && distanceTooFar) && !deliveryHour) {
      toast.error("Please select a date and time."); return null;
    }

    setIsAdding(true);
    try {
      let variant = findVariantByRoses(productVariants, selectedSize.roses);
      if (!variant && productVariants.length > 0) {
        const rosesStr = String(selectedSize.roses);
        variant = productVariants.find(v => v.selectedOptions.some(opt => opt.value === rosesStr)) || productVariants.find(v => v.title.includes(rosesStr)) || productVariants[0];
      }
      if (!variant) { toast.error("Could not resolve product variant."); return null; }

      const addons: string[] = [];
      if (addGlitter === true) addons.push("Glitter");
      if (addVase) addons.push(`Vase (${vaseOptions[selectedVaseIdx].label})`);
      if (addButterfly) addons.push("Butterflies");
      if (addTeddy) addons.push(`Teddy Bear (${selectedTeddySize.label}, ${teddyColor})`);
      if (addBalloons) addons.push(`Balloons (${balloonColor} ×${balloonQty})`);
      if (addLetters && lettersCount > 0) addons.push(`Baby Breath Letters (${lettersText.trim()})`);

      // GA4: add_to_cart event
      (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'add_to_cart', {
        currency: 'USD',
        value: basePrice,
        items: [{ item_id: product.shopifyHandle, item_name: product.name, quantity: 1 }],
      });
      trackMetaEvent('AddToCart', {
        content_ids: [product.shopifyHandle],
        content_name: product.name,
        value: basePrice,
        currency: 'USD',
      });

      const addPromise = addItem({
        id: "",
        productName: product.name,
        bouquetType: product.type === "heart" ? "heart" : "classic",
        color: product.color,
        roses: selectedSize.roses,
        price: basePrice,
        // Display split for the cart drawer: base = the size/variant price
        // alone; glitter/vase/note/butterflies land in the "Extras" line.
        basePrice: sizePrice,
        deliveryCost,
        totalPrice,
        addons,
        accessory: addNote ? "note" : "none",
        accessoryText: addNote ? accessoryText : "",
        ribbonText: "",
        crownSize: "",
        teddySize: addTeddy ? teddySizeKey : undefined,
        teddyColor: addTeddy ? teddyColor : undefined,
        balloonColor: addBalloons ? balloonColor : undefined,
        balloonQty: addBalloons ? balloonQty : undefined,
        specialText: addLetters && lettersCount > 0 ? lettersText.trim() : "",
        heartColor: product.type === "heart" ? (product.color === "Rosa" ? "pink" : "red") : "",
        glitter: addGlitter === true,
        deliveryMethod,
        deliveryName: "",
        deliveryPhone: "",
        deliveryEmail: "",
        deliveryAddress: deliveryMethod === "delivery" ? selectedAddress : "Store pickup",
        deliveryZip: deliveryMethod === "delivery" ? deliveryZip : "",
        deliveryDate: deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : "",
        deliveryHour,
        deliveryMiles: deliveryMethod === "delivery" ? deliveryMiles : null,
        paperColor,
        image: primaryImage,
        customerNotes: customerNotes.trim() || undefined,
        isMothersDay: false,
        structuredAddress: deliveryMethod === "delivery" ? structuredAddress : undefined,
        shopifyVariantId: variant.id,
        shopifyHandle: product.shopifyHandle,
        // FedEx national shipping fields (only when >87 mi + user picked a service)
        fedexServiceCode: deliveryMethod === "delivery" && fedexAttrs ? fedexAttrs.serviceCode : undefined,
        fedexRosesCount: deliveryMethod === "delivery" && fedexAttrs ? fedexAttrs.rosesCount : undefined,
        fedexRecipientAddress: deliveryMethod === "delivery" && fedexAttrs ? fedexAttrs.recipientAddress : undefined,
      });

      const timeout = new Promise<void>((resolve) => setTimeout(resolve, 10000));
      await Promise.race([addPromise, timeout]);

      toast.success("Bouquet added to cart!");
      return variant.id;
    } catch {
      toast.error("Failed to add to cart.");
      return null;
    } finally {
      setIsAdding(false);
    }
  };

  // Order Now: add to cart and open the side drawer (no redirect to checkout)
  const handleOrderNow = async () => {
    const variantId = await handleAddToCart();
    if (!variantId) return;
    setCartOpen(true);
  };

  // Shared rendering functions
  const renderGlitterSection = (isMobile = false) => (
    <Section title={t("product.glitterFinish")} step={step++} subtitle={`+$${Math.ceil(selectedSize.roses / 25) * 8}`}>
      <div className={`flex ${isMobile ? "flex-col" : ""} gap-3 mb-3`}>
        <div className={`${isMobile ? "w-20 h-20 mx-auto" : "w-14 h-14"} flex-shrink-0`}>
          <img src={glitterRoseImg} alt="Glitter finish rose" width={64} height={64} className="w-full h-full object-contain" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground font-body">{t("product.glitterDesc")} · {selectedSize.roses} roses = +${Math.ceil(selectedSize.roses / 25) * 8}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => setAddGlitter(true)}
          className={`flex-1 py-2.5 rounded-none border text-center transition-all font-body text-sm ${addGlitter === true ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          {t("product.yes")}
        </button>
        <button onClick={() => setAddGlitter(false)}
          className={`flex-1 py-2.5 rounded-none border text-center transition-all font-body text-sm ${addGlitter === false ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          {t("product.no")}
        </button>
      </div>
    </Section>
  );

  const colorTKey = (c: string) => `product.color${c.replace(/\s+/g, "")}`;
  const teddySwatch: Record<string, string> = {
    Black: "#26211e",
    Red: "#b3252b",
    Brown: "#6b4226",
    "Light Brown": "#c49a6c",
  };
  const balloonSwatch: Record<string, string> = {
    Red: "#d4262e",
    "Pastel Pink": "#f6b8cc",
    Iridescent: "linear-gradient(135deg,#e8d5f2,#c7ebf5,#fdf3d8,#f5d5e8)",
  };

  const renderAccessoriesSection = (isMobile = false) => (
    <Section title={t("product.accessories")} step={step++}>
      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setAddNote((v) => !v)}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addNote ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <img src={noteImg} alt="Note accessory" className="w-16 h-16 md:w-12 md:h-12 object-contain rounded-lg" /> {t("product.note")} <span className="text-[10px] text-secondary">$3</span>
        </button>
        <button onClick={() => setAddButterfly((v) => !v)}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addButterfly ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          <img src={butterflyImg} alt="Butterfly accessory" className="w-16 h-16 md:w-12 md:h-12 object-contain" /> {t("product.butterflies")} <span className="text-[10px] text-secondary">$3</span>
        </button>
        <button onClick={() => setAddTeddy((v) => !v)}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addTeddy ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          {(() => {
            const teddyImg = accImages?.teddy.byColor[teddyColor] || accImages?.teddy.featured;
            return teddyImg
              ? <img src={teddyImg} alt="Plush teddy bear accessory" loading="lazy" width={64} height={64} className="w-16 h-16 md:w-12 md:h-12 object-contain" />
              : <span className="w-16 h-16 md:w-12 md:h-12 flex items-center justify-center text-4xl md:text-3xl" aria-hidden>🧸</span>;
          })()}
          {t("product.teddyBear")} <span className="text-[10px] text-secondary">{t("product.teddyFromPrice")}</span>
        </button>
        <button onClick={() => setAddBalloons((v) => !v)}
          className={`flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addBalloons ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          {(() => {
            const balloonImg = accImages?.balloons.byColor[balloonColor] || accImages?.balloons.featured;
            return balloonImg
              ? <img src={balloonImg} alt="Helium balloons accessory" loading="lazy" width={64} height={64} className="w-16 h-16 md:w-12 md:h-12 object-contain" />
              : <span className="w-16 h-16 md:w-12 md:h-12 flex items-center justify-center text-4xl md:text-3xl" aria-hidden>🎈</span>;
          })()}
          {t("product.heliumBalloons")} <span className="text-[10px] text-secondary">{t("product.balloonUnitPrice")}</span>
        </button>
        <button onClick={() => setAddLetters((v) => !v)}
          className={`col-span-2 flex flex-col items-center gap-1 py-2 px-2 rounded-lg border-2 transition-all font-body text-sm ${addLetters ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
          {accImages?.letters.featured
            ? <img src={accImages.letters.featured} alt="Baby breath letters accessory" loading="lazy" width={64} height={64} className="w-16 h-16 md:w-12 md:h-12 object-contain" />
            : <span className="w-16 h-16 md:w-12 md:h-12 flex items-center justify-center text-3xl md:text-2xl font-display font-semibold tracking-widest" aria-hidden>A·1</span>}
          {t("product.babyBreathLetters")} <span className="text-[10px] text-secondary">{t("product.babyBreathUnitPrice")}</span>
        </button>
      </div>
      {addNote && (
        <textarea value={accessoryText} onChange={(e) => setAccessoryText(e.target.value)} placeholder={t("product.writeNote")}
          className="w-full mt-3 bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[80px] resize-none" maxLength={200} />
      )}
      {addTeddy && (
        <div className="mt-3 p-3 rounded-lg border border-border bg-card space-y-3">
          <div>
            <p className="font-body text-xs font-semibold text-muted-foreground mb-2">🧸 {t("product.teddyBear")} — {t("product.sizeLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {TEDDY_SIZES.map((size) => (
                <button key={size.key} onClick={() => setTeddySizeKey(size.key)}
                  className={`px-3 py-2 rounded-lg border-2 text-sm font-body transition-all ${teddySizeKey === size.key ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  <span className="font-medium">{t(`product.teddySize${size.label}`)}</span>
                  <span className="text-xs text-muted-foreground ml-1">· {size.heightIn}&quot; ({size.heightCm} cm)</span>
                  <span className="text-xs text-primary font-semibold ml-1">${size.price}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-body text-xs font-semibold text-muted-foreground mb-2">{t("product.colorLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {TEDDY_COLORS.map((color) => (
                <button key={color} onClick={() => setTeddyColor(color)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-sm font-body transition-all ${teddyColor === color ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {accImages?.teddy.byColor[color]
                    ? <img src={accImages.teddy.byColor[color]} alt={`${color} teddy bear`} loading="lazy" width={28} height={28} className="w-7 h-7 object-contain" />
                    : <span className="w-3.5 h-3.5 rounded-full border border-border inline-block" style={{ background: teddySwatch[color] }} aria-hidden />}
                  {t(colorTKey(color))}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {addLetters && (
        <div className="mt-3 p-3 rounded-lg border border-border bg-card space-y-2">
          <p className="font-body text-xs text-muted-foreground">{t("product.babyBreathDesc")}</p>
          <input
            type="text"
            value={lettersText}
            onChange={(e) => {
              const cleaned = e.target.value.toUpperCase().replace(/[^A-ZÀ-Ÿ0-9 ]/g, "");
              let out = "";
              let count = 0;
              for (const ch of cleaned) {
                if (ch !== " ") {
                  if (count >= BABY_BREATH_MAX_CHARS) break;
                  count++;
                }
                out += ch;
              }
              setLettersText(out);
            }}
            placeholder={t("product.babyBreathPlaceholder")}
            className="w-full bg-background border border-border rounded-lg px-3 py-2.5 font-body text-base tracking-[0.3em] uppercase text-foreground placeholder:tracking-normal placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex items-center justify-between">
            <p className="font-body text-xs text-muted-foreground">{lettersCount}/{BABY_BREATH_MAX_CHARS} {t("product.babyBreathCharacters")}</p>
            <p className="font-body text-sm font-semibold text-primary">${lettersCost}</p>
          </div>
        </div>
      )}
      {addBalloons && (
        <div className="mt-3 p-3 rounded-lg border border-border bg-card space-y-3">
          <div>
            <p className="font-body text-xs font-semibold text-muted-foreground mb-2">🎈 {t("product.heliumBalloons")} — {t("product.colorLabel")}</p>
            <div className="flex flex-wrap gap-2">
              {BALLOON_COLORS.map((color) => (
                <button key={color} onClick={() => setBalloonColor(color)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-sm font-body transition-all ${balloonColor === color ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>
                  {accImages?.balloons.byColor[color]
                    ? <img src={accImages.balloons.byColor[color]} alt={`${color} balloon`} loading="lazy" width={28} height={28} className="w-7 h-7 object-contain" />
                    : <span className="w-3.5 h-3.5 rounded-full border border-border inline-block" style={{ background: balloonSwatch[color] }} aria-hidden />}
                  {t(colorTKey(color))}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-xs font-semibold text-muted-foreground">{t("product.quantityLabel")}</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setBalloonQty((q) => Math.max(1, q - 1))} aria-label="Decrease balloons"
                className="w-8 h-8 rounded-lg border-2 border-border font-body text-base text-foreground hover:border-primary/30 transition-all">−</button>
              <span className="font-body text-sm font-semibold text-foreground w-6 text-center">{balloonQty}</span>
              <button onClick={() => setBalloonQty((q) => Math.min(20, q + 1))} aria-label="Increase balloons"
                className="w-8 h-8 rounded-lg border-2 border-border font-body text-base text-foreground hover:border-primary/30 transition-all">+</button>
              <span className="font-body text-sm font-semibold text-primary">${balloonCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </Section>
  );

  const renderShippingSection = (isMobile: boolean, autocompleteRef: React.RefObject<HTMLDivElement | null>) => {
    const calendarOpen = isMobile ? mobileCalendarOpen : desktopCalendarOpen;
    const setCalendarOpen = isMobile ? setMobileCalendarOpen : setDesktopCalendarOpen;

    const isDateDisabled = (date: Date): boolean => {
      const day = startOfDay(date);
      const today = startOfDay(todayInMiami());
      if (isBefore(day, today)) return true;
      const promoStart = new Date(2026, 4, 1);
      const promoEnd = new Date(2026, 4, 12);
      // Standard product pages: BLOCK the May 1–12 Mother's Day window
      return day >= promoStart && day <= promoEnd;
    };

    return (
    <Section title={t("product.shipping")} step={step++}>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={() => setDeliveryMethod("delivery")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-none border transition-all font-body text-sm ${deliveryMethod === "delivery" ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          <Truck className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{t("product.homeDelivery")}</span>
        </button>
        <button onClick={() => setDeliveryMethod("pickup")}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-none border transition-all font-body text-sm ${deliveryMethod === "pickup" ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
          <Store className="w-4 h-4 flex-shrink-0" />
          <span className="font-medium">{t("product.storePickup")}</span>
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-body font-semibold text-foreground block mb-2"><CalendarIcon className="w-4 h-4 inline mr-1" /> {t("product.date")}</label>
        <PopoverLite
          open={calendarOpen}
          onOpenChange={setCalendarOpen}
          trigger={
            <button
              type="button"
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all"
            >
              <CalendarIcon className="w-4 h-4 text-muted-foreground" />
              {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : t("product.selectDate")}
            </button>
          }
        >
          <CalendarLite
            selected={deliveryDate}
            onSelect={(d) => { setDeliveryDate(d); setDeliveryHour(""); setCalendarOpen(false); }}
            disabled={isDateDisabled}
          />
        </PopoverLite>
      </div>
      {deliveryDate && !(deliveryMethod === "delivery" && distanceTooFar) && (
        <div className="mb-4">
          <label className="text-sm font-body font-semibold text-foreground block mb-2"><Clock className="w-4 h-4 inline mr-1" /> {t("product.time")}</label>
          {availableHours.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableHours.map((hour) => (
                <button key={hour} onClick={() => setDeliveryHour(hour)}
                  className={`px-3 py-1.5 rounded-lg border-2 text-sm font-body transition-all ${deliveryHour === hour ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}>{hour}</button>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground font-body">No available hours. Select another day.</p>}
        </div>
      )}

      <div className="space-y-3 p-4 rounded-lg border border-border bg-card mb-4">
        {deliveryMethod === "pickup" ? (
          <p className="font-body text-sm text-muted-foreground">
            {t("product.pickupAt")} <span className="font-semibold text-foreground">7257 NW 12th St, Miami, FL 33126</span>
          </p>
        ) : (
          <>
            <p className="font-body font-semibold text-foreground text-sm">{t("product.deliveryAddress")}</p>
            <div ref={autocompleteRef} className="relative">
              <label className="text-xs text-muted-foreground font-body block mb-1"><MapPin className="w-3 h-3 inline mr-1" />{t("product.addressLabel")} <span className="text-destructive">*</span></label>
              <div className="relative">
                <input type="text" value={addressQuery} onChange={(e) => handleAddressInput(e.target.value)} onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                  placeholder={t("product.startTyping")}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {autocompleteLoading || distanceLoading ? <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" /> : <Search className="w-4 h-4 text-muted-foreground" />}
                </div>
              </div>
              {showPredictions && predictions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {predictions.map((p) => (
                    <button key={p.placeId} onClick={() => handleSelectPrediction(p)} className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border last:border-b-0">
                      <p className="font-body text-sm font-medium text-foreground">{p.mainText}</p>
                      <p className="font-body text-xs text-muted-foreground">{p.secondaryText}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedAddress && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <p className="font-body text-xs text-muted-foreground">{t("product.selectedAddress")}</p>
                <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
              </div>
            )}
            {distanceError && !distanceTooFar && (
              <p className="text-sm font-body text-destructive">{distanceError}</p>
            )}
            {deliveryMiles !== null && !distanceTooFar && (
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <p className="font-body text-sm text-foreground">{t("product.distance")} <span className="font-semibold">{deliveryMiles} {t("product.miles")}</span>{deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}</p>
                <p className="font-body text-sm text-primary font-semibold mt-1">{t("product.shippingCost")} {formatDeliveryCost(deliveryCost)}</p>
              </div>
            )}
            {distanceTooFar && deliveryMiles !== null && (
              <FedExShippingOptions
                fullAddress={selectedAddress}
                structuredAddress={structuredAddress ?? null}
                miles={deliveryMiles}
                roses={selectedSize.roses}
                deliveryDate={deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : ""}
                itemsCount={cartItems.filter((i) => i.bouquetType !== "addon").length + 1}
                onSelect={(r, attrs) => {
                  setFedexAttrs(attrs);
                  setFedexCost(r.cost);
                }}
                onClear={() => {
                  setFedexAttrs(null);
                  setFedexCost(0);
                }}
                language={language}
              />
            )}
            {mapImageUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={mapImageUrl} alt="Route map" className="w-full h-auto block" loading="lazy" />
              </div>
            )}
            {mapUrl && !mapImageUrl && (
              <div className="rounded-lg overflow-hidden border border-border">
                <img src={mapUrl} alt="Route" className="w-full h-auto block" loading="lazy" />
              </div>
            )}
          </>
        )}
      </div>

      <div>
        <label className="text-sm font-body font-semibold text-foreground block mb-2">{t("product.customerNotes")}</label>
        <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} placeholder={t("product.customerNotesPlaceholder")}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[60px] resize-none" maxLength={500} />
      </div>
    </Section>
  );
  };

  const renderSizeButtonsDesktop = () => (
    <Section title={t("product.numberOfRoses")} step={step++}>
      <div className="flex flex-wrap gap-2">
        {sizeOptions.map((size, idx) => {
          const disabled = idx < minSizeIdx;
          const price = useDynamicSizes ? (size as { price: number }).price : (hasCustomSizes ? (size as { price: number }).price : getPrice(product.pricingTier, size.roses));
          return (
            <button key={size.roses} onClick={() => !disabled && setSelectedSizeIdx(idx)} disabled={disabled}
              className={`px-4 py-2 rounded-none border text-center transition-all font-body text-sm ${disabled ? "opacity-40 cursor-not-allowed border-border" : effectiveSizeIdx === idx ? "border-primary bg-primary/15 text-foreground" : "border-primary/30 text-foreground hover:bg-primary/5"}`}>
              <span className="font-medium">{size.roses} {t("product.roses")}</span>
              <span className="text-xs text-muted-foreground ml-1">·</span>
              <span className="text-xs text-primary font-semibold ml-1">${price}</span>
            </button>
          );
        })}
      </div>
    </Section>
  );

  return (
    <>
      {/* ===== DESKTOP: two-column layout ===== */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] gap-10 lg:gap-16 max-w-7xl mx-auto">
        {/* Left column — sticky gallery (thumbnails + main + bottom big) */}
        <div className="sticky top-28 self-start space-y-3 min-w-0">
          <div className="flex gap-3 min-w-0">
            {/* Vertical thumbnails column */}
            {desktopThumbs.length > 0 && (
              <div className="flex flex-col gap-3 w-20 flex-none">
                {desktopThumbs.map(({ url, idx }) => (
                  <button
                    key={`${idx}-${url}`}
                    type="button"
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative overflow-hidden rounded-md bg-muted aspect-square border-2 transition-colors ${activeImageIdx === idx ? "border-primary" : "border-transparent hover:border-primary/40"}`}
                  >
                    {/* Punto 9: distinct transactional keyword per photo (no "thumbnail N"). */}
                    <img src={url} alt={galleryImageAlt(productKeywordEn, idx)} loading="lazy" width={120} height={120} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {/* Main (top) image — swappable via thumbnails */}
            <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square flex-1 min-w-0">
              {desktopMainImage ? (
                <img src={desktopMainImage} alt={`${productKeywordEn} Miami — same-day delivery, Amorelia Luxury Floral Gifts`} width={600} height={600} fetchPriority="high" decoding="async" className="w-full h-full object-contain" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="font-display text-6xl text-muted-foreground/20">🌹</span></div>
              )}
            </div>
          </div>
          {/* Bottom big image — always the last photo (or fallback to secondary). */}
          {desktopBottomImage && (
            <div className={`${desktopThumbs.length > 0 ? "ml-[5.75rem]" : ""}`}>
              <div className="relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                <img src={desktopBottomImage} alt={`${productKeywordEn} Miami — alternate view, Amorelia Luxury Floral Gifts`} loading="lazy" width={600} height={600} className="w-full h-full object-cover" />
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="min-w-0 space-y-6 lg:space-y-8">
          <div>
            {/* Rating + trust bar — between the gallery and the title (real
                5.0 / 3 Google business rating, validated claims only). */}
            <ProductRatingBar language={language} />
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight">{headingH1}</h1>
            {rangeSubtitle && (
              <p className="font-body text-sm lg:text-base text-muted-foreground mt-2">{rangeSubtitle}</p>
            )}
            <p className="font-display text-3xl lg:text-4xl font-semibold text-foreground mt-3 lg:mt-4">${parseFloat(sizePrice.toFixed(2))}</p>
            <p className="font-body italic text-sm lg:text-base text-muted-foreground mt-1">Subtotal ${parseFloat(totalPrice.toFixed(2))}</p>
            {/* The full description now lives in ProductInfoAccordion (first
                row, open by default, always in the served HTML). */}
            {colorCollectionTo && (
              <p className="font-body text-sm mt-3">
                {t("bouquetProducts.viewAllColorPrefix")}{" "}
                <Link href={colorCollectionTo} className="text-primary font-semibold hover:underline">
                  {colorCollectionAnchor}
                </Link>{" "}
                {t("bouquetProducts.viewAllColorSuffix")}.
              </p>
            )}
          </div>

          {/* Size */}
          {renderSizeButtonsDesktop()}

          {renderGlitterSection(false)}
          {renderAccessoriesSection(false)}
          {renderShippingSection(false, autocompleteDesktopRef)}

          {/* Desktop bottom bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="font-body text-[10px] lg:text-xs text-muted-foreground leading-tight flex-1 line-clamp-1">
                {product.name} · {selectedSize.roses} {t("product.roses")}
                {addGlitter === true && " · Glitter"}
                {addNote && ` · ${t("product.note")}`}
                {addButterfly && ` · ${t("product.butterflies")}`}
                {addTeddy && ` · 🧸 ${t(`product.teddySize${selectedTeddySize.label}`)}`}
                {addBalloons && ` · 🎈 ×${balloonQty}`}
                {addLetters && lettersCount > 0 && ` · 🔤 ${lettersText.trim()}`}
              </p>
              <p className="font-display text-lg lg:text-2xl font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
            </div>
            {deliveryMethod === "pickup" && <StorePickupAlert language={language} />}
            <button ref={orderButtonsDesktopRef} onClick={handleOrderNow} disabled={isAdding || variantsLoading}
              className="w-full bg-primary text-primary-foreground py-4 lg:py-5 font-body text-sm lg:text-base tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50"
              hidden={purchaseBlocked}>
              {isAdding ? "..." : t("product.orderAndPay")}
            </button>
            {purchaseBlocked && <PurchaseBlockedNotice />}
            <PaymentIcons size={22} className="pt-1" />
            <ProductTrustBlock language={language} />
          </div>

        </div>
      </div>

      {/* ===== MOBILE: stacked layout ===== */}
      <div className="lg:hidden max-w-4xl mx-auto space-y-8">
        {/* Mobile images — swipeable carousel with ALL product images */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-3 pb-2 -mx-6 px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {allImages.length === 0 ? (
            <div className="w-[88%] flex-none snap-start relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
              <span className="font-display text-6xl text-muted-foreground/20">🌹</span>
            </div>
          ) : (
            allImages.map((url, idx) => (
              <div key={`${idx}-${url}`} className="w-[88%] flex-none snap-start relative overflow-hidden rounded-lg bg-muted flex items-center justify-center aspect-square">
                <img
                  src={url}
                  alt={idx === 0 ? `${productKeywordEn} Miami — same-day delivery, Amorelia Luxury Floral Gifts` : galleryImageAlt(productKeywordEn, idx)}
                  loading={idx === 0 ? "eager" : "lazy"}
                  {...(idx === 0 ? { fetchPriority: "high" as const } : {})}
                  decoding="async"
                  width={600}
                  height={600}
                  className={`w-full h-full ${idx === 0 ? "object-contain" : "object-cover"} pointer-events-none`}
                />
              </div>
            ))
          )}
        </div>

        <div className="text-center">
          {/* Rating + trust bar — between the photos and the title (real
              5.0 / 3 Google business rating, validated claims only). */}
          <ProductRatingBar language={language} align="center" />
          {/* Mobile visual title — NOT a heading: the page's single <h1> (desktop
              column) already carries this exact text, and an H2 duplicating the
              H1 pollutes the heading hierarchy (SPEC §2.5). */}
          <p className="font-display text-2xl font-semibold text-foreground">{headingH1}</p>
          {rangeSubtitle && (
            <p className="font-body text-sm text-muted-foreground mt-1.5">{rangeSubtitle}</p>
          )}
        </div>

        {/* Size */}
        <Section title={t("product.numberOfRoses")} step={1}>
          <div className="grid grid-cols-2 gap-2">
            {sizeOptions.map((size, idx) => {
              const disabled = idx < minSizeIdx;
              const price = useDynamicSizes ? (size as { price: number }).price : (hasCustomSizes ? (size as { price: number }).price : getPrice(product.pricingTier, size.roses));
              return (
                <button key={size.roses} onClick={() => !disabled && setSelectedSizeIdx(idx)} disabled={disabled}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${disabled ? "opacity-40 cursor-not-allowed border-border" : effectiveSizeIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                  <p className="font-body text-foreground"><span className="font-display text-xl font-semibold">{size.roses}</span><span className="text-xs text-muted-foreground ml-1">{t("product.roses")}</span></p>
                  <p className="text-sm font-body font-semibold text-primary mt-1">${price}</p>
                </button>
              );
            })}
          </div>
        </Section>

        {(() => { step = 2; return null; })()}
        {renderGlitterSection(true)}
        {renderAccessoriesSection(true)}
        {renderShippingSection(true, autocompleteMobileRef)}

        {/* Mobile inline buttons after customer notes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
              {product.name} · {selectedSize.roses} {t("product.roses")}
              {addGlitter === true && " · Glitter"}
              {addNote && ` · ${t("product.note")}`}
              {addButterfly && ` · ${t("product.butterflies")}`}
              {addTeddy && ` · 🧸 ${t(`product.teddySize${selectedTeddySize.label}`)}`}
              {addBalloons && ` · 🎈 ×${balloonQty}`}
              {addLetters && lettersCount > 0 && ` · 🔤 ${lettersText.trim()}`}
            </p>
            <p className="font-display text-lg font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
          </div>
          {deliveryMethod === "pickup" && <StorePickupAlert language={language} />}
          <button ref={orderButtonsMobileRef} onClick={handleOrderNow} disabled={isAdding || variantsLoading}
            className="w-full bg-primary text-primary-foreground py-4 font-body text-sm tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50"
            hidden={purchaseBlocked}>
            {isAdding ? "..." : t("product.orderAndPay")}
          </button>
          {purchaseBlocked && <PurchaseBlockedNotice />}
          <PaymentIcons size={22} className="pt-1" />
          <ProductTrustBlock language={language} />
        </div>
      </div>

      {/* ===== Shared post-purchase-CTA blocks (mobile AND desktop) =====
          Order per SPEC: Google reviews → accordion (description first +
          the 6 product FAQs) → guarantee badges. All copy is in the served
          HTML (accordion rows stay in the DOM when collapsed). */}
      <ProductReviewsSection language={language} />
      <ProductInfoAccordion
        description={replaceDescriptionPrice(resolvedDescription)}
        language={language}
      />
      <ProductGuaranteeBadges language={language} />

      {/* Sticky Order Now bar — appears when the inline button leaves the viewport */}
      {showStickyBar && !purchaseBlocked && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs text-muted-foreground truncate">
                {product.name} · {selectedSize.roses} {t("product.roses")}
                {addGlitter === true && " · Glitter"}
              </p>
              <p className="font-display text-base font-bold text-foreground">${parseFloat(totalPrice.toFixed(2))}</p>
            </div>
            <button
              onClick={handleOrderNow}
              disabled={isAdding || variantsLoading}
              className="bg-primary text-primary-foreground px-6 py-3 font-body text-xs sm:text-sm tracking-[0.2em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50 whitespace-nowrap"
            >
              {isAdding ? "..." : t("product.orderAndPay")}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const Section = ({ title, step, subtitle, children }: { title: string; step: number; subtitle?: string; children: React.ReactNode }) => {
  void step;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {/* Configurator step labels ("Number of Roses", "Glitter Finish",
            "Accessories", "Shipping") are UI labels, NOT document headings —
            they must never be <h2>/role=heading (SPEC §0f, §2.5). Same style,
            plain <p>. */}
        <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-[0.2em]">{title}</p>
        {subtitle && <span className="bg-secondary text-secondary-foreground text-[10px] px-1.5 py-0.5 rounded-full font-body">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
};

const PurchaseBlockedNotice = () => (
  <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 space-y-2">
    <p className="font-body text-sm font-semibold text-foreground text-center">
      Available again on May 13, 2026
    </p>
    <p className="font-body text-xs text-muted-foreground text-center">
      During our Mother&apos;s Day Special Edition (May 1 – May 12), only the Mother&apos;s Day collection is available for purchase.
    </p>
    <Link
      href="/mothers-day"
      className="block text-center text-primary hover:underline font-body text-xs tracking-wider uppercase font-semibold pt-1"
    >
      Check out our Mother&apos;s Day Collection →
    </Link>
  </div>
);

export default ProductDetailClient;
