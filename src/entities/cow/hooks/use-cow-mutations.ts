"use client"

// entities/cow/hooks/use-cow-mutations.ts
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { parseApiError } from "@/shared/api";
import { createCow, deactivateCow } from "../api/cows";
import type { CowRequest } from "../model/types";

export function useCowMutations(farmId: number | null) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  function invalidate() {
    return queryClient.invalidateQueries({ queryKey: ["cows", farmId] });
  }

  const createMutation = useMutation({
    mutationFn: (data: CowRequest) => createCow(farmId as number, data),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateCow(id),
    onSuccess: invalidate,
    onError: (err) => setError(parseApiError(err).message),
  });

  return {
    error,
    clearError: () => setError(null),
    createCow: createMutation.mutateAsync,
    deactivateCow: deactivateMutation.mutateAsync,
    isSaving: createMutation.isPending,
  };
}
