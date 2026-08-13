"use client"

// entities/herd/hooks/use-herd-mutations.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseApiError } from "@/shared/api";
import { createHerd, deactivateHerd, updateHerd } from "../api/herds";
import type { HerdRequest } from "../model/types";

export function useHerdMutations(farmId: number | null) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ["herds", farmId] });
  }

  const createMutation = useMutation({
    mutationFn: (data: HerdRequest) => createHerd(farmId as number, data),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: HerdRequest }) => updateHerd(id, data),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateHerd(id),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  return {
    error,
    clearError: () => setError(null),
    createHerd: createMutation.mutateAsync,
    updateHerd: (id: number, data: HerdRequest) => updateMutation.mutateAsync({ id, data }),
    deactivateHerd: deactivateMutation.mutateAsync,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}
