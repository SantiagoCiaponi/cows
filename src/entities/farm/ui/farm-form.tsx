"use client"

// entities/farm/ui/farm-form.tsx
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/shared/ui";
import type { Farm, FarmRequest } from "../model/types";

interface Props {
  initialFarm?: Farm;
  isSaving: boolean;
  error: string | null;
  onSubmitAction: (data: FarmRequest) => void;
  onCancelAction: () => void;
}

export function FarmForm({ initialFarm, isSaving, error, onSubmitAction, onCancelAction }: Props) {
  const [form, setForm] = useState<FarmRequest>({
    name: initialFarm?.name ?? "",
    description: initialFarm?.description ?? "",
    areaHectares: initialFarm?.areaHectares ?? undefined,
    renspaCode: initialFarm?.renspaCode ?? "",
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmitAction(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre del campo"
        name="name"
        required
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
      />
      <Input
        label="Codigo RENSPA (opcional)"
        name="renspaCode"
        value={form.renspaCode}
        onChange={(e) => setForm((prev) => ({ ...prev, renspaCode: e.target.value }))}
      />
      <Input
        label="Hectareas (opcional)"
        name="areaHectares"
        type="number"
        step="0.01"
        min="0"
        value={form.areaHectares ?? ""}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, areaHectares: e.target.value ? Number(e.target.value) : undefined }))
        }
      />
      <Input
        label="Descripcion (opcional)"
        name="description"
        value={form.description}
        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="mt-2 flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancelAction}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving}>
          {initialFarm ? "Guardar cambios" : "Crear campo"}
        </Button>
      </div>
    </form>
  );
}
