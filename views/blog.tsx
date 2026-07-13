import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { breadcrumbSchema } from "@/components/JsonLd";
import { fetchBlogPosts, urlFor } from "@/lib/sanity";
import { buildMetadata } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * /blog + /es/blog — SPA port (pages/Blog.tsx), server-rendered: the post
 * list is fetched from Sanity ON THE SERVER so cards arrive as real HTML
 * with real <a> links (the SPA showed a spinner). Copy (rich intro EN/ES)
 * is verbatim from the SPA — validated, not invented.
 */

const BASE_URL = "https://amorelialuxuryfloral.com";

const blogCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${BASE_URL}/blog#blog`,
  name: "The Amorelia Luxury Floral Gifts Blog",
  description:
    "Miami floral insights, delivery guides, wedding inspiration, event planning tips and rose care advice from Amorelia Luxury Floral Gifts.",
  url: `${BASE_URL}/blog`,
  publisher: { "@id": `${BASE_URL}/#localbusiness` },
  inLanguage: "en-US",
};

export function blogMetadata(language: Language): Metadata {
  const { t } = getTranslator(language);
  return buildMetadata({
    title: t("seo.blog.title"),
    description: t("seo.blog.description"),
    path: "/blog",
    language,
  });
}

export default async function BlogIndexView({ language }: { language: Language }) {
  const { t } = getTranslator(language);
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);
  const posts = await fetchBlogPosts(language);
  const base = isEs ? `${BASE_URL}/es` : BASE_URL;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          blogCollectionSchema,
          breadcrumbSchema([
            { name: t("nav.home"), url: `${base}/` },
            { name: "Blog", url: `${base}/blog` },
          ]),
        ]}
      />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <Breadcrumbs items={[{ label: t("nav.home"), to: l("/") }, { label: t("nav.blog") }]} />

          <header className="text-center mb-10 max-w-3xl mx-auto">
            <h1 className="font-title-retro text-4xl md:text-5xl text-foreground">
              {isEs
                ? "El Blog de Amorelia Luxury Floral Gifts — Guías e Ideas Florales de Miami"
                : "The Amorelia Luxury Floral Gifts Blog — Miami Floral Insights & Guides"}
            </h1>
            <p className="text-muted-foreground font-body mt-4 text-base">
              {t("blogPage.subtitle")}
            </p>
          </header>

          {/* Rich intro — turns /blog into a real landing instead of a thin index */}
          <section className="max-w-3xl mx-auto mb-14 font-body text-foreground/90 leading-relaxed space-y-4">
            {isEs ? (
              <>
                <p>
                  Bienvenido al blog de Amorelia Luxury Floral Gifts — un cuaderno de trabajo desde dentro
                  del mundo floral de lujo de Miami. Somos una floristería familiar ubicada en
                  7257 NW 12th St, y entregamos ramos de rosas personalizados, decoración de
                  espacios y arreglos para eventos por todo Miami-Dade, hasta 90 millas desde
                  nuestra tienda. En este blog compartimos todo lo que aprendemos día a día: qué
                  flores están de temporada, qué tamaños de ramo funcionan para cada ocasión,
                  cómo programar un pedido para el mismo día antes de nuestro cierre de las 3 PM,
                  y cómo planificar las flores teniendo en cuenta el calor, la humedad y el
                  tráfico de Miami.
                </p>
                <p>
                  Encontrarás guías prácticas sobre el{" "}
                  <Link href="/es/delivery" className="text-primary hover:underline">
                    envío de flores en Miami
                  </Link>{" "}
                  — incluyendo cómo funciona nuestra tarifa plana de $25 (0–5 mi) + $1.60/milla,
                  qué barrios cubrimos el mismo día, y cómo gestionamos Fisher Island,
                  hospitales, hoteles y edificios de gran altura en Brickell o Miami Beach.
                  También cubrimos la organización de bodas y eventos: formas de ramo para la
                  novia, centros de mesa, arcos, montajes para gender reveal y el ajetreo
                  bilingüe del Día de la Madre. Para las quinceañeras — todavía una de las
                  celebraciones más grandes de Miami — compartimos paletas de colores,
                  simbolismo tradicional y cómo coordinar las flores con el vestido y el lugar.
                </p>
                <p>
                  Más allá de los eventos, publicamos contenido sobre cuidado floral: cómo hacer
                  que las rosas duren más en el clima de Miami, la diferencia entre los acabados
                  naturales, con glitter y pintados, y cuándo un ramo personalizado desde nuestro{" "}
                  <Link href="/es/bouquets/personalizar" className="text-primary hover:underline">
                    creador con IA
                  </Link>{" "}
                  tiene más sentido que uno prediseñado del{" "}
                  <Link href="/es/bouquets" className="text-primary hover:underline">
                    catálogo principal
                  </Link>
                  . Espera recomendaciones específicas por barrio (Coral Gables vs. Wynwood vs.
                  Doral), guías por ocasión y notas honestas sobre lo que funciona — escritas por
                  las personas que realmente arreglan y entregan las flores, no por una granja de
                  contenido con IA.
                </p>
              </>
            ) : (
              <>
                <p>
                  Welcome to the Amorelia Luxury Floral Gifts blog — a working notebook from inside Miami&apos;s
                  luxury floral scene. We&apos;re a family-run florist based at 7257 NW 12th St,
                  delivering custom rose bouquets, room decorations and event arrangements across
                  all of Miami-Dade up to 90 miles from our shop. This blog is where we share
                  everything we learn day to day: what&apos;s actually in season, which bouquet sizes
                  work for which occasions, how to time a same-day order before our 3 PM cutoff,
                  and how to plan flowers around Miami&apos;s heat, humidity and traffic.
                </p>
                <p>
                  You&apos;ll find practical guides on{" "}
                  <Link href="/delivery" className="text-primary hover:underline">
                    flower delivery in Miami
                  </Link>{" "}
                  — including how our flat $25 (0–5 mi) + $1.60/mile pricing works, which
                  neighborhoods we cover same-day, and how we handle Fisher Island, hospitals,
                  hotels and high-rise buildings in Brickell or Miami Beach. We also cover
                  wedding and event planning: bouquet shapes for the bride, centerpieces, arches,
                  gender reveal setups and the bilingual Mother&apos;s Day rush. For quinceañeras —
                  still one of Miami&apos;s biggest celebrations — we share color palettes, traditional
                  symbolism and how to coordinate flowers with the dress and venue.
                </p>
                <p>
                  Beyond events, we publish floral care content: how to make roses last longer in
                  Miami&apos;s climate, the difference between natural, glitter and painted finishes,
                  and when a custom bouquet from our{" "}
                  <Link href="/bouquets/personalizar" className="text-primary hover:underline">
                    AI-powered builder
                  </Link>{" "}
                  makes more sense than a pre-designed one from the{" "}
                  <Link href="/bouquets" className="text-primary hover:underline">
                    main catalog
                  </Link>
                  . Expect neighborhood-specific recommendations (Coral Gables vs. Wynwood vs.
                  Doral), occasion guides, and honest notes on what works — written by the people
                  who actually arrange and deliver the flowers, not by an AI content farm.
                </p>
              </>
            )}
          </section>

          {/* Evergreen guides — static informational pillars (CORRECCIONES
              puntos 20/32): real inlinks so the guides are never orphans.
              EN-only canonicals → EN hrefs in both trees. */}
          <section className="max-w-5xl mx-auto mb-14">
            <h2 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-4 text-center">
              {isEs ? "Guías permanentes" : "Evergreen guides"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { href: "/birth-flowers-by-month", label: isEs ? "Flores de nacimiento por mes" : "Birth flowers by month" },
                { href: "/flowers-by-zodiac-sign", label: isEs ? "Flores por signo del zodiaco" : "Flowers by zodiac sign" },
                { href: "/flowers-that-represent-death", label: isEs ? "Flores que representan el luto" : "Flowers that represent death" },
                { href: "/how-to-preserve-roses", label: isEs ? "Cómo preservar rosas" : "How to preserve roses" },
              ].map((g) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className="block bg-cream/50 hover:bg-cream rounded-md px-4 py-3 font-body text-sm text-foreground hover:text-primary transition-colors text-center"
                >
                  {g.label}
                </Link>
              ))}
            </div>
          </section>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {posts.map((article) => (
                <Link
                  key={article._id}
                  href={l(`/blog/${article.slug.current}`)}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-video bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={urlFor(article.mainImage).width(800).height(450).fit("crop").auto("format").url()}
                      alt={article.mainImage.alt || `${article.title} – Amorelia Luxury Floral Gifts Miami`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={500}
                      height={280}
                    />
                    <div className="absolute inset-0 bg-foreground/5 group-hover:bg-foreground/15 transition-colors" />
                  </div>
                  <p className="font-body text-xs text-muted-foreground mb-1">
                    {new Date(article.publishedAt).toLocaleDateString(isEs ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                  <h2 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {article.title}
                  </h2>
                  <p className="font-body text-sm text-muted-foreground mb-3">{article.excerpt}</p>
                  <span className="font-body text-xs text-primary tracking-widest uppercase inline-flex items-center gap-1">
                    {t("blogPage.readMore")} <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center py-10 border-t border-border">
              <p className="font-body text-muted-foreground">
                {isEs ? "Pronto llegarán nuevos artículos. Mientras tanto, síguenos en " : "Fresh articles coming soon. Follow us on "}
                <a
                  href="https://www.instagram.com/amorelialuxuryfloral"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Instagram
                </a>
                {isEs ? " para ver el detrás de cámaras." : " for behind-the-scenes posts in the meantime."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
