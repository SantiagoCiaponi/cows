"use client"

// entities/cow/ui/cow-detail.tsx
import { Modal } from "@/shared/ui";
import type { Cow } from "../model/types";

interface Props {
  cow: Cow;
  onCloseAction: () => void;
  onEditAction?: () => void;
  onDeleteAction?: () => void;
  isDeleting?: boolean;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("es-AR");
}

function formatAge(birthDate: string | null): string | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months -= 1;
  months = Math.max(months, 0);
  if (months < 12) return `${months} m`;
  const years = Math.floor(months / 12);
  return `${years} año${years === 1 ? "" : "s"}`;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-rufo-border py-2.5 last:border-0">
      <span className="text-sm text-rufo-text-muted">{label}</span>
      <span className="text-sm font-medium text-rufo-text">{value}</span>
    </div>
  );
}

export function CowDetail({ cow, onCloseAction, onEditAction, onDeleteAction, isDeleting }: Props) {
  const age = formatAge(cow.birthDate);

  return (
    <Modal title={cow.visualTag || cow.rfidTag || `Animal #${cow.id}`} onCloseAction={onCloseAction}>
      <div className="flex flex-col">
        <Row label="Caravana visual" value={cow.visualTag || "-"} />
        <Row label="Caravana RFID (SENASA)" value={cow.rfidTag || "-"} />
        <Row label="Categoria" value={cow.category} />
        <Row label="Sexo" value={cow.sex === "F" ? "Hembra" : "Macho"} />
        <Row label="Raza" value={cow.breed || "-"} />
        <Row label="Color" value={cow.coatColor || "-"} />
        <Row label="Fecha de nacimiento" value={formatDate(cow.birthDate)} />
        {age && <Row label="Edad" value={age} />}
        <Row label="RENSPA de origen" value={cow.renspaOrigin || "-"} />
        <Row label="Estado" value={cow.status} />
      </div>
      <div className="mt-4 flex justify-end gap-3">
        {onDeleteAction && (
          <button
            type="button"
            onClick={onDeleteAction}
            disabled={isDeleting}
            className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        )}
        {onEditAction && (
          <button
            type="button"
            onClick={onEditAction}
            className="rounded-lg border border-rufo-border px-4 py-2.5 text-sm font-semibold text-rufo-text transition-colors hover:bg-rufo-border/40"
          >
            Editar
          </button>
        )}
        <button
          type="button"
          onClick={onCloseAction}
          className="rounded-lg bg-rufo-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rufo-primary-hover"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
}
