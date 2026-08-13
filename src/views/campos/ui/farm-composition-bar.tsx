// views/campos/ui/farm-composition-bar.tsx
import type { HerdComposition } from "@/entities/cow";

const SEGMENTS: { key: keyof Omit<HerdComposition, "total">; label: string; color: string }[] = [
  { key: "vacas", label: "vacas", color: "bg-rufo-primary" },
  { key: "terneros", label: "terneros", color: "bg-rufo-light-green" },
  { key: "toros", label: "toros", color: "bg-rufo-accent" },
];

export function FarmCompositionBar({
  composition,
  compact = false,
}: {
  composition: HerdComposition;
  compact?: boolean;
}) {
  if (composition.total === 0) return null;

  return (
    <div>
      {!compact && (
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-rufo-text-muted">Composicion del rodeo</p>
          <p className="text-xs text-rufo-text-muted">{composition.total} cabezas</p>
        </div>
      )}
      <div className={`flex h-2 w-full overflow-hidden rounded-full bg-rufo-divider ${compact ? "" : "mt-2"}`}>
        {SEGMENTS.map(({ key, color }) => {
          const value = composition[key];
          if (value === 0) return null;
          return <div key={key} className={color} style={{ width: `${(value / composition.total) * 100}%` }} />;
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-rufo-text-muted">
        {SEGMENTS.map(({ key, label, color }) => {
          const value = composition[key];
          if (value === 0) return null;
          return (
            <span key={key} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${color}`} />
              {value} {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
