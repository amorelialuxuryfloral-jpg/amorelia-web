import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface CartItem {
  // Local display data
  id: string;
  productName: string;
  bouquetType: string;
  color: string;
  roses: number;
  price: number; // product price INCLUDING its add-ons (no delivery)
  // Product price WITHOUT add-ons (no glitter/vase/note/butterflies/crown/
  // ribbon/letters, no delivery). Used ONLY for the cart drawer's display
  // split "Subtotal (base) vs Extras (add-ons)" — per-item extras =
  // price - basePrice, so Subtotal + Extras always equals the same items
  // total that feeds the checkout math (which keeps reading `price`).
  // Optional: items persisted before this field exists fall back to `price`
  // (extras shown as 0 — never a wrong total).
  basePrice?: number;
  deliveryCost: number;
  totalPrice: number;
  addons: string[];
  accessory: string;
  accessoryText: string;
  ribbonText: string;
  crownSize: string;
  specialText: string;
  heartColor: string;
  glitter: boolean;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryName: string;
  deliveryPhone: string;
  deliveryEmail: string;
  deliveryAddress: string;
  deliveryZip: string;
  deliveryDate: string;
  deliveryHour: string;
  deliveryMiles: number | null;
  paperColor: string;
  image?: string;
  customerNotes?: string;
  // Mother's Day Edition flag — accessories are bundled into the variant price.
  isMothersDay?: boolean;
  structuredAddress?: {
    address1: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  // Shopify variant id (GID). Empty string for "Coming Soon" categories.
  shopifyVariantId: string;
  // Optional Shopify product handle — used by cart upsells to fetch sibling
  // size variants on demand. Set when the item comes from a real Shopify product.
  shopifyHandle?: string;
  quantity?: number;
  // FedEx national shipping (set by FedExShippingOptions, read by performApiCheckout
  // and by the shopify-fedex-webhook edge function via order note_attributes).
  fedexServiceCode?: string;
  fedexRosesCount?: number;
  fedexRecipientAddress?: string; // JSON-stringified recipient address
}

interface CartStore {
  items: CartItem[];
  isLoading: boolean;
  isOpen: boolean;
  shippingProtection: boolean;
  setShippingProtection: (on: boolean) => void;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  duplicateItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  updateItem: (id: string, partial: Partial<CartItem>) => void;
  clearCart: () => void;
}

/**
 * Local-only cart store.
 *
 * The Shopify cart is NOT created here — it is created in a single call
 * from `performApiCheckout()` at the moment the user clicks "Continue to
 * Safe Checkout". This guarantees that any checkoutUrl Shopify ever sees
 * (Shop Pay, abandoned-cart emails, express checkouts) already contains
 * the service fee, delivery fee, and order notes.
 */
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isOpen: false,
      shippingProtection: false,
      setShippingProtection: (on) => set({ shippingProtection: on }),
      setOpen: (open) => set({ isOpen: open }),

      // NOTE: no `get totalItems()` / `get cartTotal()` getters here. They
      // were dead code (every consumer derives counts from `items` locally)
      // and they BROKE persist rehydration: zustand's merge spreads the
      // current state, which evaluated the getters before the store was
      // initialized, threw, and silently aborted hydration — wiping the
      // cart on every full page reload.

      addItem: async (item) => {
        const localId = item.id && item.id.length > 0 ? item.id : crypto.randomUUID();
        const newItem: CartItem = { quantity: 1, ...(item as CartItem), id: localId };
        set({ items: [...get().items, newItem], isOpen: true });
      },

      removeItem: async (id) => {
        const newItems = get().items.filter((i) => i.id !== id);
        if (newItems.length === 0) {
          get().clearCart();
        } else {
          set({ items: newItems });
        }
      },

      duplicateItem: async (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        const newItem: CartItem = { ...item, id: crypto.randomUUID() };
        set({ items: [...get().items, newItem] });
      },

      updateQuantity: async (id, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        });
      },

      updateItem: (id, partial) => {
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, ...partial } : i
          ),
        });
      },

      clearCart: () => set({ items: [], shippingProtection: false }),
    }),
    {
      name: 'amorelia-shopify-cart',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // Migrate from v1 (which persisted cartId/checkoutUrl) by dropping them.
      migrate: (persistedState: unknown, _version: number) => {
        if (persistedState && typeof persistedState === 'object') {
          const s = persistedState as Record<string, unknown>;
          return {
            items: Array.isArray(s.items) ? s.items : [],
            shippingProtection: typeof s.shippingProtection === 'boolean' ? s.shippingProtection : false,
          };
        }
        return { items: [], shippingProtection: false };
      },
      partialize: (state) => ({ items: state.items, shippingProtection: state.shippingProtection }),
    }
  )
);
