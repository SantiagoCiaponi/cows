// shared/ui/card/card.tsx
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: Props) {
  return (
    <div className={`rounded-lg border border-rufo-border-device bg-rufo-surface p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
