/**
 * /collections/same-day-delivery — NEW transactional page (SPEC §4).
 *
 * "same day flower delivery" = 90,500 monthly searches and the page did NOT
 * exist (only the informational /delivery). This is the transactional
 * version: real product grid + the REAL delivery facts already published on
 * the site (order before 3PM · up to 90 miles · $25 flat 0–5 mi · $1.60/mile
 * after · free pickup at 7257 NW 12th St · Mon–Sat · FedEx nationwide beyond
 * 87 mi). NOTHING here is invented — every number ships today on
 * amorelialuxuryfloral.com (delivery page, homepage FAQs, Service schema).
 */
import type { OccasionPage } from "@/lib/occasionPagesData";

export const sameDayDeliveryPage: OccasionPage = {
  slug: "same-day-delivery",
  slugEs: "entrega-el-mismo-dia",
  tier: 1,
  keyword: { en: "same day flower delivery", es: "flores a domicilio el mismo día" },
  keyword2: { en: "same day flower delivery miami", es: "entrega de flores el mismo día en miami" },
  h1: { en: "Same-Day Flower Delivery Miami", es: "Flores a Domicilio el Mismo Día en Miami" },
  title: {
    en: "Same-Day Flower Delivery Miami | Order by 3PM | Amorelia Luxury Floral Gifts",
    es: "Flores a Domicilio el Mismo Día en Miami | Pide antes de las 3PM | Amorelia Luxury Floral Gifts",
  },
  description: {
    en: "Same day flower delivery in Miami — order before 3PM and your roses arrive today, up to 90 miles. $25 flat rate 0-5 miles. Shop bouquets ready for same-day delivery.",
    es: "Flores a domicilio el mismo día en Miami — pide antes de las 3PM y tus rosas llegan hoy, hasta 90 millas. Tarifa plana de $25 en 0-5 millas. Compra ramos listos para entrega hoy.",
  },
  intro: {
    en: "Need same day flower delivery in Miami? Every bouquet below is hand-tied the same morning and delivered across Miami up to 90 miles — order before 3PM and it arrives today. Prefer to swing by? Free pickup at 7257 NW 12th St, Miami, FL 33126.",
    es: "¿Necesitas flores a domicilio el mismo día en Miami? Cada ramo de abajo se monta a mano esa misma mañana y se entrega por todo Miami hasta 90 millas — pide antes de las 3PM y llega hoy. ¿Prefieres pasar a recogerlo? Recogida gratis en 7257 NW 12th St, Miami, FL 33126.",
  },
  sections: [
    {
      h2: {
        en: "How same-day delivery works",
        es: "Cómo funciona la entrega el mismo día",
      },
      body: {
        en: "Order before 3PM Miami time with a minimum 2-hour preparation window and we deliver the same day, Monday to Saturday. At checkout you pick the delivery date and a preferred time window; our own drivers cover the full 90-mile radius around the shop.",
        es: "Pide antes de las 3PM hora de Miami con una ventana mínima de preparación de 2 horas y entregamos ese mismo día, de lunes a sábado. En el checkout eliges la fecha y una franja horaria preferida; nuestros propios repartidores cubren el radio completo de 90 millas alrededor de la tienda.",
      },
    },
    {
      h2: {
        en: "Same-day delivery cost in Miami",
        es: "Cuánto cuesta la entrega el mismo día en Miami",
      },
      body: {
        en: "$25 flat rate for 0-5 miles and $1.60 per mile from 5 to 90 miles — the exact price is calculated live from your address before you pay, no surprises. In-store pickup is always free.",
        es: "Tarifa plana de $25 para 0-5 millas y $1.60 por milla de 5 a 90 millas — el precio exacto se calcula en vivo con tu dirección antes de pagar, sin sorpresas. La recogida en tienda siempre es gratis.",
      },
    },
    {
      h2: {
        en: "Outside Miami? We ship nationwide with FedEx",
        es: "¿Fuera de Miami? Enviamos a todo el país con FedEx",
      },
      body: {
        en: "Beyond 90 miles your bouquet travels overnight in our insulated FedEx box anywhere in the US. Enter the recipient's address on any product page and the real FedEx rates appear instantly.",
        es: "Más allá de 90 millas tu ramo viaja overnight en nuestra caja aislada de FedEx a cualquier punto de EE. UU. Introduce la dirección del destinatario en cualquier ficha de producto y las tarifas reales de FedEx aparecen al instante.",
      },
    },
  ],
};
