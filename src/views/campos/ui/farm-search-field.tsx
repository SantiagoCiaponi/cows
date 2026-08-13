// views/campos/ui/farm-search-field.tsx

interface Props {
  value: string;
  onChangeAction: (value: string) => void;
  onAddAction?: () => void;
}

export function FarmSearchField({ value, onChangeAction, onAddAction }: Props) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-rufo-text-muted">🔍</span>
        <input
          type="text"
          value={value}
          onChange={(event) => onChangeAction(event.target.value)}
          placeholder="Buscar campo"
          aria-label="Buscar campo"
          className="w-full rounded-lg border border-rufo-border bg-rufo-surface py-2.5 pl-9 pr-3 text-sm text-rufo-text outline-none transition-colors placeholder:text-rufo-text-muted focus:border-rufo-primary"
        />
      </div>
      {onAddAction && (
        <button
          type="button"
          onClick={onAddAction}
          aria-label="Nuevo campo"
          className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-lg bg-rufo-primary text-white hover:bg-rufo-primary-hover"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4" aria-hidden>
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
