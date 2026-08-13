"use client"

// entities/herd/hooks/use-herds.ts
import { useQuery } from "@tanstack/react-query";
import { fetchHerdsByFarm } from "../api/herds";

export function useHerds(farmId: number | null) {
  const query = useQuery({
    queryKey: ["herds", farmId],
    queryFn: () => fetchHerdsByFarm(farmId as number),
    enabled: farmId !== null,
  });

  return { herds: query.data ?? [], isLoading: query.isLoading, error: query.error };
}
