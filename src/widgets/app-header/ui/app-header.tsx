// widgets/app-header/ui/app-header.tsx
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/entities/user";
import { UserMenu } from "./user-menu";

const NAV_ITEMS = [
  { label: "Inicio", href: "/home" },
  { label: "Campos", href: "/campos" },
  { label: "Rodeos", href: "/campos" },
  { label: "Animales", href: "/campos" },
  { label: "Prerregistro", href: "/prerregistro" },
];

export function AppHeader({ user }: { user: User }) {
  return (
    <header className="border-b border-rufo-border bg-rufo-surface px-4 py-0 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/home" className="flex items-center">
            <Image src="/logo.png" alt="Rufo" width={1973} height={725} className="h-16 w-auto opacity-90" priority />
          </Link>
          <nav className="hidden items-center gap-6 sm:flex">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-rufo-text-muted transition-colors hover:text-rufo-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <UserMenu user={user} />
      </div>
    </header>
  );
}
