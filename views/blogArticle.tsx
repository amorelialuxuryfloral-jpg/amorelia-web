import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd, { blogPostingSchema, breadcrumbSchema } from "@/components/JsonLd";
import PortableTextBody from "@/components/PortableTextBody";
import { fetchBlogPost, fetchBlogPosts, urlFor, type BlogPostFull } from "@/lib/sanity";
import { retiredBlogSlugs } from "@/lib/blogData";
import { landingPages } from "@/lib/landingPagesData";
import { resolveBlogInterlinks } from "@/lib/blogInterlinks";
import { buildMetadata, BASE_URL } from "@/lib/seo";
import { getTranslator, localizePath, type Language } from "@/i18n";

/**
 * /blog/[slug] + /es/blog/[slug] — SPA port (pages/BlogArticle.tsx), fully
 * server-rendered: the Sanity post body (PortableText) arrives as real HTML.
 *
 * Resolution (server-side, replacing the SPA's client redirects):
 *  - Retired slugs → 301 to /blog.
 *  - Unknown slug → real 404.
 *  - EN/ES posts have DIFFERENT slugs. A post requested under the wrong
 *    language tree 301s to its translation (translationSlug) when it exists,
 *    otherwise to its own-language URL — same consolidation as the SPA.
 */

export function blogArticleStaticParams(language: Language) {
  return async (): Promise<Array<{ slug: string }>> => {
    try {
      const posts = await fetchBlogPosts(language);
      return posts.map((p) => ({ slug: p.slug.current }));
    } catch {
      return []; // Sanity unreachable at build → resolve at request time (ISR).
    }
  };
}

/** Shared resolution — returns the article only when it belongs to this tree. */
async function resolveArticle(slug: string, language: Language): Promise<
  | { kind: "article"; article: BlogPostFull }
  | { kind: "redirect"; to: string }
  | { kind: "notFound" }
> {
  if (retiredBlogSlugs.includes(slug)) {
    return { kind: "redirect", to: localizePath("/blog", language) };
  }
  const article = await fetchBlogPost(slug);
  if (!article) return { kind: "notFound" };

  if (article.language !== language) {
    if (article.translationSlug) {
      return { kind: "redirect", to: localizePath(`/blog/${article.translationSlug}`, language) };
    }
    return {
      kind: "redirect",
      to: localizePath(`/blog/${article.slug.current}`, article.language as Language),
    };
  }
  return { kind: "article", article };
}

export async function blogArticleMetadata(slug: string, language: Language): Promise<Metadata> {
  const res = await resolveArticle(slug, language);
  if (res.kind !== "article") return { robots: { index: false, follow: false } };
  const article = res.article;

  const imageUrl = urlFor(article.mainImage).width(1200).height(675).fit("crop").auto("format").url();
  const title = article.seoTitle || `${article.title} | Amorelia Luxury Floral Gifts Miami`;
  const description = article.seoDescription || article.excerpt;

  if (language === "en") {
    // EN post: hreflang to the ES translation only when it exists.
    return buildMetadata({
      title,
      description,
      path: `/blog/${article.slug.current}`,
      pathEs: article.translationSlug ? `/blog/${article.translationSlug}` : undefined,
      language: "en",
      image: imageUrl,
      type: "article",
      noAlternateEs: !article.translationSlug,
    });
  }

  if (article.translationSlug) {
    // ES post with an EN twin: full reciprocal hreflang pair.
    return buildMetadata({
      title,
      description,
      path: `/blog/${article.translationSlug}`,
      pathEs: `/blog/${article.slug.current}`,
      language: "es",
      image: imageUrl,
      type: "article",
    });
  }

  // ES-only post: self-canonical under /es, no EN alternate (none exists).
  const esUrl = `${BASE_URL}/es/blog/${article.slug.current}`;
  return {
    title,
    description,
    alternates: { canonical: esUrl },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: esUrl,
      type: "article",
      siteName: "Amorelia Luxury Floral Gifts",
      locale: "es_US",
      images: [{ url: imageUrl }],
    },
    twitter: { card: "summary_large_image", site: "@amorelialuxuryfloral", title, description, images: [imageUrl] },
  };
}

export default async function BlogArticleView({
  slug,
  language,
}: {
  slug: string;
  language: Language;
}) {
  const res = await resolveArticle(slug, language);
  if (res.kind === "redirect") permanentRedirect(res.to);
  if (res.kind === "notFound") notFound();
  const article = res.article;

  const { t } = getTranslator(language);
  const isEs = language === "es";
  const l = (path: string) => localizePath(path, language);
  const base = isEs ? `${BASE_URL}/es` : BASE_URL;

  const imageUrl = urlFor(article.mainImage).width(1200).height(675).fit("crop").auto("format").url();
  const langCode = isEs ? "es-US" : "en-US";
  const canonicalUrl = `${base}/blog/${article.slug.current}`;

  // Resolve related landings (slug → human title via landingPages).
  const relatedLandings = (article.relatedLandings ?? [])
    .map((relSlug) => {
      const lp = landingPages.find((p) => p.slug === relSlug);
      return lp ? { slug: relSlug, label: lp.h1.replace(/ [|–—].*/g, "").trim() } : null;
    })
    .filter((x): x is { slug: string; label: string } => x !== null);

  // Logic-driven internal linking: blog article → affine on-site categories,
  // ordered low → high search volume (chain logic), ending at the main category.
  const interlinkHints = [
    ...((article.categories ?? []).map((c) => c.slug?.current).filter(Boolean) as string[]),
    ...((article.relatedLandings ?? []) as string[]),
  ];
  const categoryInterlinks = resolveBlogInterlinks(interlinkHints, language);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={[
          blogPostingSchema({
            headline: article.title,
            slug: article.slug.current,
            datePublished: article.publishedAt,
            dateModified: article.updatedAt,
            image: imageUrl,
            description: article.seoDescription || article.excerpt,
            author: article.author || "Amorelia Luxury Floral Gifts",
            inLanguage: langCode,
            url: canonicalUrl,
          }),
          breadcrumbSchema([
            { name: t("sitemap.links.home"), url: `${base}/` },
            { name: "Blog", url: `${base}/blog` },
            { name: article.title, url: canonicalUrl },
          ]),
        ]}
      />
      <div className="pt-24 pb-16" lang={language}>
        <div className="container mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: t("sitemap.links.home"), to: l("/") },
              { label: t("sitemap.links.blog"), to: l("/blog") },
              { label: article.title },
            ]}
          />

          <article className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="font-body text-xs text-muted-foreground mb-2">
                {new Date(article.publishedAt).toLocaleDateString(isEs ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <h1 className="font-title-retro text-3xl md:text-4xl text-foreground mb-4">{article.title}</h1>
              {article.excerpt && (
                <p className="font-body text-lg text-muted-foreground leading-relaxed">{article.excerpt}</p>
              )}
            </div>

            <div className="relative overflow-hidden rounded-lg mb-10 aspect-video bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={article.mainImage.alt || `${article.title} – Amorelia Luxury Floral Gifts Miami`}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                width={1200}
                height={675}
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="prose prose-lg max-w-none font-body text-foreground
              [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4
              [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-5
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul>li]:text-muted-foreground [&_ul>li]:mb-2
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol>li]:text-muted-foreground [&_ol>li]:mb-2
              [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6"
            >
              <PortableTextBody value={article.body} language={language} />
            </div>

            {relatedLandings.length > 0 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  {t("blogArticle.relatedZones")}
                </h2>
                <ul className="space-y-2">
                  {relatedLandings.map((rel) => (
                    <li key={rel.slug}>
                      {/* Landing pages are EN-only canonicals — link them unlocalized. */}
                      <Link href={`/${rel.slug}`} className="text-primary hover:underline font-body">
                        → {rel.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Interlinking blog → categoría afín (lógica de cadena / PageRank). */}
            {categoryInterlinks.length > 1 && (
              <section className="mt-12 pt-8 border-t border-border">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  {isEs ? "Colecciones relacionadas" : "Related collections"}
                </h2>
                <ul className="space-y-2 font-body">
                  {categoryInterlinks.map((link) => (
                    <li key={link.to}>
                      <Link href={link.to} className="text-primary hover:underline">
                        → {link.anchor}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Sigue leyendo — siempre visible, enlaza a colecciones clave */}
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                {isEs ? "Sigue explorando" : "Keep exploring"}
              </h2>
              <ul className="space-y-2 font-body">
                <li>
                  <Link href={l("/bouquets")} className="text-primary hover:underline">
                    → {isEs ? "Ver todos los ramos" : "Browse all bouquets"}
                  </Link>
                </li>
                <li>
                  <Link href={l("/bouquets/personalizar")} className="text-primary hover:underline">
                    → {isEs ? "Crear ramo personalizado" : "Build a custom bouquet"}
                  </Link>
                </li>
                <li>
                  <Link href={l("/delivery")} className="text-primary hover:underline">
                    → {isEs ? "Envío en Miami" : "Miami flower delivery"}
                  </Link>
                </li>
                <li>
                  <Link href={l("/blog")} className="text-primary hover:underline">
                    → {isEs ? "Volver al blog" : "Back to the blog"}
                  </Link>
                </li>
              </ul>
            </section>
          </article>
        </div>
      </div>
    </div>
  );
}
