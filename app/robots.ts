import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

/** robots.txt — same rules as the live site, pointing at the dynamic sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/es/checkout",
        "/cart",
        "/es/cart",
        "/account",
        "/es/account",
        "/studio/",
      ],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
