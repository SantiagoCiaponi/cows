"use client"

// entities/cow/ui/cow-form.tsx
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/shared/ui";
import type { Herd } from "@/entities/herd";
import { COW_CATEGORIES, type CowRequest } from "../model/types";

interface Props {
  herds: Herd[];
  isSaving: boolean;
  error: string | null;
  onSubmitAction: (data: CowRequest) => void;
  onCancelAction: () => void;
}

export function CowForm({ herds, isSaving, error, onSubmitAction, onCancelAction }: Props) {
  const [form, setForm] = useState<CowRequest>({
    herdId: herds[0]?.id ?? 0,
    category: COW_CATEGORIES[0],
    sex: "F",
    visualTag: "",
    rfidTag: "",
    breed: "",
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmitAction(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="herdId" className="text-sm font-medium text-rufo-text">
          Rodeo
        </label>
        <select
          id="herdId"
          required
          className="rounded-lg border border-rufo-border px-3 py-2.5 text-sm text-rufo-text outline-none focus:border-rufo-primary"
          value={form.herdId}
          onChange={(e) => setForm((prev) => ({ ...prev, herdId: Number(e.target.value) }))}
        >
          {herds.map((herd) => (
            <option key={herd.id} value={herd.id}>
              {herd.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Caravana visual (opcional)"
          name="visualTag"
          value={form.visualTag}
          onChange={(e) => setForm((prev) => ({ ...prev, visualTag: e.target.value }))}
        />
        <Input
          label="Caravana RFID (opcional)"
          name="rfidTag"
          value={form.rfidTag}
          onChange={(e) => setForm((prev) => ({ ...prev, rfidTag: e.target.value }))}
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
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Raza (opcional)"
          name="breed"
          value={form.breed}
          onChange={(e) => setForm((prev) => ({ ...prev, breed: e.target.value }))}
        />
        <Input
          label="Fecha de nacimiento (opcional)"
          name="birthDate"
          type="date"
          value={form.birthDate ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, birthDate: e.target.value }))}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancelAction}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving} disabled={herds.length === 0}>
          Cargar animal
        </Button>
      </div>
      {herds.length === 0 && (
        <p className="text-xs text-rufo-text-muted">Cre&aacute; primero un rodeo para poder cargar animales.</p>
      )}
    </form>
  );
}
