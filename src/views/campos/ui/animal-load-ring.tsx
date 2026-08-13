// views/campos/ui/animal-load-ring.tsx

// referencia visual de carga animal: 2.5 EV/ha se toma como techo de una carga extensiva alta
const VISUAL_MAX_LOAD = 2.5;

export function AnimalLoadRing({ load, areaHectares }: { load: number | null; areaHectares?: number | null }) {
  if (load === null) return null;

  const fillPercent = Math.min((load / VISUAL_MAX_LOAD) * 100, 100);
  const label = load.toLocaleString("es-AR", { maximumFractionDigits: 2, minimumFractionDigits: 2 });

  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-14 w-14 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--rufo-primary) ${fillPercent}%, #c7d1c9 ${fillPercent}%)`,
        }}
      >
        <div className="grid h-10 w-10 place-items-center rounded-full bg-rufo-surface text-xs font-semibold text-rufo-text">
          {label}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-rufo-text">Carga animal</p>
        <p className="text-xs text-rufo-text-muted">
          EV / hectarea{areaHectares ? ` · sobre ${areaHectares} ha` : ""}
        </p>
      </div>
    </div>
  );
}
