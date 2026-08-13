"use client"

// views/campos/ui/cows-panel.tsx
import { useMemo, useState } from "react";
import { composeCows, type Cow } from "@/entities/cow";
import type { Herd } from "@/entities/herd";
import { Button, Card } from "@/shared/ui";
import { FilterIcon, SearchIcon } from "./icons";

interface Props {
  farmName?: string;
  herd: Herd;
  cows: Cow[];
  isLoadingCows: boolean;
  onAddCowAction: () => void;
  onBackToHerdsAction: () => void;
}

type CategoryFilter = "todos" | "vacas" | "terneros" | "toros";

const CATEGORY_BAR_COLOR: Record<Exclude<CategoryFilter, "todos">, string> = {
  vacas: "bg-rufo-primary",
  terneros: "bg-rufo-light-green",
  toros: "bg-rufo-accent",
};

function categoryGroup(cow: Cow): Exclude<CategoryFilter, "todos"> {
  if (cow.category === "Ternero" || cow.category === "Ternera") return "terneros";
  if (cow.category === "Novillo" || cow.category === "Toro") return "toros";
  return "vacas";
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

// rodeo seleccionado: lista de vacas de ese rodeo (paso 3 de campo -> rodeo -> vacas)
export function CowsPanel({ farmName, herd, cows, isLoadingCows, onAddCowAction, onBackToHerdsAction }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("todos");
  const [showFilters, setShowFilters] = useState(false);

  const composition = composeCows(cows);

  const filteredCows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return cows.filter((cow) => {
      if (category !== "todos" && categoryGroup(cow) !== category) return false;
      if (!query) return true;
      const tag = (cow.visualTag || cow.rfidTag || "").toLowerCase();
      return tag.includes(query);
    });
  }, [cows, search, category]);

  const activeFilterCount = (search.trim() ? 1 : 0) + (category !== "todos" ? 1 : 0);

  return (
    <>
      {/* Mobile: cabecera + buscador fijos, grilla de animales scrolleable, boton fijo abajo */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-10 -mx-4 bg-rufo-background px-4 pb-2 sm:-mx-6 sm:px-6">
          <button
            type="button"
            onClick={onBackToHerdsAction}
            className="text-sm font-medium text-rufo-primary hover:underline"
          >
            &larr; {farmName ? `Campo ${farmName}` : "Volver a rodeos"}
          </button>

          <h1 className="mt-1 text-3xl font-bold text-rufo-text">{herd.name}</h1>
          <p className="mt-1 text-sm font-medium text-rufo-primary">
            {composition.total} animales · {composition.vacas} vacas · {composition.terneros} terneros ·{" "}
            {composition.toros} toros
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="relative flex-1">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rufo-text-muted" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar caravana"
                aria-label="Buscar caravana"
                className="w-full rounded-lg border border-rufo-border bg-rufo-surface py-2.5 pl-9 pr-3 text-sm text-rufo-text outline-none transition-colors placeholder:text-rufo-text-muted focus:border-rufo-primary"
              />
            </div>
            <button
              type="button"
              aria-label="Filtrar animales"
              aria-expanded={showFilters}
              onClick={() => setShowFilters((value) => !value)}
              className={`relative grid h-[42px] w-[42px] shrink-0 place-items-center rounded-lg border text-rufo-text transition-colors ${
                showFilters
                  ? "border-rufo-primary bg-rufo-primary/10"
                  : "border-rufo-border bg-rufo-surface hover:bg-rufo-divider/60"
              }`}
            >
              <FilterIcon className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-rufo-primary text-[11px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="mt-3 flex flex-nowrap gap-1.5 overflow-x-auto">
              {(
                [
                  { key: "todos", label: "Todos", count: composition.total },
                  { key: "vacas", label: "Vacas", count: composition.vacas },
                  { key: "terneros", label: "Terneros", count: composition.terneros },
                  { key: "toros", label: "Toros", count: composition.toros },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setCategory(tab.key)}
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    category === tab.key
                      ? "bg-rufo-primary text-white"
                      : "border border-rufo-border bg-rufo-surface text-rufo-text hover:bg-rufo-divider/60"
                  }`}
                >
                  {tab.label} {tab.count}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pb-24">
          {isLoadingCows && <p className="text-sm text-rufo-text-muted">Cargando animales...</p>}
          {!isLoadingCows && filteredCows.length === 0 && (
            <p className="text-sm text-rufo-text-muted">
              {cows.length === 0 ? "Todavia no hay animales en este rodeo." : "No encontramos animales con ese filtro."}
            </p>
          )}

          {filteredCows.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {filteredCows.map((cow) => {
                const tag = cow.visualTag || cow.rfidTag;
                const noTag = !tag;
                const age = formatAge(cow.birthDate);
                return (
                  <div key={cow.id} className="flex gap-2.5 rounded-md bg-rufo-surface p-3 shadow-sm">
                    <span
                      className={`w-1 shrink-0 self-stretch rounded-sm ${
                        noTag ? "bg-rufo-border-device" : CATEGORY_BAR_COLOR[categoryGroup(cow)]
                      }`}
                    />
                    <div className="flex min-w-0 flex-col justify-center">
                      <span
                        className={`truncate text-sm font-semibold ${noTag ? "text-rufo-text-muted" : "text-rufo-text"}`}
                      >
                        {tag || "Sin caravana"}
                      </span>
                      <span className={`truncate text-xs ${noTag ? "text-rufo-icon-muted" : "text-rufo-text-muted"}`}>
                        {cow.category}
                        {age ? ` · ${age}` : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-rufo-border bg-rufo-background px-4 py-3 sm:px-6">
          <Button onClick={onAddCowAction} className="w-full">
            + Cargar animal
          </Button>
        </div>
      </div>

      {/* Desktop: panel con tabla */}
      <Card className="hidden !p-0 lg:block">
        <div className="flex items-start justify-between gap-2 border-b border-rufo-border px-5 py-4">
          <div>
            <button
              type="button"
              onClick={onBackToHerdsAction}
              className="text-sm font-medium text-rufo-primary hover:underline"
            >
              &larr; Volver a rodeos
            </button>
            <h2 className="mt-1 text-lg font-semibold text-rufo-text">{herd.name}</h2>
            {herd.description && <p className="text-sm text-rufo-text-muted">{herd.description}</p>}
          </div>
          <Button onClick={onAddCowAction} className="shrink-0">
            Cargar animal
          </Button>
        </div>

        <div className="px-5 py-4">
          {isLoadingCows && <p className="text-sm text-rufo-text-muted">Cargando animales...</p>}
          {!isLoadingCows && cows.length === 0 && (
            <p className="text-sm text-rufo-text-muted">Todavia no hay animales en este rodeo.</p>
          )}

          {cows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse">
                <thead>
                  <tr className="border-b border-rufo-border text-left text-xs font-medium text-rufo-text-muted">
                    <th className="pb-2 pr-4">Caravana</th>
                    <th className="pb-2 pr-4">Categoria</th>
                    <th className="pb-2 pr-4">Sexo</th>
                    <th className="pb-2 pr-4">Raza</th>
                    <th className="pb-2">Nacimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {cows.map((cow) => (
                    <tr key={cow.id} className="border-b border-rufo-border last:border-0">
                      <td className="py-2.5 pr-4 text-sm font-medium text-rufo-text">
                        {cow.visualTag || cow.rfidTag || `#${cow.id}`}
                      </td>
                      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{cow.category}</td>
                      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{cow.sex === "F" ? "Hembra" : "Macho"}</td>
                      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{cow.breed || "-"}</td>
                      <td className="py-2.5 text-sm text-rufo-text-muted">{cow.birthDate ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
