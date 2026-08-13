"use client"

// views/campos/ui/herds-panel.tsx
import { FarmPlotBanner, type Farm } from "@/entities/farm";
import { composeCows, type Cow } from "@/entities/cow";
import type { Herd } from "@/entities/herd";
import { Card } from "@/shared/ui";
import { HerdDetailCard } from "./herd-detail-card";
import { HerdRichCard } from "./herd-rich-card";

interface Props {
  farm: Farm;
  herdCount: number | undefined;
  cowCount: number | undefined;
  herds: Herd[];
  cows: Cow[];
  isLoadingHerds: boolean;
  onSelectHerdAction: (herdId: number) => void;
  onAddHerdAction: () => void;
  onEditHerdAction: (herdId: number) => void;
  onDeactivateHerdAction: (herdId: number) => void;
  onEditFarmAction: () => void;
  onDeactivateFarmAction: () => void;
}

// campo seleccionado: banner + stats + lista de rodeos (paso 2 de campo -> rodeo -> vacas)
export function HerdsPanel({
  farm,
  herdCount,
  cowCount,
  herds,
  cows,
  isLoadingHerds,
  onSelectHerdAction,
  onAddHerdAction,
  onEditHerdAction,
  onDeactivateHerdAction,
  onEditFarmAction,
  onDeactivateFarmAction,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="overflow-hidden !p-0">
        <FarmPlotBanner
          farm={farm}
          stats={{ herdCount, cowCount }}
          onEditAction={onEditFarmAction}
          onDeactivateAction={onDeactivateFarmAction}
        />
      </Card>

      <div>
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-rufo-text">Rodeos</p>
          {herds.length === 1 ? (
            <p className="text-sm text-rufo-text-muted">1 rodeo</p>
          ) : (
            <button
              type="button"
              onClick={onAddHerdAction}
              className="text-sm font-medium text-rufo-primary hover:underline"
            >
              + Nuevo rodeo
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-3">
          {isLoadingHerds && <p className="py-2.5 text-sm text-rufo-text-muted">Cargando rodeos...</p>}
          {!isLoadingHerds && herds.length === 0 && (
            <p className="py-2.5 text-sm text-rufo-text-muted">Todavia no hay rodeos.</p>
          )}

          {herds.length === 1 ? (
            <HerdDetailCard
              herd={herds[0]}
              herdCows={cows.filter((cow) => cow.herdId === herds[0].id)}
              composition={composeCows(cows.filter((cow) => cow.herdId === herds[0].id))}
              areaHectares={farm.areaHectares}
              onSelectAction={() => onSelectHerdAction(herds[0].id)}
              onEditAction={() => onEditHerdAction(herds[0].id)}
              onDeactivateAction={() => onDeactivateHerdAction(herds[0].id)}
            />
          ) : (
            herds.map((herd) => (
              <HerdRichCard
                key={herd.id}
                herd={herd}
                composition={composeCows(cows.filter((cow) => cow.herdId === herd.id))}
                onSelectAction={() => onSelectHerdAction(herd.id)}
                onEditAction={() => onEditHerdAction(herd.id)}
                onDeactivateAction={() => onDeactivateHerdAction(herd.id)}
              />
            ))
          )}

          {herds.length === 1 && (
            <button
              type="button"
              onClick={onAddHerdAction}
              className="flex h-full min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-rufo-text-muted/40 text-sm font-medium text-rufo-text-muted hover:border-rufo-primary hover:text-rufo-primary"
            >
              + Nuevo rodeo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
