"use client"

// entities/herd/ui/herd-form.tsx
import { useState, type FormEvent } from "react";
import { Button, Input } from "@/shared/ui";
import type { Herd, HerdRequest } from "../model/types";

interface Props {
  initialHerd?: Herd;
  isSaving: boolean;
  error: string | null;
  onSubmitAction: (data: HerdRequest) => void;
  onCancelAction: () => void;
}

export function HerdForm({ initialHerd, isSaving, error, onSubmitAction, onCancelAction }: Props) {
  const [form, setForm] = useState<HerdRequest>({
    name: initialHerd?.name ?? "",
    description: initialHerd?.description ?? "",
  });

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmitAction(form);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre del rodeo"
        name="name"
        required
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
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
          {initialHerd ? "Guardar cambios" : "Crear rodeo"}
        </Button>
      </div>
    </form>
  );
}
