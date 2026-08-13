// entities/farm/hooks/__tests__/use-farm-mutations.test.tsx
import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { createFarmMock, updateFarmMock, deactivateFarmMock } = vi.hoisted(() => ({
  createFarmMock: vi.fn(),
  updateFarmMock: vi.fn(),
  deactivateFarmMock: vi.fn(),
}));

vi.mock("../../api/farms", () => ({
  createFarm: createFarmMock,
  updateFarm: updateFarmMock,
  deactivateFarm: deactivateFarmMock,
}));

import { useFarmMutations } from "../use-farm-mutations";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useFarmMutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1 test. estado inicial del hook
  it("inicia sin error y sin operaciones en curso", () => {
    const { result } = renderHook(() => useFarmMutations(), { wrapper });
    expect(result.current.error).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  // 2 test. camino feliz: crear campo
  it("crea un campo delegando en la api", async () => {
    createFarmMock.mockResolvedValueOnce({ id: 1, name: "El Refugio" });
    const { result } = renderHook(() => useFarmMutations(), { wrapper });

    await act(async () => {
      await result.current.createFarm({ name: "El Refugio" });
    });

    expect(createFarmMock).toHaveBeenCalledWith({ name: "El Refugio" });
    expect(result.current.error).toBeNull();
  });

  // 3 test. manejo de error: falla la baja
  it("setea un mensaje de error legible cuando la baja falla", async () => {
    deactivateFarmMock.mockRejectedValueOnce(new Error("no se pudo dar de baja"));
    const { result } = renderHook(() => useFarmMutations(), { wrapper });

    await act(async () => {
      await result.current.deactivateFarm(1).catch(() => {});
    });

    await waitFor(() => expect(result.current.error).toBe("no se pudo dar de baja"));
  });

  // 4 test. clearError limpia el estado de error
  it("limpia el error con clearError", async () => {
    deactivateFarmMock.mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => useFarmMutations(), { wrapper });

    await act(async () => {
      await result.current.deactivateFarm(1).catch(() => {});
    });
    await waitFor(() => expect(result.current.error).toBe("boom"));

    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
