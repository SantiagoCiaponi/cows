// entities/prerregistro/lib/storage.ts
import type { Prerregistro } from "../model/types";

const STORAGE_KEY = "rufo:prerregistro-caravanas";

export function loadPrerregistros(): Prerregistro[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Prerregistro[]) : [];
  } catch {
    return [];
  }
}

export function savePrerregistros(items: Prerregistro[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}
