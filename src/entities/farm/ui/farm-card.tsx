// entities/farm/ui/farm-card.tsx
import { Card } from "@/shared/ui";
import type { Farm } from "../model/types";

interface Props {
  farm: Farm;
  onSelectAction: (farm: Farm) => void;
}

export function FarmCard({ farm, onSelectAction }: Props) {
  return (
    <button type="button" onClick={() => onSelectAction(farm)} className="text-left">
      <Card className="h-full transition-shadow hover:shadow-md">
        <h3 className="text-base font-semibold text-rufo-text">{farm.name}</h3>
        <p className="mt-1 text-sm text-rufo-text-muted">
          {farm.areaHectares ? `${farm.areaHectares} ha` : "Sin hectareas cargadas"}
          {farm.renspaCode ? ` · RENSPA ${farm.renspaCode}` : ""}
        </p>
        {farm.description && <p className="mt-2 text-sm text-rufo-text-muted">{farm.description}</p>}
      </Card>
    </button>
  );
}
