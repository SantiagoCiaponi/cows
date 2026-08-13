// views/campos/ui/herd-detail-card.tsx
import type { Cow, HerdComposition } from "@/entities/cow";
import { computeAnimalLoad } from "@/entities/cow";
import type { Herd } from "@/entities/herd";
import { AnimalLoadRing } from "./animal-load-ring";
import { FarmCompositionBar } from "./farm-composition-bar";
import { ChevronRightIcon, HerdIcon, PencilIcon, TrashIcon } from "./icons";

interface Props {
  herd: Herd;
  herdCows: Cow[];
  composition: HerdComposition;
  areaHectares: number | null;
  onSelectAction: () => void;
  onEditAction: () => void;
  onDeactivateAction: () => void;
}

function computeInsights(herdCows: Cow[]) {
  const noTagCount = herdCows.filter((cow) => !cow.visualTag).length;

  let lastLoad: { label: string; count: number } | null = null;
  if (herdCows.length > 0) {
    const countByDay = new Map<string, number>();
    for (const cow of herdCows) {
      const day = cow.createdAt.slice(0, 10);
      countByDay.set(day, (countByDay.get(day) ?? 0) + 1);
    }
    const latestDay = [...countByDay.keys()].sort().at(-1);
    if (latestDay) {
      lastLoad = {
        label: new Intl.DateTimeFormat("es-AR", { day: "numeric", month: "long" }).format(
          new Date(`${latestDay}T00:00:00`)
        ),
        count: countByDay.get(latestDay) ?? 0,
      };
    }
  }

  return { lastLoad, noTagCount };
}

export function HerdDetailCard({
  herd,
  herdCows,
  composition,
  areaHectares,
  onSelectAction,
  onEditAction,
  onDeactivateAction,
}: Props) {
  const { lastLoad, noTagCount } = computeInsights(herdCows);
  const animalLoad = computeAnimalLoad(herdCows, areaHectares);

  return (
    <div className="overflow-hidden rounded-lg border border-rufo-border-device bg-rufo-surface">
      <div className="flex items-start justify-between gap-2 px-4 pt-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-rufo-text">{herd.name}</p>
          {herd.description && <p className="mt-0.5 truncate text-sm text-rufo-text-muted">{herd.description}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={onEditAction}
            aria-label="Editar rodeo"
            className="grid h-7 w-7 place-items-center rounded-md text-rufo-icon-muted hover:bg-rufo-divider hover:text-rufo-text"
          >
            <PencilIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDeactivateAction}
            aria-label="Dar de baja rodeo"
            className="grid h-7 w-7 place-items-center rounded-md text-rufo-destructive hover:bg-rufo-destructive-hover-bg"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        {composition.total > 0 ? (
          <FarmCompositionBar composition={composition} compact />
        ) : (
          <p className="text-sm text-rufo-text-muted">Todavia no hay animales en este rodeo.</p>
        )}
      </div>

      {animalLoad !== null && (
        <div className="border-t border-rufo-divider px-4 py-3.5">
          <AnimalLoadRing load={animalLoad} areaHectares={areaHectares} />
        </div>
      )}

      {(lastLoad || noTagCount > 0) && (
        <div className="divide-y divide-rufo-divider border-t border-rufo-divider px-4">
          {lastLoad && (
            <div className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-rufo-text-muted">Ultima carga</span>
              <span className="font-medium text-rufo-text">
                {lastLoad.label} · {pluralAnimales(lastLoad.count)}
              </span>
            </div>
          )}
          {noTagCount > 0 && (
            <div className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-rufo-text-muted">Sin caravana</span>
              <span className="font-medium text-rufo-text">{pluralAnimales(noTagCount)}</span>
            </div>
          )}
        </div>
      )}

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

function pluralAnimales(count: number) {
  return `${count} animal${count === 1 ? "" : "es"}`;
}
