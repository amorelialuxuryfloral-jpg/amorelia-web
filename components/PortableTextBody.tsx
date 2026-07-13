import Link from "next/link";
import { PortableText, type PortableTextComponents, type PortableTextBlock } from "@portabletext/react";
import { urlFor, type SanityImage } from "@/lib/sanity";
import { localizePath, type Language } from "@/i18n";

/**
 * Server-rendered Portable Text body for blog articles (SPA port of the
 * portableTextComponents in BlogArticle.tsx). No hooks → renders in a Server
 * Component, so the whole post arrives as real HTML.
 *
 *  - Body H1s are demoted to H2 (single H1 per page = the post title).
 *  - External links: new tab + noopener. Internal links: same tab, localized
 *    to the active language (the SPA's LocalizedRouter did this client-side).
 */
const buildComponents = (language: Language): PortableTextComponents => ({
  types: {
    image: ({ value }: { value: SanityImage & { caption?: string } }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).auto("format").quality(80).url();
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={value.alt || "Amorelia Luxury Floral Gifts Miami"}
            className="w-full rounded-lg"
            loading="lazy"
            decoding="async"
          />
          {value.caption && (
            <figcaption className="text-xs text-muted-foreground mt-2 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    // Force a single H1 per page (the post title). Any H1 used inside the
    // body in Sanity is demoted to H2 so SEO stays clean.
    h1: ({ children }) => (
      <h2 className="font-display text-2xl font-semibold text-foreground mt-10 mb-4">{children}</h2>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-6 text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href ?? "#";
      const isExternal =
        /^https?:\/\//i.test(href) && !/(^|\.)amorelialuxuryfloral\.com/i.test(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            {children}
          </a>
        );
      }
      // Internal link — real <a> in the server HTML, brand color, localized.
      const path = href.replace(/^https?:\/\/[^/]+/, "");
      return (
        <Link
          href={localizePath(path || "/", language)}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {children}
        </Link>
      );
    },
  },
});

const PortableTextBody = ({
  value,
  language,
}: {
  value: PortableTextBlock[];
  language: Language;
}) => <PortableText value={value} components={buildComponents(language)} />;

export default PortableTextBody;
