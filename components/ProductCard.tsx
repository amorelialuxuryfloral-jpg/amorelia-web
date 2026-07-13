import Link from "next/link";
import { cardSized } from "@/lib/shopifyCatalog";

/**
 * Collection-grid product card — Server Component.
 *
 * Same markup/design as the SPA's BouquetProducts card + BouquetCardImage
 * (hover-swap is pure CSS: primary fades out, secondary fades in on md+),
 * but the live Shopify price/images arrive as props fetched on the server —
 * they are IN the HTML (no price flash, valid ItemList offers).
 */
interface ProductCardProps {
  href: string;
  name: string;
  /** Visible title override (defaults to name). */
  title?: string;
  imagePrimary?: string;
  imageSecondary?: string;
  /** Real price (live Shopify min price, or catalog fallback). */
  price: number;
  fromLabel: string;
  /** Compact variant used by "You Might Also Love". */
  compact?: boolean;
  enableHoverSwap?: boolean;
  /**
   * HTML tag for the card title. Defaults to "h3" (valid when the grid sits
   * under an H2, e.g. "You might also love"). Collection views whose grid
   * hangs directly off the H1 pass "p" so the outline never skips H1→H3 —
   * identical classes, identical look, just not a document heading.
   */
  titleAs?: "h3" | "p";
}

const ProductCard = ({
  href,
  name,
  title,
  imagePrimary,
  imageSecondary,
  price,
  fromLabel,
  compact = false,
  enableHoverSwap = true,
  titleAs: TitleTag = "h3",
}: ProductCardProps) => {
  const primary = cardSized(imagePrimary);
  const secondary = cardSized(imageSecondary);
  return (
    <Link href={href} className="group block">
      <div className={`relative overflow-hidden rounded-lg ${compact ? "mb-3" : "mb-4"} aspect-square bg-muted`}>
        {primary ? (
          <>
            <img
              src={primary}
              alt={`${name} Miami – Amorelia Luxury Floral Gifts`}
              loading="lazy"
              width={400}
              height={400}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                secondary && enableHoverSwap ? "md:group-hover:opacity-0" : ""
              }`}
            />
            {secondary && enableHoverSwap && (
              <img
                src={secondary}
                alt={`${name} rose bouquet — back view, Miami same-day delivery`}
                loading="lazy"
                width={400}
                height={400}
                className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-all duration-700 md:group-hover:scale-105 hidden md:block"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-4xl text-muted-foreground/30">🌹</span>
          </div>
        )}
        <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
      </div>
      <TitleTag className={`font-display ${compact ? "text-sm" : "text-lg"} font-semibold text-foreground text-center`}>
        {title || name}
      </TitleTag>
      <p className={`text-primary font-body ${compact ? "text-xs mt-1" : "text-sm mt-2"} font-semibold text-center`}>
        {fromLabel} ${price}
      </p>
    </Link>
  );
};

export default ProductCard;
