import { Flower2, ShieldCheck, Truck, HeartHandshake } from "lucide-react";
import type { Language } from "@/i18n";

/**
 * Trust/guarantee badges block — AFTER the product accordion on every ficha.
 *
 * NADA INVENTADO: all four claims are validated business facts —
 * fresh premium roses, secure Shopify checkout, same-day delivery (order
 * before 3PM), hand-arranged by the local Miami shop. Flowers are perishable:
 * NO invented duration guarantees ("30-day" etc.) here, ever.
 */
const ProductGuaranteeBadges = ({ language = "en" }: { language?: Language }) => {
  const isEs = language === "es";
  const badges: Array<{ Icon: typeof Flower2; title: string; desc: string }> = [
    {
      Icon: Flower2,
      title: isEs ? "Rosas frescas premium" : "Fresh Premium Roses",
      desc: isEs ? "Máxima frescura en cada ramo" : "Maximum freshness in every bouquet",
    },
    {
      Icon: ShieldCheck,
      title: isEs ? "Pago seguro" : "Secure Payment",
      desc: isEs ? "Checkout cifrado de Shopify" : "Encrypted Shopify checkout",
    },
    {
      Icon: Truck,
      title: isEs ? "Entrega el mismo día" : "Same-Day Delivery",
      desc: isEs ? "Pide antes de las 3PM en Miami" : "Order before 3PM in Miami",
    },
    {
      Icon: HeartHandshake,
      title: isEs ? "Hecho a mano en Miami" : "Hand-Arranged in Miami",
      desc: isEs ? "Por nuestra floristería local" : "By our local Miami flower shop",
    },
  ];

  return (
    <section className="mt-12 lg:mt-16 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {badges.map(({ Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center px-2 py-5 rounded-xl border border-border bg-card"
          >
            <span className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-primary" strokeWidth={1.75} />
            </span>
            <p className="font-display text-sm font-semibold text-foreground leading-snug">{title}</p>
            <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGuaranteeBadges;
