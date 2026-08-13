// views/campos/ui/herd-rich-card.tsx
import type { HerdComposition } from "@/entities/cow";
import type { Herd } from "@/entities/herd";
import { FarmCompositionBar } from "./farm-composition-bar";
import { ChevronRightIcon, HerdIcon, PencilIcon, TrashIcon } from "./icons";

interface Props {
  herd: Herd;
  composition: HerdComposition;
  onSelectAction: () => void;
  onEditAction: () => void;
  onDeactivateAction: () => void;
}

export function HerdRichCard({ herd, composition, onSelectAction, onEditAction, onDeactivateAction }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-rufo-border-device bg-rufo-surface">
      <div className="flex items-start justify-between gap-2 px-4 pt-3.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-rufo-text">{herd.name}</p>
          {herd.description && <p className="mt-0.5 truncate text-xs text-rufo-text-muted">{herd.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onEditAction();
            }}
            aria-label="Editar rodeo"
            className="grid h-7 w-7 place-items-center rounded-md text-rufo-icon-muted hover:bg-rufo-divider hover:text-rufo-text"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDeactivateAction();
            }}
            aria-label="Dar de baja rodeo"
            className="grid h-7 w-7 place-items-center rounded-md text-rufo-destructive hover:bg-rufo-destructive-hover-bg"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-3.5 pt-2.5">
        {composition.total > 0 ? (
          <FarmCompositionBar composition={composition} compact />
        ) : (
          <p className="text-xs text-rufo-text-muted">Todavia no hay animales en este rodeo.</p>
        )}
      </div>

      <button
        type="button"
        onClick={onSelectAction}
        className="flex w-full items-center justify-between gap-2 border-t border-rufo-divider bg-rufo-footer px-4 py-2.5 text-left hover:bg-rufo-divider/60"
      >
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rufo-primary">
          <HerdIcon className="h-4 w-4" />
          Ver los {composition.total} animales
        </span>
        <ChevronRightIcon className="h-4 w-4 shrink-0 text-rufo-primary" />
      </button>
    </div>
  );
}
