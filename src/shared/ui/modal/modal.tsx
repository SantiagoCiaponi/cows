"use client"

// shared/ui/modal/modal.tsx
import type { ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  title: string;
  children: ReactNode;
  onCloseAction: () => void;
}

export function Modal({ title, children, onCloseAction }: Props) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4" onClick={onCloseAction}>
      <div
        className="w-full max-w-md rounded-2xl bg-rufo-surface p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-rufo-text">{title}</h2>
        {children}
      </div>
    </div>,
    document.body
  );
}
