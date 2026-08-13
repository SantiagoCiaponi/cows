// views/home/ui/dashboard-hero.tsx
import Link from "next/link";
import type { ModuleNavItem } from "@/config/theme.config";

interface Stat {
  value: number;
  label: string;
}

interface Props {
  module: ModuleNavItem;
  stats: Stat[];
  isLoadingStats: boolean;
}

export function DashboardHero({ module, stats, isLoadingStats }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-rufo-primary-dark">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="relative grid gap-8 px-8 py-6 sm:px-14 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="hidden text-xs font-semibold uppercase tracking-wide text-white/60 sm:block">Modulo activo</p>
          <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">{module.name}</h2>
          <p className="mt-2 max-w-md text-sm text-white/80">{module.description}</p>
          <Link
            href={module.href}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-rufo-primary-dark transition-colors hover:bg-white/90 lg:w-auto"
          >
            Entrar <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid w-full grid-cols-3 gap-4 lg:w-auto lg:gap-6 lg:pl-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center lg:text-left">
              <p className="text-2xl font-bold text-white">
                {isLoadingStats ? "—" : stat.value.toLocaleString("es-AR")}
              </p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
