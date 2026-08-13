// views/home/ui/quick-actions.tsx
import Link from "next/link";
import { Card } from "@/shared/ui";

const ACTIONS = [
  {
    title: "Nuevo animal",
    description: "Alta con caravana y datos basicos.",
    href: "/campos",
  },
  {
    title: "Movimiento de rodeo",
    description: "Cambio de potrero o categoria.",
    href: "/campos",
  },
  {
    title: "Buscar caravana",
    description: "Ficha individual del animal.",
    href: "/campos",
  },
];

export function QuickActions() {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-rufo-text-muted">
        Accesos rapidos
      </h3>
      <div className="mt-3 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {ACTIONS.map((action) => (
          <Link key={action.title} href={action.href} className="block">
            <Card className="flex h-full items-center justify-between gap-4 transition-shadow hover:shadow-md">
              <div>
                <h4 className="text-sm font-semibold text-rufo-text">{action.title}</h4>
                <p className="mt-1 text-sm text-rufo-text-muted">{action.description}</p>
              </div>
              <span className="shrink-0 text-rufo-text-muted" aria-hidden>
                &gt;
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
