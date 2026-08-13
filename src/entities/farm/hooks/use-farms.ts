"use client"

// entities/farm/hooks/use-farms.ts
import { useQuery } from "@tanstack/react-query";
import { fetchFarms } from "../api/farms";

export function useFarms() {
  const query = useQuery({ queryKey: ["farms"], queryFn: fetchFarms });
  return { farms: query.data ?? [], isLoading: query.isLoading, error: query.error };
}
