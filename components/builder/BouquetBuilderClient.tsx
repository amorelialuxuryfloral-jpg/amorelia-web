"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { format, isBefore, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { miamiHourNow, todayInMiami, isTodayInMiami } from "@/lib/miamiTime";
import { supabase } from "@/integrations/supabase/client";
import { getTranslator, type Language } from "@/i18n";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { calculateDeliveryCost, formatDeliveryCost } from "@/lib/deliveryPricing";
import { CUSTOM_BOUQUET_VARIANT_ID } from "@/lib/accessoryVariants";
import { resolveCustomBouquetVariantId, getCustomBouquetType } from "@/lib/customBouquetVariants";
import { storefrontApiRequest } from "@/lib/shopify";
import { trackMetaEvent } from "@/lib/metaPixel";
import { isMothersDayPromoActive } from "@/lib/mothersDayPromo";

import PaperColorPicker from "@/components/builder/PaperColorPicker";
import StorePickupAlert from "@/components/StorePickupAlert";
import ProductRatingBar from "@/components/product/ProductRatingBar";
import CalendarLite from "@/components/ui/CalendarLite";
import PopoverLite from "@/components/ui/PopoverLite";
import FedExShippingOptions, { type FedExAttrs } from "@/components/FedExShippingOptions";
import {
  colorOptions,
  sizeOptions,
  pricingTable,
  getFinishPrice,
  crownOptions,
  ribbonPresets,
  letterNumberExtraPrice,
  crownPrice,
  ribbonPrice,
  vaseOptions,
  type ColorOption,
} from "@/lib/productData";
import {
  Check, Truck, Store, CalendarIcon, Clock, MapPin, Search, Loader2, Eye,
} from "lucide-react";

/**
 * Custom bouquet builder — client part of /bouquets/personalizar, ported 1:1
 * from the SPA's BouquetBuilder page (design + logic). The page H1/intro and
 * the hero image are server-rendered by app/bouquets/personalizar/page.tsx;
 * this component renders the configurator sections (they become direct
 * children of the server page's `space-y-10` wrapper, same DOM as the SPA).
 *
 * The AI preview keeps the EXACT `generate-bouquet-preview` edge function
 * invocation (Gemini/LOVABLE_API_KEY swap is deferred).
 */

const glitterRoseImg = "/assets/glitter-rose.webp";
const crownSilverImg = "/assets/crown-silver.webp";
const crownGoldImg = "/assets/crown-gold.webp";
const butterflyImg = "/assets/butterfly-gold.webp";
const noteImg = "/assets/accessory-note.webp";
const lettersImg = "/assets/letters-babybreathe.webp";
const vase100Img = "/assets/vase-100.webp";
const ribbonImg = "/assets/ribbon.webp";

const BouquetBuilderClient = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const addItem = useCartStore(state => state.addItem);
  const cartItems = useCartStore(state => state.items);
  const [selectedColors, setSelectedColors] = useState<ColorOption[]>([]);
  const [selectedSizeIdx, setSelectedSizeIdx] = useState(0);
  const [addNote, setAddNote] = useState(false);
  const [addButterfly, setAddButterfly] = useState(false);
  const [accessoryText, setAccessoryText] = useState("");
  const [addCrown, setAddCrown] = useState(false);
  const [crownSize, setCrownSize] = useState("silver");
  const [addRibbon, setAddRibbon] = useState(false);
  const [ribbonType, setRibbonType] = useState<"names" | "congratulations">("names");
  const [ribbonText, setRibbonText] = useState("");
  const [lettersNumbersType] = useState<"letters" | "numbers">("letters");
  const [specialText, setSpecialText] = useState("");
  const [addVase, setAddVase] = useState(false);
  const [selectedVaseIdx, setSelectedVaseIdx] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [deliveryHour, setDeliveryHour] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [deliveryMiles, setDeliveryMiles] = useState<number | null>(null);
  const [deliveryStreet, setDeliveryStreet] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [deliveryZip, setDeliveryZip] = useState("");
  const [deliveryDuration, setDeliveryDuration] = useState("");
  const [distanceLoading, setDistanceLoading] = useState(false);
  const [distanceError, setDistanceError] = useState("");
  const [distanceTooFar, setDistanceTooFar] = useState(false);
  const [addressQuery, setAddressQuery] = useState("");
  const [predictions, setPredictions] = useState<Array<{ placeId: string; description: string; mainText: string; secondaryText: string }>>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [mapImageUrl, setMapImageUrl] = useState("");
  const [structuredAddress, setStructuredAddress] = useState<
    { address1: string; city: string; province: string; zip: string; country: string } | undefined
  >(undefined);
  // FedEx national shipping (>87 mi)
  const [fedexAttrs, setFedexAttrs] = useState<FedExAttrs | null>(null);
  const [fedexCost, setFedexCost] = useState<number>(0);
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [paperColor, setPaperColor] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");

  // Silence unused-var warnings for state that only feeds the cart note (SPA parity).
  void deliveryStreet; void deliveryCity; void lettersNumbersType;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setShowPredictions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(async (input: string) => {
    if (input.length < 3) {
      setPredictions([]);
      return;
    }
    setAutocompleteLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("places-autocomplete", {
        body: { input },
      });
      if (!error && data?.predictions) {
        setPredictions(data.predictions);
        setShowPredictions(true);
      }
    } catch {
      // silently fail
    } finally {
      setAutocompleteLoading(false);
    }
  }, []);

  const handleAddressInput = useCallback((value: string) => {
    setAddressQuery(value);
    setSelectedAddress("");
    setDeliveryMiles(null);
    setMapUrl("");
    setMapImageUrl("");
    setDistanceError("");
    setDistanceTooFar(false);
    setStructuredAddress(undefined);
    setFedexAttrs(null);
    setFedexCost(0);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPredictions(value), 350);
  }, [fetchPredictions]);

  const handleSelectPrediction = useCallback((prediction: { placeId: string; description: string; mainText: string; secondaryText: string }) => {
    setAddressQuery(prediction.description);
    setSelectedAddress(prediction.description);
    setShowPredictions(false);
    setPredictions([]);

    const parts = prediction.description.split(", ");
    const street = prediction.mainText || parts[0] || "";
    const city = parts[1] || "";
    const fullText = prediction.description + " " + (prediction.secondaryText || "");
    const zipMatch = fullText.match(/\b(\d{5})\b/);
    const zip = zipMatch ? zipMatch[1] : "";

    setDeliveryStreet(street);
    setDeliveryCity(city);
    if (zip) setDeliveryZip(zip);

    if (street && city) {
      (async () => {
        setDistanceLoading(true);
        setDistanceError("");
        setDistanceTooFar(false);
        setDeliveryMiles(null);
        setStructuredAddress(undefined);
        setFedexAttrs(null);
        setFedexCost(0);
        try {
          const { data, error } = await supabase.functions.invoke("calculate-distance", {
            body: { fullAddress: prediction.description, placeId: prediction.placeId },
          });
          if (error) throw new Error("Connection error");
          if (data.error) {
            if (data.tooFar) {
              // >87 mi → FedEx flow (no red error)
              setDistanceTooFar(true);
              setDeliveryMiles(data.miles);
              if (data.structuredAddress) setStructuredAddress(data.structuredAddress);
              setMapUrl("");
              if (data.mapImageUrl) setMapImageUrl(data.mapImageUrl);
            } else {
              setDistanceError(data.error);
            }
          } else {
            setDeliveryMiles(data.miles);
            setDeliveryDuration(data.duration);
            if (data.mapUrl) setMapUrl(data.mapUrl);
            setMapImageUrl("");
            if (data.structuredAddress) setStructuredAddress(data.structuredAddress);
          }
        } catch (e) {
          setDistanceError((e as Error).message || "Error calculating distance");
        } finally {
          setDistanceLoading(false);
        }
      })();
    }
  }, []);

  // ─── Shopify Storefront API: fetch all variants for "custom-bouquet" once ───
  interface ShopifyCustomVariant {
    id: string;
    price: { amount: string };
    selectedOptions: Array<{ name: string; value: string }>;
  }
  const [shopifyVariants, setShopifyVariants] = useState<ShopifyCustomVariant[]>([]);
  const [variantsLoading, setVariantsLoading] = useState(true);

  useEffect(() => {
    const QUERY = `
      query {
        productByHandle(handle: "custom-bouquet") {
          variants(first: 100) {
            edges {
              node {
                id
                price { amount }
                selectedOptions { name value }
              }
            }
          }
        }
      }
    `;
    (async () => {
      try {
        const data = await storefrontApiRequest(QUERY);
        const edges = data?.data?.productByHandle?.variants?.edges ?? [];
        setShopifyVariants(edges.map((e: { node: ShopifyCustomVariant }) => e.node));
      } catch (err) {
        console.error("Failed to load custom-bouquet variants:", err);
      } finally {
        setVariantsLoading(false);
      }
    })();
  }, []);

  // Find the matching Shopify variant based on Mix Type + Roses
  const matchedVariant = useMemo(() => {
    if (shopifyVariants.length === 0 || selectedColors.length === 0) return null;
    const mixType = getCustomBouquetType(selectedColors);
    const rosesStr = `${pricingTable[selectedSizeIdx].roses} Roses`;
    if (!mixType) return null;
    return shopifyVariants.find(v =>
      v.selectedOptions.some(o => o.name === "Mix Type" && o.value === mixType) &&
      v.selectedOptions.some(o => o.name === "Roses" && o.value === rosesStr)
    ) ?? null;
  }, [shopifyVariants, selectedColors, selectedSizeIdx]);

  const customBouquetVariantGid = matchedVariant?.id
    ?? `gid://shopify/ProductVariant/${resolveCustomBouquetVariantId(selectedColors, pricingTable[selectedSizeIdx].roses) || CUSTOM_BOUQUET_VARIANT_ID}`;

  const minRoses = selectedColors.length >= 3 ? 75 : 50;

  // Auto-bump size when 3 colors selected and current size is 50
  useEffect(() => {
    if (selectedColors.length >= 3 && pricingTable[selectedSizeIdx].roses < 75) {
      const idx75 = pricingTable.findIndex(s => s.roses >= 75);
      if (idx75 >= 0) setSelectedSizeIdx(idx75);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColors.length]);

  const lettersNumbersCost = specialText.length > 0 ? specialText.length * letterNumberExtraPrice : 0;

  // Price: use Shopify variant price when available, fall back to local table
  const basePrice = useMemo(() => {
    if (matchedVariant) return parseFloat(matchedVariant.price.amount);
    const roses = pricingTable[selectedSizeIdx].roses;
    return getFinishPrice(selectedColors, roses);
  }, [matchedVariant, selectedSizeIdx, selectedColors]);

  const deliveryCost =
    deliveryMethod === "delivery"
      ? distanceTooFar
        ? fedexCost
        : deliveryMiles
          ? calculateDeliveryCost(deliveryMiles)
          : 0
      : 0;

  const minLeadHours = deliveryMethod === "delivery" ? 1.5 : 2;
  const minMiamiHour = miamiHourNow() + minLeadHours;

  const getAvailableHours = (date: Date | undefined) => {
    if (!date) return [];
    const day = date.getDay();
    if (day === 0) return []; // Sunday closed
    const closeHour = day === 6 ? 17 : 19;
    const hours: string[] = [];
    // Generate half-hour start then full hours
    if (deliveryMethod === "pickup") {
      // 9:30 AM first
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

  const rosesCount = pricingTable[selectedSizeIdx].roses;

  const [addGlitter, setAddGlitter] = useState<boolean | null>(null);
  const glitterCost = addGlitter === true ? Math.ceil(rosesCount / 25) * 8 : 0;
  const vaseCost = addVase ? vaseOptions[selectedVaseIdx].price : 0;

  const crownCost = addCrown ? crownPrice : 0;
  // Only count the ribbon price when there IS ribbon text — the Shopify ribbon
  // line is gated on ribbonText too, so this keeps the shown total == charged.
  const ribbonCost = addRibbon && ribbonText.trim() ? ribbonPrice : 0;
  const accessoryCost = (addNote ? 3 : 0) + (addButterfly ? 3 : 0);

  const totalPrice = useMemo(() => {
    let total = basePrice + lettersNumbersCost;
    total += glitterCost;
    total += crownCost;
    total += ribbonCost;
    total += vaseCost;
    total += accessoryCost;
    total += deliveryCost;
    return total;
  }, [basePrice, lettersNumbersCost, glitterCost, crownCost, ribbonCost, vaseCost, accessoryCost, deliveryCost]);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState("");
  const [hasGeneratedPreview, setHasGeneratedPreview] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleGeneratePreview = useCallback(async () => {
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewUrl(null);
    try {
      const rosesCount = pricingTable[selectedSizeIdx].roses;
      const bouquetConfig: Record<string, string> = {
        bouquetType: "classic",
        color: selectedColors.map(c => c.name).join(", "),
        paperColor: paperColor,
        roses: String(rosesCount),
        glitter: String(addGlitter),
      };
      if (specialText) bouquetConfig.specialText = specialText;
      if (addCrown) { bouquetConfig.crown = "true"; bouquetConfig.crownSize = crownSize; }
      if (addRibbon && ribbonText) { bouquetConfig.ribbon = "true"; bouquetConfig.ribbonText = ribbonText; }

      const baseImageUrl = `https://urcocghysdjfawmfitzj.supabase.co/storage/v1/object/public/bouquet-previews/reference/ref-${rosesCount}.png`;

      const { data, error } = await supabase.functions.invoke("generate-bouquet-preview", {
        body: { bouquetConfig, baseImageUrl },
      });

      if (error) {
        const message = typeof error.message === "string" && error.message.trim().length > 0
          ? error.message
          : "Preview no disponible en este momento.";
        throw new Error(message);
      }
      if (data?.error) {
        const friendlyError = data?.statusCode === 429
          ? "Has hecho demasiados intentos seguidos. Espera unos segundos y vuelve a probar."
          : "Preview no disponible en este momento.";
        setPreviewError(friendlyError);
        setHasGeneratedPreview(false);
      } else if (data?.imageUrl) {
        setPreviewUrl(data.imageUrl);
        setHasGeneratedPreview(true);
      } else {
        setPreviewError("Preview no disponible en este momento.");
        setHasGeneratedPreview(false);
      }
    } catch (e) {
      setPreviewError((e as Error).message || "Error generating preview");
      setHasGeneratedPreview(false);
    } finally {
      setPreviewLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColors, selectedSizeIdx, paperColor, addGlitter, specialText, addCrown, crownSize, addRibbon, ribbonText]);

  const validateBuilder = () => {
    if (deliveryMethod === "delivery" && !selectedAddress) { toast.error("Please select a delivery address."); return false; }
    if (deliveryMethod === "delivery" && deliveryMiles === null) { toast.error("The address is invalid or out of range."); return false; }
    if (deliveryMethod === "delivery" && distanceTooFar && !fedexAttrs) {
      toast.error("Selecciona una opción de envío FedEx para continuar.");
      return false;
    }
    if (!deliveryDate) { toast.error("Please select a date and time."); return false; }
    if (!(deliveryMethod === "delivery" && distanceTooFar) && !deliveryHour) {
      toast.error("Please select a date and time."); return false;
    }
    if (variantsLoading) { toast.error("We are still loading product variants."); return false; }
    if (!matchedVariant && selectedColors.length > 0) {
      toast.error('This combination is not available. Please choose a different color combination.');
      return false;
    }
    if (!paperColor) { toast.error("Selecciona el color del papel"); return false; }
    return true;
  };

  const buildCartItem = () => {
    const addons: string[] = [];
    if (addCrown) addons.push(`Crown Tiara (${crownSize})`);
    if (addRibbon) addons.push("Ribbon");
    if (addGlitter) addons.push("Glitter");
    if (addVase) addons.push(`Vase (${vaseOptions[selectedVaseIdx].label})`);
    if (specialText) addons.push(`${lettersNumbersType === "letters" ? "Letters" : "Numbers"}: ${specialText}`);
    if (addButterfly) addons.push("Butterflies");
    return {
      id: "",
      productName: "Custom Bouquet",
      bouquetType: "custom" as const,
      color: selectedColors.map(c => c.nameEn).join(', '),
      roses: rosesCount,
      price: basePrice + lettersNumbersCost + crownCost + ribbonCost + glitterCost + vaseCost + accessoryCost,
      // Display split for the cart drawer: base = the bouquet variant price;
      // letters/crown/ribbon/glitter/vase/accessories land in "Extras".
      basePrice,
      deliveryCost,
      totalPrice,
      addons,
      accessory: addNote ? "note" : "none",
      accessoryText: addNote ? accessoryText : "",
      ribbonText,
      crownSize: addCrown ? crownSize : "",
      specialText,
      heartColor: "",
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
      // Cart thumbnail: the AI preview when the user generated one.
      image: previewUrl ?? undefined,
      customerNotes: customerNotes.trim() || undefined,
      shopifyVariantId: customBouquetVariantGid,
      structuredAddress: deliveryMethod === "delivery" ? structuredAddress : undefined,
      fedexServiceCode: deliveryMethod === "delivery" && fedexAttrs ? fedexAttrs.serviceCode : undefined,
      fedexRosesCount: deliveryMethod === "delivery" && fedexAttrs ? fedexAttrs.rosesCount : undefined,
      fedexRecipientAddress: deliveryMethod === "delivery" && fedexAttrs ? fedexAttrs.recipientAddress : undefined,
    };
  };

  // GA4 + Meta: add_to_cart for the custom bouquet
  const trackBuilderAddToCart = () => {
    const itemPrice = basePrice + lettersNumbersCost + crownCost + ribbonCost + glitterCost + vaseCost + accessoryCost;
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'add_to_cart', {
      currency: 'USD',
      value: itemPrice,
      items: [{
        item_id: 'custom-bouquet',
        item_name: 'Custom Bouquet',
        item_category: 'custom',
        price: itemPrice,
        quantity: 1,
      }],
    });
    trackMetaEvent('AddToCart', {
      content_ids: ['custom-bouquet'],
      content_name: 'Custom Bouquet',
      value: itemPrice,
      currency: 'USD',
    });
  };

  const handleBuilderAddToCart = async () => {
    if (!validateBuilder()) return;
    setIsAdding(true);
    try {
      trackBuilderAddToCart();
      await addItem(buildCartItem());
      toast.success("Bouquet added to cart!");
    } catch { toast.error("Failed to add to cart."); }
    finally { setIsAdding(false); }
  };

  const colorCategories = [
    { key: "natural" as const, label: t("builder.natural") },
    { key: "painted" as const, label: t("builder.painted") },
  ];

  return (
    <>
            {/* 1. Color */}
            <Section title={t("builder.chooseColors")} step={1}>
              <p className="text-xs text-muted-foreground font-body mb-4">{t("builder.colorsHint")}</p>
              {colorCategories.map(({ key, label }) => {
                const colors = colorOptions.filter((c) => c.category === key);
                return (
                  <div key={key} className="mb-5">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-3">
                      {label}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {colors.map((color) => {
                        const isSelected = selectedColors.some(c => c.name === color.name);
                        return (
                          <button
                            key={color.name}
                            onClick={() => {
                          if (isSelected) {
                            setSelectedColors(prev => prev.filter(c => c.name !== color.name));
                          } else if (selectedColors.length < 3) {
                                setSelectedColors(prev => [...prev, color]);
                              }
                            }}
                            className={`relative w-9 h-9 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                              isSelected
                                ? "border-primary scale-110 shadow-lg"
                                : selectedColors.length >= 3
                                  ? "border-border opacity-40 cursor-not-allowed"
                                  : "border-border hover:scale-105"
                            }`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            disabled={!isSelected && selectedColors.length >= 3}
                          >
                            {isSelected && (
                              <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${
                                ["Negro", "Azul", "Morado"].includes(color.name) ? "text-primary-foreground" : "text-foreground"
                              }`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <p className="text-sm font-body text-muted-foreground">
                {t("builder.selected")} <span className="text-foreground font-semibold">{selectedColors.length > 0 ? selectedColors.map(c => c.nameEn).join(', ') : t("builder.none")}</span>
              </p>
            </Section>


            {/* Paper Color */}
            <Section title={`${t("builder.paperColor")} *`} step={2}>
              <p className="text-xs text-muted-foreground font-body mb-4">{t("builder.paperHint")}</p>
              <PaperColorPicker selected={paperColor} onChange={setPaperColor} />
              <p className="text-sm font-body text-muted-foreground mt-3">
                {t("builder.selected")} <span className="text-foreground font-semibold">{paperColor || "—"}</span>
              </p>
              {!paperColor && (
                <p className="text-xs text-destructive font-body mt-2">Requerido / Required</p>
              )}
            </Section>

            {/* 2. Size */}
            <Section title={t("product.numberOfRoses")} step={3}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pricingTable.map((size, idx) => {
                  const tooFewRoses = size.roses < minRoses;
                  const letterDisabled = specialText.length > 0 && (size.roses < 75 || (specialText.length >= 3 && lettersNumbersType === "letters" && size.roses < 100));
                  const disabled = tooFewRoses || letterDisabled;
                  // Use Shopify price if available, otherwise local table
                  const mixType = getCustomBouquetType(selectedColors);
                  const shopifyMatch = mixType ? shopifyVariants.find(v =>
                    v.selectedOptions.some(o => o.name === "Mix Type" && o.value === mixType) &&
                    v.selectedOptions.some(o => o.name === "Roses" && o.value === `${size.roses} Roses`)
                  ) : null;
                  const price = shopifyMatch ? parseFloat(shopifyMatch.price.amount) : getFinishPrice(selectedColors, size.roses);
                  return (
                    <button
                      key={size.roses}
                      onClick={() => !disabled && setSelectedSizeIdx(idx)}
                      disabled={disabled}
                      className={`p-2 md:p-4 rounded-lg border-2 text-center transition-all ${
                        selectedSizeIdx === idx
                          ? "border-primary bg-primary/5"
                          : disabled
                          ? "border-border opacity-40 cursor-not-allowed"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className="font-display text-lg md:text-2xl font-semibold text-foreground leading-tight">
                        <span>{size.roses}</span>
                        <span className="text-xs md:hidden text-muted-foreground font-body font-normal ml-1">{t("builder.roses")}</span>
                      </p>
                      <p className="hidden md:block text-xs text-muted-foreground font-body">{t("builder.roses")}</p>
                      <p className="text-sm font-body font-semibold text-primary mt-0.5 md:mt-1">
                        ${price}
                      </p>
                      {tooFewRoses && <p className="text-[10px] text-destructive font-body mt-1">{t("product.min")} {minRoses} {t("builder.roses")}</p>}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* 3. Glitter */}
            <Section title={t("builder.glitterFinishTitle")} step={4}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-32 h-32 flex-shrink-0 mx-auto md:mx-0">
                  <img src={glitterRoseImg} alt="Glitter rose example" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-semibold text-foreground mb-1">{t("builder.glitterFinishDesc")}</p>
                  <p className="text-xs text-muted-foreground font-body mb-3">
                    {t("builder.glitterPer25")} · <span className="text-primary font-semibold">+${glitterCost}</span> {t("builder.glitterCostFor")} {rosesCount} {t("builder.roses")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setAddGlitter(true)}
                  className={`p-4 rounded-lg border-2 text-center transition-all font-body text-sm ${
                    addGlitter === true ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t("builder.yes")}
                  {addGlitter === true && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                </button>
                <button
                  onClick={() => setAddGlitter(false)}
                  className={`p-4 rounded-lg border-2 text-center transition-all font-body text-sm ${
                    addGlitter === false ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {t("builder.no")}
                  {addGlitter === false && <Check className="w-4 h-4 text-primary mx-auto mt-1" />}
                </button>
              </div>
            </Section>

            {/* 4. Accessories */}
            <Section title={t("builder.accessories")} step={5}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => setAddNote(v => !v)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all font-body text-sm ${
                    addNote
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <img src={noteImg} alt="Note accessory" className="w-16 h-16 md:w-14 md:h-14 object-contain rounded-lg" />
                  {t("builder.note")}
                  <span className="text-xs text-secondary">$3</span>
                </button>
                <button
                  onClick={() => setAddButterfly(v => !v)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all font-body text-sm ${
                    addButterfly
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  <img src={butterflyImg} alt="Butterfly accessory" className="w-16 h-16 md:w-14 md:h-14 object-contain" />
                  {t("builder.butterflies")}
                  <span className="text-xs text-secondary">$3</span>
                </button>
              </div>
              {addNote && (
                <textarea
                  value={accessoryText}
                  onChange={(e) => setAccessoryText(e.target.value)}
                  placeholder={t("builder.writeNote")}
                  className="w-full mt-4 bg-card border border-border rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[100px] resize-none"
                  maxLength={200}
                />
              )}
            </Section>

            {/* 5. Letras o Números */}
            <Section title={t("builder.lettersNumbers")} step={6} subtitle={t("builder.optional")}>
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 mx-auto md:mx-0">
                  <img src={lettersImg} alt="Letters in Baby Breath example" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <p className="font-body font-semibold text-foreground mb-1">{t("builder.lettersNumbersDesc")}</p>
                  <p className="text-xs text-muted-foreground font-body mb-3">${letterNumberExtraPrice} {t("builder.lettersNumbersHint")}</p>
                  <p className="text-xs text-foreground font-body">{t("builder.lettersNumbersCombo")}</p>
                </div>
              </div>
              <div className="space-y-4">
                <input
                  type="text"
                  value={specialText}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
                    setSpecialText(val);
                    if (val.length > 0) {
                      const minRoses75Idx = sizeOptions.findIndex(s => s.roses >= 75);
                      if (selectedSizeIdx < minRoses75Idx) setSelectedSizeIdx(minRoses75Idx);
                      if (val.length >= 3) {
                        const minIdx = sizeOptions.findIndex(s => s.roses >= 100);
                        if (selectedSizeIdx < minIdx) setSelectedSizeIdx(minIdx);
                      }
                    }
                  }}
                  placeholder={t("builder.typeLettersNumbers")}
                  className="w-full max-w-xs bg-card border border-border rounded-lg px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  maxLength={4}
                />
                <p className="text-xs text-muted-foreground font-body">{t("builder.minRosesLetters")}</p>
                {specialText.length > 0 && (
                  <div className="bg-card border border-border rounded-lg p-4">
                    <p className="font-body text-sm text-muted-foreground">
                      {specialText.length} × ${letterNumberExtraPrice} ={" "}
                      <span className="text-primary font-semibold">+${lettersNumbersCost}</span>
                    </p>
                  </div>
                )}
              </div>
            </Section>

            {/* 6. Vase */}
            <Section title={t("builder.vase")} step={7} subtitle={t("builder.optional")}>
              <div className="grid grid-cols-3 gap-3">
                {vaseOptions.map((v, idx) => {
                  const vaseImg = vase100Img;
                  return (
                    <button
                      key={v.roses}
                      onClick={() => { setAddVase(!addVase || selectedVaseIdx !== idx); setSelectedVaseIdx(idx); if (addVase && selectedVaseIdx === idx) setAddVase(false); }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        addVase && selectedVaseIdx === idx ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <img src={vaseImg} alt={v.label} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
                      <p className="font-display text-lg font-semibold text-foreground">{v.roses}</p>
                      <p className="text-xs text-muted-foreground font-body">{t("builder.roses")}</p>
                      <p className="text-sm font-body font-semibold text-primary">${v.price}</p>
                      {addVase && selectedVaseIdx === idx && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* 7. Extras */}
            <Section title={t("builder.extras")} step={8} subtitle={t("builder.optional")}>
              <div className="space-y-4">
                {/* Crown */}
                <div>
                  <button onClick={() => setAddCrown(!addCrown)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all font-body text-sm ${
                      addCrown ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}>
                    <img src={crownGoldImg} alt="Crown Tiara" className="w-12 h-12 object-contain shrink-0 rounded-lg" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">{t("builder.crown")}</p>
                      <p className="text-xs">{t("builder.crownDesc")}</p>
                    </div>
                    <span className="text-xs font-semibold">+${crownPrice}</span>
                    {addCrown && <Check className="w-4 h-4 text-primary" />}
                  </button>
                  {addCrown && (
                    <div className="flex gap-3 mt-3 pl-2">
                      {crownOptions.map((opt) => (
                        <button key={opt.size} onClick={() => setCrownSize(opt.size)}
                          className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 text-xs font-body transition-all ${
                            crownSize === opt.size ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                          }`}>
                          <div className="w-16 h-12 overflow-hidden rounded-lg">
                           <img src={opt.size === "silver" ? crownSilverImg : crownGoldImg} alt={opt.label} className="w-full h-full object-contain" />
                          </div>
                          {opt.size === "silver" ? t("builder.crownSilver") : t("builder.crownGold")}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Ribbon */}
                <div>
                  <button onClick={() => { setAddRibbon(!addRibbon); if (addRibbon) setRibbonText(""); }}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all font-body text-sm ${
                      addRibbon ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                    }`}>
                    <img src={ribbonImg} alt="Custom ribbon" className="w-12 h-12 object-contain shrink-0 rounded-lg" />
                    <div className="text-left flex-1">
                      <p className="font-semibold">{t("builder.customRibbon")}</p>
                      <p className="text-xs">{t("builder.ribbonDesc")}</p>
                    </div>
                    <span className="text-xs font-semibold">+${ribbonPrice}</span>
                    {addRibbon && <Check className="w-4 h-4 text-primary" />}
                  </button>
                  {addRibbon && (
                    <div className="mt-3 pl-2 space-y-3">
                      <div className="flex gap-2">
                        {(["names", "congratulations"] as const).map((rt) => (
                          <button key={rt} onClick={() => { setRibbonType(rt); setRibbonText(""); }}
                            className={`px-4 py-2 rounded-lg border text-xs font-body transition-all ${
                              ribbonType === rt ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                            }`}>
                            {rt === "names" ? t("builder.ribbonNames") : t("builder.ribbonCongrats")}
                          </button>
                        ))}
                      </div>
                      {ribbonType === "congratulations" && (
                        <div className="flex flex-wrap gap-2">
                          {ribbonPresets.map((preset) => (
                            <button key={preset} onClick={() => setRibbonText(preset)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-body transition-all ${
                                ribbonText === preset ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/30"
                              }`}>{preset}</button>
                          ))}
                        </div>
                      )}
                      <input type="text" value={ribbonText} onChange={(e) => setRibbonText(e.target.value)}
                        placeholder={ribbonType === "names" ? t("builder.ribbonNamesPlaceholder") : t("builder.ribbonCongratsPlaceholder")}
                        className="w-full bg-card border border-border rounded-lg px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                  )}
                </div>
              </div>
            </Section>

            {/* 8. AI Preview */}
            <Section title={t("builder.aiPreview")} step={9} subtitle={t("builder.optional")}>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground font-body">{t("builder.aiPreviewDesc")}</p>
                {selectedColors.length === 0 && <p className="text-sm text-destructive font-body">{t("builder.selectColorFirst")}</p>}
                {selectedColors.length > 0 && !paperColor && <p className="text-sm text-destructive font-body">{t("builder.selectPaperFirst")}</p>}
                <button onClick={handleGeneratePreview} disabled={previewLoading || hasGeneratedPreview || selectedColors.length === 0 || !paperColor}
                  className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-6 py-3 font-body text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {previewLoading ? (<><Loader2 className="w-4 h-4 animate-spin" />{t("builder.generating")}</>) : hasGeneratedPreview ? (<><Eye className="w-4 h-4" />{t("builder.previewGenerated")}</>) : (<><Eye className="w-4 h-4" />{t("builder.generatePreview")}</>)}
                </button>
                {hasGeneratedPreview && <p className="text-xs text-muted-foreground">{t("builder.previewOnce")}</p>}
                {previewError && <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4"><p className="text-sm font-body text-destructive">{previewError}</p></div>}
                {previewUrl && (
                  <div className="space-y-2">
                    <div className="relative overflow-hidden rounded-lg border border-border"><img src={previewUrl} alt="Preview" className="w-full h-auto object-contain max-h-[500px]" /></div>
                    <p className="text-xs text-muted-foreground font-body text-center italic">{t("builder.previewDisclaimer")}</p>
                  </div>
                )}
              </div>
            </Section>

            {/* 9. Delivery */}
            <Section title={t("builder.shipping")} step={10}>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setDeliveryMethod("pickup")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-lg border-2 transition-all font-body ${
                    deliveryMethod === "pickup"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Store className="w-6 h-6" />
                   <div className="text-center">
                     <p className="font-semibold text-sm text-foreground">{t("builder.storePickup")}</p>
                     <p className="text-xs text-muted-foreground mt-1">{t("builder.free")}</p>
                   </div>
                  {deliveryMethod === "pickup" && <Check className="w-4 h-4 text-primary" />}
                </button>
                <button
                  onClick={() => setDeliveryMethod("delivery")}
                  className={`flex flex-col items-center gap-3 p-5 rounded-lg border-2 transition-all font-body ${
                    deliveryMethod === "delivery"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <Truck className="w-6 h-6" />
                   <div className="text-center">
                     <p className="font-semibold text-sm text-foreground">{t("builder.homeDelivery")}</p>
                     <p className="text-xs text-muted-foreground mt-1">{t("builder.fromPrice")}</p>
                  </div>
                  {deliveryMethod === "delivery" && <Check className="w-4 h-4 text-primary" />}
                </button>
              </div>

              {/* Date picker */}
              <div className="mb-4">
                <label className="text-sm font-body font-semibold text-foreground block mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" /> {deliveryMethod === "pickup" ? "Pickup" : "Delivery"} date
                </label>
                <PopoverLite
                  open={calendarOpen}
                  onOpenChange={setCalendarOpen}
                  trigger={
                    <button
                      type="button"
                      onClick={() => setCalendarOpen(!calendarOpen)}
                      className="w-full md:w-auto flex items-center gap-2 px-4 py-3 rounded-lg border border-border bg-card font-body text-sm text-foreground hover:border-primary/30 transition-all"
                    >
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      {deliveryDate ? format(deliveryDate, "PPP", { locale: enUS }) : "Select a date"}
                    </button>
                  }
                >
                  <CalendarLite
                    selected={deliveryDate}
                    onSelect={(date) => {
                      if (date) {
                        setDeliveryDate(date);
                        setDeliveryHour("");
                        setCalendarOpen(false);
                      }
                    }}
                    disabled={(date) => isBefore(startOfDay(date), startOfDay(todayInMiami())) || (date >= new Date(2026, 4, 1) && date <= new Date(2026, 4, 12))}
                  />
                </PopoverLite>
              </div>

              {/* Time picker */}
              {deliveryDate && !(deliveryMethod === "delivery" && distanceTooFar) && (
                <div>
                  <label className="text-sm font-body font-semibold text-foreground block mb-2">
                    <Clock className="w-4 h-4 inline mr-1" /> {deliveryMethod === "pickup" ? "Pickup" : "Delivery"} time
                  </label>
                  {availableHours.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {availableHours.map((hour) => (
                        <button
                          key={hour}
                          onClick={() => setDeliveryHour(hour)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-body transition-all ${
                            deliveryHour === hour
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {hour}
                        </button>
                      ))}
                    </div>
                  ) : (
                     <p className="text-sm text-muted-foreground font-body">
                       No available hours for today (minimum 2 hours in advance). Select another day.
                     </p>
                  )}
                </div>
              )}

              {/* Delivery Data */}
              <div className="space-y-4 p-5 rounded-lg border border-border bg-card mt-6">
                {deliveryMethod === "pickup" ? (
                  <p className="font-body text-sm text-muted-foreground">
                    {t("builder.pickupAt")} <span className="font-semibold text-foreground">7257 NW 12th St, Miami, FL 33126</span>
                  </p>
                ) : (
                  <>
                <p className="font-body font-semibold text-foreground text-sm">{t("builder.deliveryAddress")}</p>

                {deliveryMethod === "delivery" && (
                  <>
                    <div ref={autocompleteRef} className="relative">
                       <label className="text-xs text-muted-foreground font-body block mb-1">
                         <MapPin className="w-3 h-3 inline mr-1" />
                         Delivery address <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={addressQuery}
                          onChange={(e) => handleAddressInput(e.target.value)}
                          onFocus={() => predictions.length > 0 && setShowPredictions(true)}
                          placeholder="Start typing the address..."
                          className="w-full bg-background border border-border rounded-lg px-3 py-2.5 pr-10 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                          required
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {autocompleteLoading || distanceLoading ? (
                            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                          ) : (
                            <Search className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>

                      {showPredictions && predictions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {predictions.map((p) => (
                            <button
                              key={p.placeId}
                              onClick={() => handleSelectPrediction(p)}
                              className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border last:border-b-0"
                            >
                              <p className="font-body text-sm font-medium text-foreground">{p.mainText}</p>
                              <p className="font-body text-xs text-muted-foreground">{p.secondaryText}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedAddress && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                        <p className="font-body text-xs text-muted-foreground">Selected address:</p>
                        <p className="font-body text-sm text-foreground font-medium">{selectedAddress}</p>
                      </div>
                    )}

                    {distanceError && !distanceTooFar && (
                      <p className="text-sm font-body text-destructive">{distanceError}</p>
                    )}

                    {deliveryMiles !== null && !distanceTooFar && (
                      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                        <p className="font-body text-sm text-foreground">
                           📍 Distance: <span className="font-semibold">{deliveryMiles} miles</span>
                           {deliveryDuration && <span className="text-muted-foreground"> (~{deliveryDuration})</span>}
                         </p>
                         <p className="font-body text-sm text-primary font-semibold mt-1">
                           Shipping cost: {formatDeliveryCost(deliveryCost)}
                         </p>
                      </div>
                    )}

                    {distanceTooFar && deliveryMiles !== null && (
                      <FedExShippingOptions
                        fullAddress={selectedAddress}
                        structuredAddress={structuredAddress ?? null}
                        miles={deliveryMiles}
                        roses={rosesCount}
                        deliveryDate={deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : ""}
                        itemsCount={cartItems.length + 1}
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

                    {mapImageUrl ? (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img src={mapImageUrl} alt="Route map" className="w-full h-auto block" loading="lazy" />
                      </div>
                    ) : mapUrl ? (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img src={mapUrl} alt="Delivery route" className="w-full h-auto block" loading="lazy" />
                      </div>
                    ) : (
                      <div className="rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center h-48">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="font-body text-sm text-muted-foreground">
                            Enter an address to see the map
                          </p>
                        </div>
                      </div>
                    )}
                  </>
                )}
                  </>
                )}
              </div>
            </Section>

            {/* Customer Notes */}
            <div>
              <label className="text-sm font-body font-semibold text-foreground block mb-2">{t("builder.customerNotes")}</label>
              <textarea value={customerNotes} onChange={(e) => setCustomerNotes(e.target.value)} placeholder={t("builder.customerNotesPlaceholder")}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[60px] resize-none" maxLength={500} />
            </div>

            {/* Action buttons (desktop & mobile) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-body text-[10px] text-muted-foreground leading-tight flex-1 line-clamp-1">
                  {rosesCount} roses · {selectedColors.length > 0 ? selectedColors.map(c => c.nameEn).join(', ') : 'No color'}
                  {paperColor && ` · ${paperColor}`}
                  {addGlitter === true && " · Glitter"}
                  {addNote && " · Note"}
                  {addButterfly && " · Butterflies"}
                </p>
                <p className="font-display text-xl font-bold text-foreground whitespace-nowrap">${parseFloat(totalPrice.toFixed(2))}</p>
              </div>
              {deliveryMethod === "pickup" && <StorePickupAlert language={language} />}
              <button
                disabled={isAdding || variantsLoading || isMothersDayPromoActive()}
                onClick={handleBuilderAddToCart}
                className="w-full bg-primary text-primary-foreground py-4 font-body text-sm tracking-[0.25em] uppercase font-semibold hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50">
                {isMothersDayPromoActive()
                  ? "Available May 13"
                  : isAdding ? "..." : t("product.orderAndPay")}
              </button>
              {/* Social proof (★ 5.0 · Google · 70,000+ served) right under the
                  Order & Pay button. */}
              <div className="mt-3 flex justify-center">
                <ProductRatingBar language={language} align="center" variant="compact" />
              </div>
              {isMothersDayPromoActive() && (
                <p className="text-center text-xs text-muted-foreground font-body">
                  Custom bouquets pause during our Mother&apos;s Day Special Edition.{" "}
                  <Link href="/mothers-day" className="text-primary hover:underline font-semibold">
                    Shop Mother&apos;s Day →
                  </Link>
                </p>
              )}
            </div>
    </>
  );
};

const Section = ({
  title,
  step,
  subtitle,
  children,
}: {
  title: string;
  step: number;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-4">
      <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-semibold">
        {step}
      </span>
      {/* Builder step labels ("Number of Roses", "Glitter Finish", …) are UI
          labels, NOT document headings (SPEC §0f, §2.5) — same style, plain <p>. */}
      <p className="font-display text-xl font-semibold text-foreground">{title}</p>
      {subtitle && (
        <span className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full font-body">
          {subtitle}
        </span>
      )}
    </div>
    {children}
  </div>
);

export default BouquetBuilderClient;
