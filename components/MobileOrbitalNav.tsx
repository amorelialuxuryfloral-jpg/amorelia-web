"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { Home, Flower2, Sparkles } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * Mobile "Orbital" floating bottom nav — fixed at thumb reach. Ported 1:1
 * from the SPA (web/src/components/MobileOrbitalNav.tsx).
 *
 * Romuald — Armada SEO 2025, Módulo 12 "Prepara tu web para monetizar" clase 01:
 * la navegación móvil debe maximizar páginas-vistas-por-sesión; menú flotante
 * FIJO abajo, al alcance del pulgar, para subir los clics internos.
 *
 * Solo móvil (md:hidden). Reutiliza el mismo store del carrito que el navbar.
 * El contador del carrito viene de localStorage (zustand persist) — se emite 0
 * hasta el mount para que el HTML del servidor coincida con la primera
 * hidratación (mismo patrón que Navbar.tsx).
 */

const MobileOrbitalNav = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const items = useCartStore((s) => s.items);
  const setCartOpen = useCartStore((s) => s.setOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const totalItems = mounted ? items.length : 0;

  const l = (path: string) => localizePath(path, language);

  const itemCls =
    "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 text-foreground/70 hover:text-primary active:text-primary transition-colors";
  const labelCls = "font-body text-[10px] tracking-wide";

  return (
    // z-30 keeps it below the PDP sticky "Order Now" bar (z-40) and the cart
    // sheet so those always sit on top when present.
    <nav
      aria-label={t("clusters.quickNav")}
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch">
        <Link href={l("/")} className={itemCls}>
          <Home className="w-5 h-5" strokeWidth={1.8} />
          <span className={labelCls}>{t("nav.home")}</span>
        </Link>
        <Link href={l("/bouquets")} className={itemCls}>
          <Flower2 className="w-5 h-5" strokeWidth={1.8} />
          <span className={labelCls}>{t("nav.bouquets")}</span>
        </Link>
        <Link href={l("/bouquets/personalizar")} className={itemCls}>
          <Sparkles className="w-5 h-5" strokeWidth={1.8} />
          <span className={labelCls}>{t("nav.customBouquets")}</span>
        </Link>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={t("floatingCart.yourCart")}
          className={`${itemCls} relative`}
        >
          {/* SAME cart icon as the Navbar header (BrandLogo — the cart with
              roses), for icon consistency top/bottom (feedback Eric jul 2026). */}
          <BrandLogo className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute top-1 right-[calc(50%-1.1rem)] bg-primary text-primary-foreground text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className={labelCls}>{t("floatingCart.yourCart")}</span>
        </button>
      </div>
    </nav>
  );
};

export default MobileOrbitalNav;
