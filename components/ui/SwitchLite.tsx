"use client";

import { cn } from "@/lib/utils";

/**
 * Minimal switch (no Radix) with the shadcn Switch visuals: 44×24 track,
 * sliding thumb, primary when checked.
 */
interface SwitchLiteProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

const SwitchLite = ({ checked, onCheckedChange, disabled, "aria-label": ariaLabel }: SwitchLiteProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={ariaLabel}
    disabled={disabled}
    onClick={() => !disabled && onCheckedChange(!checked)}
    className={cn(
      "inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
      checked ? "bg-primary" : "bg-input",
      disabled && "cursor-not-allowed opacity-50",
    )}
  >
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
        checked ? "translate-x-5" : "translate-x-0",
      )}
    />
  </button>
);

export default SwitchLite;
