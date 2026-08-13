"use client"

// views/campos/model/use-farm-counts.ts
import { useQueries } from "@tanstack/react-query";
import { fetchHerdsByFarm } from "@/entities/herd/api/herds";
import { fetchCowsByFarm } from "@/entities/cow/api/cows";
import { composeCows, computeAnimalLoad, type HerdComposition } from "@/entities/cow";
import type { Farm } from "@/entities/farm";
import type { Herd } from "@/entities/herd";

interface MainHerd {
  id: number;
  name: string;
  composition: HerdComposition;
}

export interface FarmCounts {
  herdCount: number;
  cowCount: number;
  composition: HerdComposition;
  animalLoad: number | null;
  mainHerd: MainHerd | null;
  isLoading: boolean;
}

export function useFarmCounts(farms: Farm[]): Record<number, FarmCounts> {
  const herdQueries = useQueries({
    queries: farms.map((farm) => ({
      queryKey: ["herds", farm.id],
      queryFn: () => fetchHerdsByFarm(farm.id),
    })),
  });

  const cowQueries = useQueries({
    queries: farms.map((farm) => ({
      queryKey: ["cows", farm.id],
      queryFn: () => fetchCowsByFarm(farm.id),
    })),
  });

  const result: Record<number, FarmCounts> = {};
  farms.forEach((farm, index) => {
    const herdQuery = herdQueries[index];
    const cowQuery = cowQueries[index];
    const herds: Herd[] = herdQuery.data ?? [];
    const cows = cowQuery.data ?? [];

    const mainHerd = herds.reduce<{ herd: Herd; count: number } | null>((best, herd) => {
      const count = cows.filter((cow) => cow.herdId === herd.id).length;
      if (!best || count > best.count) return { herd, count };
      return best;
    }, null);

    result[farm.id] = {
      herdCount: herds.length,
      cowCount: cows.length,
      composition: composeCows(cows),
      animalLoad: computeAnimalLoad(cows, farm.areaHectares),
      mainHerd: mainHerd
        ? {
            id: mainHerd.herd.id,
            name: mainHerd.herd.name,
            composition: composeCows(cows.filter((cow) => cow.herdId === mainHerd.herd.id)),
          }
        : null,
      isLoading: herdQuery.isLoading || cowQuery.isLoading,
    };
  });

  return result;
}
