"use client"

// entities/cow/hooks/use-cows.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCowsByFarm } from "../api/cows";

export function useCows(farmId: number | null) {
  const query = useQuery({
    queryKey: ["cows", farmId],
    queryFn: () => fetchCowsByFarm(farmId as number),
    enabled: farmId !== null,
  });

  return { cows: query.data ?? [], isLoading: query.isLoading, error: query.error };
}
