import type { Metadata } from "next";
import BlogIndexView, { blogMetadata } from "@/views/blog";

export const revalidate = 600;

export function generateMetadata(): Metadata {
  return blogMetadata("es");
}

export default function BlogPageEs() {
  return <BlogIndexView language="es" />;
}
