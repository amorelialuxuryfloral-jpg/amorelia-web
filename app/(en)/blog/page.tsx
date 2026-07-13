import type { Metadata } from "next";
import BlogIndexView, { blogMetadata } from "@/views/blog";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  return blogMetadata("en");
}

export default function BlogPage() {
  return <BlogIndexView language="en" />;
}
