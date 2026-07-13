import type { Metadata } from "next";
import BlogArticleView, { blogArticleMetadata, blogArticleStaticParams } from "@/views/blogArticle";

export const revalidate = 600;
// New posts published in Sanity must resolve without a rebuild (ISR).
export const dynamicParams = true;

export const generateStaticParams = blogArticleStaticParams("en");

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return blogArticleMetadata(slug, "en");
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogArticleView slug={slug} language="en" />;
}
