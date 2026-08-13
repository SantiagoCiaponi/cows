// entities/cow/lib/animal-units.ts
import type { Cow } from "../model/types";

// equivalencia vaca (EV) estandar para carga animal en ganaderia extensiva argentina
const EV_BY_CATEGORY: Record<string, number> = {
  Vaca: 1.0,
  Vaquillona: 0.7,
  Novillo: 0.8,
  Toro: 1.3,
  Ternero: 0.4,
  Ternera: 0.4,
};

export interface HerdComposition {
  vacas: number;
  terneros: number;
  toros: number;
  total: number;
}

export function composeCows(cows: Cow[]): HerdComposition {
  let vacas = 0;
  let terneros = 0;
  let toros = 0;

  for (const cow of cows) {
    if (cow.category === "Ternero" || cow.category === "Ternera") terneros += 1;
    else if (cow.category === "Novillo" || cow.category === "Toro") toros += 1;
    else vacas += 1;
  }

  return { vacas, terneros, toros, total: cows.length };
}

// carga animal en EV/hectarea; null si el campo no tiene superficie cargada
export function computeAnimalLoad(cows: Cow[], areaHectares: number | null): number | null {
  if (!areaHectares) return null;
  const totalEv = cows.reduce((sum, cow) => sum + (EV_BY_CATEGORY[cow.category] ?? 1), 0);
  return totalEv / areaHectares;
}
