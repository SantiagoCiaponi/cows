"use client"

// entities/prerregistro/hooks/use-prerregistros.ts
import { useSyncExternalStore } from "react";
import { loadPrerregistros, savePrerregistros } from "../lib/storage";
import type { Prerregistro } from "../model/types";

type Listener = () => void;

const listeners = new Set<Listener>();
let cache: Prerregistro[] | null = null;

function getSnapshot(): Prerregistro[] {
  if (cache === null) cache = loadPrerregistros();
  return cache;
}

const EMPTY: Prerregistro[] = [];

function getServerSnapshot(): Prerregistro[] {
  return EMPTY;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setItems(updater: (prev: Prerregistro[]) => Prerregistro[]) {
  cache = updater(getSnapshot());
  savePrerregistros(cache);
  listeners.forEach((listener) => listener());
}

export function usePrerregistros() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function addPair(caravana: string, senasa: string): { error: string | null } {
    const cleanCaravana = caravana.trim();
    const cleanSenasa = senasa.trim();

    if (!cleanCaravana || !cleanSenasa) {
      return { error: "Completa el numero de caravana y el numero de SENASA." };
    }
    if (items.some((item) => item.caravana === cleanCaravana)) {
      return { error: `La caravana ${cleanCaravana} ya esta emparejada.` };
    }
    if (items.some((item) => item.senasa === cleanSenasa)) {
      return { error: `El numero de SENASA ${cleanSenasa} ya esta emparejado.` };
    }

    setItems((prev) => [
      { id: crypto.randomUUID(), caravana: cleanCaravana, senasa: cleanSenasa, createdAt: new Date().toISOString() },
      ...prev,
    ]);
    return { error: null };
  }

  function removePair(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function clearAll() {
    setItems(() => []);
  }

  return { items, addPair, removePair, clearAll };
}
