// views/campos/ui/add-farm-tile.tsx

export function AddFarmTile({ onClickAction }: { onClickAction: () => void }) {
  return (
    <button
      type="button"
      onClick={onClickAction}
      className="flex h-full min-h-[4.5rem] w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-rufo-text-muted/40 text-sm font-medium text-rufo-text-muted hover:border-rufo-primary hover:text-rufo-primary"
    >
      + Agregar otro campo
    </button>
  );
}
