"use client"

// shared/ui/button/button.tsx
import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-rufo-primary text-white hover:bg-rufo-primary-hover disabled:bg-rufo-primary/50",
  secondary: "bg-rufo-surface text-rufo-text border border-rufo-border hover:bg-rufo-border/40",
  ghost: "bg-transparent text-rufo-primary hover:bg-rufo-primary/10",
};

export function Button({ variant = "primary", isLoading = false, disabled, children, className = "", ...rest }: Props) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
      )}
      {children}
    </button>
  );
}
