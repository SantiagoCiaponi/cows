// views/campos/ui/farm-list-row.tsx
import type { Farm } from "@/entities/farm";
import type { FarmCounts } from "../model/use-farm-counts";
import { ChevronRightIcon, LocationPinIcon, PencilIcon, TrashIcon } from "./icons";

interface Props {
  farm: Farm;
  counts: FarmCounts | undefined;
  isSelected: boolean;
  onSelectAction: () => void;
  onEditAction: () => void;
  onDeleteAction: () => void;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function FarmListRow({ farm, counts, isSelected, onSelectAction, onEditAction, onDeleteAction }: Props) {
  return (
    <div
      onClick={onSelectAction}
      className={`flex cursor-pointer items-center gap-3 rounded-lg border bg-rufo-surface px-4 py-3 shadow-sm transition-colors ${
        isSelected ? "border-rufo-primary bg-rufo-primary/5" : "border-rufo-border-device hover:bg-rufo-border/10"
      }`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-rufo-primary-dark text-xs font-semibold text-white">
        {initials(farm.name)}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-rufo-text">{farm.name}</p>
        {(farm.description || farm.renspaCode) && (
          <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-rufo-text-muted">
            <LocationPinIcon className="h-3 w-3 shrink-0 text-rufo-text-muted" />
            {farm.description || `RENSPA ${farm.renspaCode}`}
          </p>
        )}
      </div>

      <div className="hidden shrink-0 gap-6 text-right sm:flex">
        <div>
          <p className="text-sm font-semibold text-rufo-text">{farm.areaHectares ?? "—"}</p>
          <p className="text-[11px] text-rufo-text-muted">ha</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-rufo-text">{counts?.herdCount ?? "—"}</p>
          <p className="text-[11px] text-rufo-text-muted">rodeos</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-rufo-text">{counts?.cowCount ?? "—"}</p>
          <p className="text-[11px] text-rufo-text-muted">animales</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onEditAction();
          }}
          aria-label="Editar campo"
          className="grid h-8 w-8 place-items-center rounded-lg border border-rufo-border text-rufo-text-muted hover:bg-rufo-border/40 hover:text-rufo-text"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onDeleteAction();
          }}
          aria-label="Dar de baja campo"
          className="grid h-8 w-8 place-items-center rounded-lg border border-red-200 text-red-500 hover:bg-red-500/10"
        >
          <TrashIcon />
        </button>
        <ChevronRightIcon className="ml-1 h-4 w-4 shrink-0 text-rufo-text-muted" />
      </div>
    </div>
  );
}
