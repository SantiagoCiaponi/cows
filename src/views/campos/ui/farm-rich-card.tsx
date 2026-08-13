// views/campos/ui/farm-rich-card.tsx
import type { Farm } from "@/entities/farm";
import { Button, Card } from "@/shared/ui";
import { AnimalLoadRing } from "./animal-load-ring";
import { FarmCompositionBar } from "./farm-composition-bar";
import { ChevronRightIcon, HerdIcon, LocationPinIcon, PencilIcon, TrashIcon } from "./icons";
import type { FarmCounts } from "../model/use-farm-counts";

interface Props {
  farm: Farm;
  counts: FarmCounts | undefined;
  onViewAction: () => void;
  onEditAction: () => void;
  onDeleteAction: () => void;
  onOpenMainHerdAction: () => void;
  compact?: boolean;
}

export function FarmRichCard({
  farm,
  counts,
  onViewAction,
  onEditAction,
  onDeleteAction,
  onOpenMainHerdAction,
  compact = false,
}: Props) {
  return (
    <Card className="flex h-full flex-col !p-0">
      <div className={`bg-rufo-primary-dark px-5 text-white ${compact ? "py-4" : "py-5"}`}>
        <div>
          {!compact && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-green-300">Tu campo</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/85">
                <span className={`h-1.5 w-1.5 rounded-full ${farm.isActive ? "bg-white" : "bg-white/40"}`} />
                {farm.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
          )}

          <h3 className={`text-2xl font-semibold ${compact ? "" : "mt-1"}`}>{farm.name}</h3>
          {(farm.description || farm.renspaCode) && (
            <p className="mt-0.5 flex items-center gap-1 text-sm text-white/80">
              <LocationPinIcon className="h-3.5 w-3.5 shrink-0" />
              {farm.description || `RENSPA ${farm.renspaCode}`}
            </p>
          )}

          <div className={`grid grid-cols-3 border-t border-white/20 ${compact ? "mt-3 pt-2" : "mt-4 pt-3"}`}>
            <div className="text-center">
              <p className="text-lg font-semibold">
                {farm.areaHectares ?? "—"}
                <span className="text-xs font-normal text-white/70">ha</span>
              </p>
              <p className="text-[11px] uppercase tracking-wide text-white/70">superficie</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{counts?.herdCount ?? "—"}</p>
              <p className="text-[11px] uppercase tracking-wide text-white/70">rodeos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{counts?.cowCount ?? "—"}</p>
              <p className="text-[11px] uppercase tracking-wide text-white/70">animales</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-1 flex-col px-5 ${compact ? "py-3" : "py-4"}`}>
        {counts && counts.composition.total > 0 && <FarmCompositionBar composition={counts.composition} />}

        {!compact && counts?.animalLoad != null && (
          <div className="mt-4">
            <AnimalLoadRing load={counts.animalLoad} />
          </div>
        )}

        {!compact && counts?.mainHerd && (
          <button
            type="button"
            onClick={onOpenMainHerdAction}
            className="mt-4 flex items-center gap-3 rounded-lg border border-rufo-border px-3 py-2.5 text-left hover:bg-rufo-border/20"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rufo-primary/10 text-rufo-primary">
              <HerdIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-rufo-text-muted">Rodeo principal</p>
              <p className="truncate text-sm font-medium text-rufo-text">
                {counts.mainHerd.name} · {counts.mainHerd.composition.total} animales
              </p>
            </div>
            <ChevronRightIcon className="h-4 w-4 shrink-0 text-rufo-text-muted" />
          </button>
        )}

        <div className={`flex flex-1 items-end gap-2 ${compact ? "mt-3" : "mt-5"}`}>
          <Button onClick={onViewAction} className="flex-1">
            Ver campo →
          </Button>
          <button
            type="button"
            onClick={onEditAction}
            aria-label="Editar campo"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-rufo-border text-rufo-text-muted hover:bg-rufo-border/40 hover:text-rufo-text"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            onClick={onDeleteAction}
            aria-label="Dar de baja campo"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-500/10"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </Card>
  );
}
