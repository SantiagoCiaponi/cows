// views/campos/ui/operation-summary.tsx
import { Card } from "@/shared/ui";

interface Props {
  totalHectares: number;
  herdCount: number;
  cowCount: number;
}

export function OperationSummary({ totalHectares, herdCount, cowCount }: Props) {
  return (
    <Card className="!p-0 overflow-hidden">
      <div className="bg-rufo-primary-dark px-5 py-4 text-white">
        <p className="text-xs font-medium uppercase tracking-wide text-green-300">Tu operacion</p>
        <div className="mt-3 grid grid-cols-3 border-t border-white/20 pt-3">
          <div className="text-center">
            <p className="text-lg font-semibold">
              {totalHectares}
              <span className="text-xs font-normal text-white/70">ha</span>
            </p>
            <p className="text-[11px] uppercase tracking-wide text-white/70">superficie</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{herdCount}</p>
            <p className="text-[11px] uppercase tracking-wide text-white/70">rodeos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">{cowCount}</p>
            <p className="text-[11px] uppercase tracking-wide text-white/70">animales</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
