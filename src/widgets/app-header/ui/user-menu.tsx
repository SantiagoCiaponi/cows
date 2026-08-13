"use client"

// widgets/app-header/ui/user-menu.tsx
import { useEffect, useRef, useState } from "react";
import type { User } from "@/entities/user";
import { useLogout } from "@/features/auth";

function getInitials(user: User) {
  return `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase();
}

export function UserMenu({ user }: { user: User }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-rufo-border/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rufo-primary text-sm font-semibold text-white">
          {getInitials(user)}
        </span>
        <span className="hidden flex-col items-start leading-tight sm:flex">
          <span className="text-sm font-medium text-rufo-text">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-xs text-rufo-text-muted">{user.email}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 text-rufo-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-xl border border-rufo-border bg-rufo-surface shadow-lg">
          <div className="border-b border-rufo-border px-4 py-3 sm:hidden">
            <p className="text-sm font-medium text-rufo-text">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-rufo-text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="block w-full px-4 py-2.5 text-left text-sm text-rufo-text hover:bg-rufo-border/40"
          >
            Cerrar sesion
          </button>
        </div>
      )}
    </div>
  );
}
