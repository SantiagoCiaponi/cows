// views/home/ui/upcoming-modules.tsx
import type { ModuleNavItem } from "@/config/theme.config";

export function UpcomingModules({ modules }: { modules: ModuleNavItem[] }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-rufo-text-muted">
          En camino
        </h3>
        <span className="text-xs text-rufo-text-muted">{modules.length} modulos</span>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-x-20 gap-y-8 sm:grid-cols-2">
        {modules.map((module) => (
          <div
            key={module.id}
            className="flex items-start justify-between gap-4 border-b border-rufo-border pb-6"
          >
            <div className="flex items-start gap-3">
              <span className="text-sm font-semibold text-rufo-text-muted">
                {String(module.order).padStart(2, "0")}
              </span>
              <div>
                <h4 className="text-sm font-semibold text-rufo-text">{module.name}</h4>
                <p className="mt-0.5 text-sm text-rufo-text-muted">{module.description}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-rufo-border/60 px-2 py-0.5 text-[11px] font-medium text-rufo-text-muted">
              Proximamente
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
