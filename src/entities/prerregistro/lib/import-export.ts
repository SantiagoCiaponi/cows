// entities/prerregistro/lib/import-export.ts
import type { Prerregistro } from "../model/types";

// exporta solo lo que le importa al usuario: el id y la fecha son detalle interno de la lista.
export function serializePrerregistros(items: Prerregistro[]): string {
  const plain = items.map(({ caravana, senasa }) => ({ caravana, senasa }));
  return JSON.stringify(plain, null, 2);
}

// acepta tanto un array plano como el objeto que exportamos (por si el archivo se edito a mano)
export function parsePrerregistrosJson(raw: string): Prerregistro[] {
  const parsed = JSON.parse(raw) as unknown;
  const list = Array.isArray(parsed) ? parsed : Array.isArray((parsed as { items?: unknown })?.items) ? (parsed as { items: unknown[] }).items : null;

  if (!list) {
    throw new Error("El archivo no tiene el formato esperado (se espera una lista de registros).");
  }

  return list.map((entry, index) => {
    if (typeof entry !== "object" || entry === null) {
      throw new Error(`Registro invalido en la posicion ${index + 1}.`);
    }
    const { caravana, senasa } = entry as Record<string, unknown>;
    if (typeof caravana !== "string" || !caravana.trim()) {
      throw new Error(`Falta el numero de caravana en el registro ${index + 1}.`);
    }
    if (typeof senasa !== "string" || !senasa.trim()) {
      throw new Error(`Falta el numero de SENASA en el registro ${index + 1}.`);
    }
    return {
      id: crypto.randomUUID(),
      caravana: caravana.trim(),
      senasa: senasa.trim(),
      createdAt: new Date().toISOString(),
    };
  });
}
