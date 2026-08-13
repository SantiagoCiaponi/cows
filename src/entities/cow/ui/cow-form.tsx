"use client"

// entities/cow/ui/cow-form.tsx
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/shared/ui";
import type { Herd } from "@/entities/herd";
import { loadPrerregistros } from "@/entities/prerregistro";
import { COW_CATEGORIES, type Cow, type CowRequest } from "../model/types";

const BREED_OPTIONS = ["Negra", "Colorada", "Otra"] as const;

interface Props {
  herds: Herd[];
  initialCow?: Cow;
  isSaving: boolean;
  error: string | null;
  onSubmitAction: (data: CowRequest) => void;
  onCancelAction: () => void;
}

export function CowForm({ herds, initialCow, isSaving, error, onSubmitAction, onCancelAction }: Props) {
  const [form, setForm] = useState<CowRequest>({
    herdId: initialCow?.herdId ?? herds[0]?.id ?? 0,
    category: initialCow?.category ?? COW_CATEGORIES[0],
    sex: initialCow?.sex ?? "F",
    visualTag: initialCow?.visualTag ?? "",
    rfidTag: initialCow?.rfidTag ?? "",
    breed: initialCow?.breed ?? "",
    birthDate: initialCow?.birthDate ?? undefined,
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmitAction(form);
  }

  function handleRfidChange(value: string) {
    setForm((prev) => {
      const match = loadPrerregistros().find((p) => p.senasa === value);
      return { ...prev, rfidTag: value, visualTag: match ? match.caravana : prev.visualTag };
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Caravana RFID (SENASA)"
          name="rfidTag"
          autoFocus
          value={form.rfidTag}
          onChange={(e) => handleRfidChange(e.target.value)}
        />
        <Input
          label="Caravana visual (opcional)"
          name="visualTag"
          value={form.visualTag}
          onChange={(e) => setForm((prev) => ({ ...prev, visualTag: e.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-rufo-text">
            Categoria
          </label>
          <select
            id="category"
            className="rounded-lg border border-rufo-border px-3 py-2.5 text-sm text-rufo-text outline-none focus:border-rufo-primary"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            {COW_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="sex" className="text-sm font-medium text-rufo-text">
            Sexo
          </label>
          <select
            id="sex"
            className="rounded-lg border border-rufo-border px-3 py-2.5 text-sm text-rufo-text outline-none focus:border-rufo-primary"
            value={form.sex}
            onChange={(e) => setForm((prev) => ({ ...prev, sex: e.target.value as CowRequest["sex"] }))}
          >
            <option value="F">Hembra</option>
            <option value="M">Macho</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-rufo-text">Raza (opcional)</span>
        <div className="flex gap-2">
          {BREED_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                setForm((prev) => ({ ...prev, breed: prev.breed === option ? "" : option }))
              }
              className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                form.breed === option
                  ? "border-rufo-primary bg-rufo-primary text-white"
                  : "border-rufo-border text-rufo-text hover:bg-rufo-border/40"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <Input
        label="Fecha"
        name="birthDate"
        type="date"
        value={form.birthDate ?? ""}
        onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancelAction}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving} disabled={herds.length === 0}>
          {initialCow ? "Guardar cambios" : "Cargar animal"}
        </Button>
      </div>
      {herds.length === 0 && (
        <p className="text-xs text-rufo-text-muted">Cre&aacute; primero un rodeo para poder cargar animales.</p>
      )}
    </form>
  );
}
