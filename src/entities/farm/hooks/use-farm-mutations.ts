"use client"

// entities/farm/hooks/use-farm-mutations.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseApiError } from "@/shared/api";
import { createFarm, updateFarm, deactivateFarm } from "../api/farms";
import type { FarmRequest } from "../model/types";

export function useFarmMutations() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ["farms"] });
  }

  const createMutation = useMutation({
    mutationFn: (data: FarmRequest) => createFarm(data),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FarmRequest }) => updateFarm(id, data),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateFarm(id),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  return {
    error,
    clearError: () => setError(null),
    createFarm: createMutation.mutateAsync,
    updateFarm: (id: number, data: FarmRequest) => updateMutation.mutateAsync({ id, data }),
    deactivateFarm: deactivateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
  };
}
