"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

interface Props {
  src: string;
  title: string;
  /** Classes for the iframe/placeholder (kept identical to the old inline iframe). */
  className?: string;
  allowFullScreen?: boolean;
  /** Short localized word shown in the placeholder ("Map" / "Mapa"). */
  placeholderLabel?: string;
}

/**
 * Facade for the Google Maps embed. The Maps iframe pulls ~300KB of JS the
 * moment it loads, so we render a lightweight placeholder and only mount the
 * real iframe once it scrolls near the viewport (IntersectionObserver,
 * 300px margin). This keeps Google Maps entirely off the initial load — a
 * real LCP/JS win, especially on desktop — with no UX loss: by the time the
 * user reaches the map it's already there.
 */
const LazyMapEmbed = ({
  src,
  title,
  className = "",
  allowFullScreen = false,
  placeholderLabel = "Map",
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  if (show) {
    return (
      <iframe
        title={title}
        src={src}
        className={className}
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen={allowFullScreen}
      />
    );
  }

  return (
    <div
      ref={ref}
      className={`${className} flex items-center justify-center bg-muted text-muted-foreground`}
      role="img"
      aria-label={title}
    >
      <span className="flex items-center gap-2 font-body text-xs">
        <MapPin className="h-4 w-4" />
        {placeholderLabel}
      </span>
    </div>
  );
};

export default LazyMapEmbed;
