// entities/farm/ui/farm-plot-banner.tsx
import type { Farm } from "../model/types";

interface Stats {
  herdCount: number | undefined;
  cowCount: number | undefined;
}

interface Props {
  farm: Farm;
  stats?: Stats;
  onEditAction?: () => void;
  onDeactivateAction?: () => void;
}

export function FarmPlotBanner({ farm, stats, onEditAction, onDeactivateAction }: Props) {
  return (
    <div className="bg-rufo-primary-dark px-5 py-4 text-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold">{farm.name}</h2>
          {(farm.description || farm.renspaCode) && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 shrink-0" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 2a6 6 0 0 0-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 0 0-6-6Zm0 8.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5Z"
                  clipRule="evenodd"
                />
              </svg>
              {farm.description || `RENSPA ${farm.renspaCode}`}
            </p>
          )}
        </div>

        {(onEditAction || onDeactivateAction) && (
          <div className="flex shrink-0 items-center gap-1">
            {onEditAction && (
              <button
                type="button"
                onClick={onEditAction}
                aria-label="Editar campo"
                className="grid h-8 w-8 place-items-center rounded-md text-white/85 hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden>
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {onDeactivateAction && (
              <button
                type="button"
                onClick={onDeactivateAction}
                aria-label="Dar de baja campo"
                className="grid h-8 w-8 place-items-center rounded-md text-rufo-destructive-on-dark hover:bg-white/10"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden>
                  <path d="M3 6h18" strokeLinecap="round" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10 11v6" strokeLinecap="round" />
                  <path d="M14 11v6" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {stats && (
        <div className="mt-4 grid grid-cols-3 border-t border-white/20 pt-3 text-center">
          <div>
            <p className="text-lg font-semibold tabular-nums">
              {farm.areaHectares ?? "—"}
              <span className="text-xs font-normal text-white/70">ha</span>
            </p>
            <p className="text-[11px] uppercase tracking-wide text-white/80">superficie</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">{stats.herdCount ?? "—"}</p>
            <p className="text-[11px] uppercase tracking-wide text-white/80">rodeos</p>
          </div>
          <div>
            <p className="text-lg font-semibold tabular-nums">{stats.cowCount ?? "—"}</p>
            <p className="text-[11px] uppercase tracking-wide text-white/80">animales</p>
          </div>
        </div>
      )}
    </div>
  );
}
