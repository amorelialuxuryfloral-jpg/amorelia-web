import { List } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TocItem {
  /** Target element id (must match the `id` on the section/heading). */
  id: string;
  /** Visible label in the navigable index. */
  label: string;
}

interface TableOfContentsProps {
  items: TocItem[];
  /** Heading shown above the index ("On this page" / "En esta página"). */
  heading: string;
  className?: string;
}

/**
 * Navigable in-page index (anchor jump-links) for long collection pages —
 * Server Component (real <a> anchors in the HTML). Ported 1:1 from the SPA.
 * Target sections must carry `scroll-mt-28` to clear the fixed navbar.
 */
const TableOfContents = ({ items, heading, className }: TableOfContentsProps) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={heading}
      className={cn(
        "bg-cream/60 border border-border rounded-lg p-4 md:p-5 mb-10",
        className,
      )}
    >
      <p className="flex items-center gap-2 font-body text-[10px] tracking-widest uppercase text-muted-foreground mb-3">
        <List className="w-3.5 h-3.5" />
        {heading}
      </p>
      <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="font-body text-sm text-primary hover:underline underline-offset-2"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default TableOfContents;
