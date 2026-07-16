"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import AnnouncementBar from "@/components/AnnouncementBar";
import { Menu, X, ChevronDown, Search as SearchIcon, Globe, ShoppingCart } from "lucide-react";
import { bouquetProducts } from "@/lib/catalogData";
import { slugForHandle, slugEsForHandle, h1ForHandle, h1EsForHandle } from "@/lib/bouquetSlugs";
import { COLOR_COLLECTIONS } from "@/lib/colorCollections";
import { roomDecorPackages } from "@/lib/roomDecorData";
import { occasionPages, occasionsByTier } from "@/lib/occasionPagesData";
import { flowerTypePages } from "@/lib/flowerTypePagesData";
import { getTranslator, localizePath, stripLangPrefix, type Language } from "@/i18n";

/**
 * Navbar — client component (menus, search, cart, language toggle).
 *
 * SEO contract (spec §2.4): every menu link is a REAL <a> present in the
 * server-rendered HTML. The mega-menu and the mobile menu are therefore
 * ALWAYS rendered in the DOM and only hidden/shown with CSS classes — never
 * conditionally mounted. Do not "optimize" this back to conditional renders.
 *
 * SEARCH (jul 2026): the magnifier searches the CATALOG — products, color
 * collections, occasions and flower-type pages — 100% client-side over the
 * data files already shipped (no backend). It NO LONGER autocompletes street
 * ADDRESSES (that made no sense in a shop search). The Google Places
 * address autocomplete stays ONLY where it is legitimate: the product
 * configurator / checkout delivery flow (ProductDetailClient etc.), which
 * computes the real delivery distance. Do not re-add address autocomplete here.
 */

/** Accent/case-insensitive normalization ("Buchón" matches "buchon"). */
const normalize = (s: string): string =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

interface SearchEntry {
  label: string;
  to: string;
  /** Extra match phrases (both languages) besides the visible label. */
  keywords: string[];
  /** Lower = ranked first among equal match scores (collections > products > pages). */
  priority: number;
}

const Navbar = ({ language = "en" }: { language?: Language }) => {
  const { t } = getTranslator(language);
  const items = useCartStore(state => state.items);
  const setCartOpen = useCartStore(state => state.setOpen);
  // Cart count comes from localStorage (zustand persist) — gate on mounted so
  // the server HTML (0 items) matches the client's first render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const totalItems = mounted ? items.length : 0;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [bouquetDropdownOpen, setBouquetDropdownOpen] = useState(false);
  const [mobileBouquetOpen, setMobileBouquetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  // Close timer for the Bouquets hover dropdown: ~250 ms grace so the cursor
  // can travel from the trigger to the panel (or between sub-links) without
  // accidentally closing the menu.
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openBouquetDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setBouquetDropdownOpen(true);
  };
  const scheduleCloseBouquetDropdown = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setBouquetDropdownOpen(false), 250);
  };

  // Localize an EN-style path for the active language (adds /es prefix).
  const l = (path: string) => localizePath(path, language);

  // Logo click → home. If we are ALREADY on the home page, don't re-navigate:
  // smooth-scroll back to the top instead (mobile users otherwise have to
  // swipe all the way up by hand). href="/" stays on the <Link> for SEO.
  const handleLogoClick = (e: React.MouseEvent) => {
    const home = l("/").replace(/\/$/, "") || "/";
    const current = (pathname || "").replace(/\/$/, "") || "/";
    if (current === home) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Color collection links use the NATIVE ES slug (not a /es prefix), resolved per language.
  const colorLinkTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/bouquets/${slugEs}` : `/bouquets/${slug}`;

  // Occasion collection links use NATIVE ES slugs (different per language).
  const occasionLinkTo = (slug: string, slugEs: string) =>
    language === "es" ? `/es/collections/${slugEs}` : `/collections/${slug}`;
  const occasionsIndexPath = language === "es" ? "/es/collections/ocasiones" : "/collections/occasions";

  // Mega-menu grouped by intent. URLs are preserved (no SEO/301 changes).
  const bouquetGroups: Array<{
    title: string;
    titleTo?: string;
    items: Array<{ to: string; label: string }>;
  }> = [
    {
      title: t("nav.byType"),
      titleTo: l("/bouquets"),
      items: [
        { to: l("/bouquets"), label: t("nav.allColors") },
        { to: l("/bouquets/single-color"), label: t("nav.singleColor") },
        { to: l("/bouquets/mixed-color"), label: t("nav.mixedBouquets") },
      ],
    },
    {
      title: t("nav.byColor"),
      titleTo: l("/bouquets"),
      items: [
        ...COLOR_COLLECTIONS.map((c) => ({
          to: colorLinkTo(c.slug, c.slugEs),
          label: t(`nav.${c.color}Roses`),
        })),
      ],
    },
  ];

  const navLinks = [
    { to: l("/"), label: t("nav.home") },
    { to: l("/bouquets"), label: t("nav.bouquets"), hasDropdown: true },
    { to: l("/contact"), label: language === "es" ? "Contacto" : "Contact" },
  ];

  // ── Catalog search index (client-side, built from data already shipped) ──
  // Keywords include BOTH languages so "red roses" works on /es and
  // "rosas rojas" works on the EN site; labels/URLs follow the active language.
  const searchableItems: SearchEntry[] = [
    // Color collections — "red roses" must land on /bouquets/red-roses.
    ...COLOR_COLLECTIONS.map((c) => ({
      label: t(`nav.${c.color}Roses`),
      to: colorLinkTo(c.slug, c.slugEs),
      keywords: [
        c.slug.split("-").join(" "),          // "red roses"
        `${c.slug.split("-").join(" ")} bouquet`,
        c.slugEs.split("-").join(" "),        // "rosas rojas"
        `ramo de ${c.slugEs.split("-").join(" ")}`,
        c.color,                               // "red"
      ],
      priority: 0,
    })),
    // Bouquet subcategory collections.
    { label: t("nav.bicolorBouquets"), to: l("/bouquets/bicolor"), keywords: ["bicolor", "two colors", "dos colores"], priority: 0 },
    { label: t("nav.singleColor"), to: l("/bouquets/single-color"), keywords: ["single color", "un color", "un solo color"], priority: 0 },
    { label: t("nav.mixedBouquets"), to: l("/bouquets/mixed-color"), keywords: ["mixed", "mix", "mixto", "mezcla", "combinado"], priority: 0 },
    // The 48 fichas — searchable by keyword phrase (EN + ES), commercial name and colors.
    ...bouquetProducts.map((p) => ({
      label: language === "es" ? h1EsForHandle(p.shopifyHandle) : h1ForHandle(p.shopifyHandle),
      to: language === "es"
        ? `/es/bouquets/${slugEsForHandle(p.shopifyHandle)}`
        : `/bouquets/${slugForHandle(p.shopifyHandle)}`,
      keywords: [h1ForHandle(p.shopifyHandle), h1EsForHandle(p.shopifyHandle), p.name, p.color],
      priority: 1,
    })),
    // Room decor packages.
    ...roomDecorPackages.map((p) => ({
      label: p.name,
      to: l(`/room-decors/${p.id}`),
      keywords: ["room decor", "decoración", "romantic room"],
      priority: 1,
    })),
    // Flower-type pages (ramo buchón, money bouquet, tulips, sunflowers…).
    ...flowerTypePages.map((p) => ({
      label: language === "es" ? p.h1.es : p.h1.en,
      to: occasionLinkTo(p.slug, p.slugEs),
      keywords: [p.keyword.en, p.keyword.es, ...(p.keyword2 ? [p.keyword2.en, p.keyword2.es] : []), p.slug.split("-").join(" ")],
      priority: 2,
    })),
    // Occasion pages (birthday, anniversary, Valentine's, quinceañera…).
    ...occasionPages.map((p) => ({
      label: language === "es" ? p.h1.es : p.h1.en,
      to: occasionLinkTo(p.slug, p.slugEs),
      keywords: [p.keyword.en, p.keyword.es, ...(p.keyword2 ? [p.keyword2.en, p.keyword2.es] : [])],
      priority: 2,
    })),
    // Occasion money pages outside /collections.
    { label: t("nav.mothersDayBouquets"), to: l("/mothers-day"), keywords: ["mothers day", "día de las madres", "dia de las madres"], priority: 2 },
    {
      label: language === "es" ? "Flores para Funeral" : "Funeral & Sympathy Flowers",
      to: language === "es" ? "/es/flores-funeral-miami" : "/funeral-sympathy-flowers-miami",
      keywords: ["funeral flowers", "sympathy", "flores funeral", "condolencias"],
      priority: 2,
    },
    {
      label: language === "es" ? "Flores para Boda" : "Wedding Flowers",
      to: "/wedding-flowers-miami",
      keywords: ["wedding flowers", "flores para boda", "bridal"],
      priority: 2,
    },
    // Utility pages.
    { label: t("nav.delivery"), to: l("/delivery"), keywords: ["delivery", "envío", "envio", "same day", "mismo día"], priority: 3 },
    { label: t("nav.contact"), to: l("/contact"), keywords: ["contact", "contacto"], priority: 3 },
    { label: t("nav.faq"), to: l("/faq"), keywords: ["faq", "questions", "preguntas"], priority: 3 },
  ];

  // Match: every word of the query must appear in the label or a keyword.
  // Rank: exact phrase hit > phrase prefix > substring, then by priority
  // (collections before fichas before info pages). Top 8.
  const query = normalize(searchQuery.trim());
  const queryWords = query.split(/\s+/).filter(Boolean);
  const searchResults =
    searchQuery.trim().length >= 2
      ? searchableItems
          .map((item) => {
            const phrases = [item.label, ...item.keywords].map(normalize);
            const haystack = phrases.join(" | ");
            if (!queryWords.every((w) => haystack.includes(w))) return null;
            const score = phrases.some((p) => p === query)
              ? 0
              : phrases.some((p) => p.startsWith(query))
                ? 1
                : 2;
            return { item, score };
          })
          .filter((r): r is { item: SearchEntry; score: number } => r !== null)
          .sort((a, b) => a.score - b.score || a.item.priority - b.item.priority)
          .slice(0, 8)
          .map((r) => r.item)
      : [];

  const handleSearchChange = (val: string) => setSearchQuery(val);

  // Enter → go to the top match (e.g. "red roses" ⏎ → red roses collection).
  const handleSearchSubmit = () => {
    if (searchResults.length === 0) return;
    const to = searchResults[0].to;
    closeSearch();
    router.push(to);
  };

  const toggleLang = () => {
    const nextLang: Language = language === "en" ? "es" : "en";
    const cleanPath = stripLangPrefix(pathname || "/");
    // Read the query string at click time (NOT via useSearchParams — that hook
    // forces a Suspense boundary that strips the whole navbar, menu links
    // included, out of the statically generated HTML → spec §2.4 violation).
    const search = typeof window !== "undefined" ? window.location.search : "";
    const target = localizePath(cleanPath, nextLang) + search;
    router.push(target);
  };

  const closeSearch = () => { setSearchOpen(false); setSearchQuery(""); };

  return (
    <>
    <div className="fixed top-0 left-0 right-0 z-[51]">
      <AnnouncementBar language={language} />
    </div>
    <nav className="fixed top-[30px] left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-6 py-3 flex items-center justify-between relative">
        {/* Left group: hamburger (mobile) + logo (desktop). Keeping the logo
            INSIDE this left flex item — instead of as a standalone sibling —
            is what pins it to the left: with justify-between there are then
            exactly two in-flow items (this group + the right controls), so the
            absolutely-centered nav never overlaps the logo. */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.aria.closeMenu") : t("nav.aria.openMenu")}
            aria-expanded={mobileOpen}
            className="lg:hidden text-foreground hover:text-primary transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href={l("/")} onClick={handleLogoClick} className="hidden lg:flex items-center gap-2">
            <img src="/amorelia-logo.webp" alt="Amorelia Luxury Floral Gifts Miami – Premium Handcrafted Bouquets" className="h-10 w-auto" width={111} height={40} />
          </Link>
        </div>

        <Link href={l("/")} onClick={handleLogoClick} className="lg:hidden absolute left-1/2 -translate-x-1/2 flex items-center">
          <img src="/amorelia-logo.webp" alt="Amorelia Luxury Floral Gifts Miami" className="h-10 w-auto" width={111} height={40} />
        </Link>

        <div className="hidden lg:flex items-center gap-5 font-body text-xs tracking-widest uppercase text-muted-foreground lg:absolute lg:left-1/2 lg:-translate-x-1/2">
          {navLinks.map((link) => (
            link.hasDropdown ? (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={openBouquetDropdown}
                onMouseLeave={scheduleCloseBouquetDropdown}
              >
                <Link href={link.to} className="hover:text-primary transition-colors whitespace-nowrap inline-flex items-center gap-1 uppercase">
                  {link.label} <ChevronDown className="w-3 h-3" />
                </Link>
                {/* Mega-menu — ALWAYS in the DOM (real <a> links in the HTML),
                    visibility toggled with CSS only. pt-2 keeps the panel
                    attached to the trigger as one continuous hover surface. */}
                <div
                  onMouseEnter={openBouquetDropdown}
                  onMouseLeave={scheduleCloseBouquetDropdown}
                  className={`absolute top-full left-0 pt-2 z-50 transition-opacity duration-150 ${bouquetDropdownOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}
                >
                  <div className="bg-background border border-border rounded-lg shadow-xl p-5 grid grid-cols-3 gap-6 min-w-[560px]">
                  {bouquetGroups.map((group, gi) => (
                    <div key={gi} className="flex flex-col gap-2 min-w-[150px]">
                      {group.titleTo ? (
                        <Link
                          href={group.titleTo}
                          onClick={() => setBouquetDropdownOpen(false)}
                          className="text-[11px] tracking-widest uppercase font-semibold text-foreground hover:text-primary transition-colors pb-1.5 border-b border-border"
                        >
                          {group.title}
                        </Link>
                      ) : (
                        <span className="text-[11px] tracking-widest uppercase font-semibold text-foreground pb-1.5 border-b border-border">
                          {group.title}
                        </span>
                      )}
                      <div className="flex flex-col">
                        {group.items.map((sub, i) => (
                          <Link key={i} href={sub.to} onClick={() => setBouquetDropdownOpen(false)} className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link key={link.to} href={link.to} className="hover:text-primary transition-colors whitespace-nowrap uppercase">
                {link.label}
              </Link>
            )
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            aria-label={t("nav.aria.changeLanguage")}
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors font-body text-xs tracking-wider uppercase"
            title={language === "en" ? "Cambiar a Español" : "Switch to English"}
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === "en" ? "ES" : "EN"}</span>
          </button>

          {/* Search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label={t("nav.aria.search")}
            aria-expanded={searchOpen}
            className="text-foreground hover:text-primary transition-colors"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={t("nav.aria.openCart")}
            className="relative hover:text-primary transition-colors text-foreground"
          >
            <ShoppingCart className="w-6 h-6" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-body font-semibold">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-6 py-3 relative">
            <div className="relative max-w-md mx-auto">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearchSubmit(); }}
                placeholder={t("nav.searchPlaceholder")}
                autoFocus
                className="w-full bg-muted border border-border rounded-lg pl-10 pr-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
                {searchResults.map((item, i) => (
                  <Link
                    key={`s-${i}`}
                    href={item.to}
                    onClick={closeSearch}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-body text-foreground hover:bg-cream/50 hover:text-primary transition-colors border-b border-border last:border-b-0"
                  >
                    <SearchIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </nav>

    {/* Mobile menu — side sheet from left. ALWAYS in the DOM so its links
        are in the server HTML; slides in/out with CSS transforms.
        IMPORTANT: it lives OUTSIDE the <nav> on purpose. The nav has
        backdrop-blur-md, and backdrop-filter creates a CSS containing block
        for fixed-position descendants — inside the nav, this sheet's
        `fixed top-0 bottom-0` resolved against the ~52px-tall navbar and the
        menu opened as a tiny clipped sliver (the "broken hamburger" bug,
        verified headless 390px). Do not move it back inside the nav. */}
      <div
        className={`lg:hidden fixed inset-0 z-[52] bg-foreground/40 transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />
      <div
        className={`lg:hidden fixed top-0 bottom-0 left-0 z-[53] w-[80vw] max-w-sm transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal={mobileOpen}
        aria-label={t("nav.menu")}
      >
        <div className="flex flex-col h-full bg-background/95 backdrop-blur-md border-r border-border">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <span className="text-left text-sm font-body tracking-widest uppercase text-muted-foreground">
              {t("nav.menu")}
            </span>
            <button onClick={() => setMobileOpen(false)} aria-label={t("nav.aria.closeMenu")} className="text-foreground hover:text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-1 font-body text-sm tracking-widest uppercase text-muted-foreground">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.to}>
                  <button
                    onClick={() => setMobileBouquetOpen(!mobileBouquetOpen)}
                    aria-expanded={mobileBouquetOpen}
                    className="w-full flex items-center justify-between transition-colors py-2 border-b border-border hover:text-primary"
                  >
                    {link.label} <ChevronDown className={`w-3 h-3 transition-transform ${mobileBouquetOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`pl-4 py-2 space-y-3 ${mobileBouquetOpen ? "" : "hidden"}`}>
                    {bouquetGroups.map((group, gi) => (
                      <div key={gi} className="flex flex-col">
                        {group.titleTo ? (
                          <Link
                            href={group.titleTo}
                            onClick={() => setMobileOpen(false)}
                            className="block py-1 text-[11px] tracking-widest uppercase font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {group.title}
                          </Link>
                        ) : (
                          <span className="block py-1 text-[11px] tracking-widest uppercase font-semibold text-foreground">
                            {group.title}
                          </span>
                        )}
                        <div className="pl-3 flex flex-col">
                          {group.items.map((sub, i) => (
                            <Link key={i} href={sub.to} onClick={() => setMobileOpen(false)} className="block py-1.5 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors">
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.to} href={link.to} onClick={() => setMobileOpen(false)} className="hover:text-primary transition-colors py-2 border-b border-border last:border-b-0">
                  {link.label}
                </Link>
              )
            ))}

            {/* Mobile language toggle */}
            <button
              onClick={() => { toggleLang(); setMobileOpen(false); }}
              aria-label={t("nav.aria.changeLanguage")}
              className="flex items-center gap-2 hover:text-primary transition-colors py-2 mt-1"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "English" : "Español"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
