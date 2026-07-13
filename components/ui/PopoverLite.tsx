"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Minimal controlled popover (no Radix): anchored panel below the trigger,
 * closes on outside click / Escape. Visuals match the SPA's shadcn
 * PopoverContent (border, bg-card, shadow, rounded).
 */
interface PopoverLiteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  align?: "start" | "center";
}

const PopoverLite = ({ open, onOpenChange, trigger, children, contentClassName, align = "start" }: PopoverLiteProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) onOpenChange(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={rootRef} className="relative">
      {trigger}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-auto rounded-md border border-border bg-card text-foreground shadow-md",
            align === "center" ? "left-1/2 -translate-x-1/2" : "left-0",
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default PopoverLite;
