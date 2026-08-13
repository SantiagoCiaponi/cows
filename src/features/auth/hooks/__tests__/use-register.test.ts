// features/auth/hooks/__tests__/use-register.test.ts
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock, registerMock, setSessionMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  registerMock: vi.fn(),
  setSessionMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("../../api/register", () => ({
  register: registerMock,
}));

vi.mock("@/shared/session", () => ({
  getSessionStore: { getState: () => ({ setSession: setSessionMock }) },
}));

import { useRegister } from "../use-register";

const FORM = {
  firstName: "Ana",
  lastName: "Perez",
  email: "ana@rufo.com",
  password: "12345678",
};

describe("useRegister", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1 test. estado inicial del hook
  it("inicia con isLoading=false y error=null", () => {
    const { result } = renderHook(() => useRegister());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // 2 test. camino feliz: guarda sesion y navega a /home
  it("guarda la sesion y redirige a /home cuando el registro es exitoso", async () => {
    registerMock.mockResolvedValueOnce({
      accessToken: "access",
      refreshToken: "refresh",
      user: { id: "1", firstName: "Ana", lastName: "Perez", email: "ana@rufo.com", cuit: null, phone: null, role: "USER" },
    });

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.submitRegistration(FORM);
    });

    expect(setSessionMock).toHaveBeenCalledWith({
      user: expect.objectContaining({ email: "ana@rufo.com" }),
      accessToken: "access",
      refreshToken: "refresh",
    });
    expect(pushMock).toHaveBeenCalledWith("/home");
  });

  // 3 test. manejo de error: email ya registrado
  it("setea un mensaje de error legible cuando el registro falla", async () => {
    registerMock.mockRejectedValueOnce(new Error("email ya usado"));

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.submitRegistration(FORM);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("email ya usado");
    expect(setSessionMock).not.toHaveBeenCalled();
  });
});
