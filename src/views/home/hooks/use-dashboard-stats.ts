"use client"

// views/home/hooks/use-dashboard-stats.ts
import { useQueries } from "@tanstack/react-query";
import { useFarms } from "@/entities/farm";
import { fetchHerdsByFarm } from "@/entities/herd/api/herds";
import { fetchCowsByFarm } from "@/entities/cow/api/cows";

export function useDashboardStats() {
  const { farms, isLoading: isLoadingFarms } = useFarms();
  const farmIds = farms.map((farm) => farm.id);

  const herdQueries = useQueries({
    queries: farmIds.map((farmId) => ({
      queryKey: ["herds", farmId],
      queryFn: () => fetchHerdsByFarm(farmId),
    })),
  });

  const cowQueries = useQueries({
    queries: farmIds.map((farmId) => ({
      queryKey: ["cows", farmId],
      queryFn: () => fetchCowsByFarm(farmId),
    })),
  });

  const isLoading =
    isLoadingFarms || herdQueries.some((q) => q.isLoading) || cowQueries.some((q) => q.isLoading);

  const herdsCount = herdQueries.reduce((total, q) => total + (q.data?.length ?? 0), 0);
  const cowsCount = cowQueries.reduce((total, q) => total + (q.data?.length ?? 0), 0);

  return {
    farmsCount: farms.length,
    herdsCount,
    cowsCount,
    isLoading,
  };
}
