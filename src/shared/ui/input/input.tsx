"use client"

// shared/ui/input/input.tsx
import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, id, className = "", ...rest },
  ref
) {
  const inputId = id ?? rest.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-rufo-text">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`rounded-lg border px-3 py-2.5 text-sm text-rufo-text outline-none transition-colors placeholder:text-rufo-text-muted focus:border-rufo-primary ${
          error ? "border-red-400" : "border-rufo-border"
        } ${className}`}
        aria-invalid={!!error}
        {...rest}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
