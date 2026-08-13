// features/auth/hooks/__tests__/use-login.test.ts
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock, loginMock, setSessionMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  loginMock: vi.fn(),
  setSessionMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("../../api/login", () => ({
  login: loginMock,
}));

vi.mock("@/shared/session", () => ({
  getSessionStore: { getState: () => ({ setSession: setSessionMock }) },
}));

import { useLogin } from "../use-login";

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1 test. estado inicial del hook
  it("inicia con isLoading=false y error=null", () => {
    const { result } = renderHook(() => useLogin());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // 2 test. camino feliz: guarda sesion y navega a /home
  it("guarda la sesion y redirige a /home cuando el login es exitoso", async () => {
    loginMock.mockResolvedValueOnce({
      accessToken: "access",
      refreshToken: "refresh",
      user: { id: "1", firstName: "Ana", lastName: "Perez", email: "ana@rufo.com", cuit: null, phone: null, role: "USER" },
    });

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.submitCredentials({ email: "ana@rufo.com", password: "12345678" });
    });

    expect(setSessionMock).toHaveBeenCalledWith({
      user: expect.objectContaining({ email: "ana@rufo.com" }),
      accessToken: "access",
      refreshToken: "refresh",
    });
    expect(pushMock).toHaveBeenCalledWith("/home");
    expect(result.current.error).toBeNull();
  });

  // 3 test. manejo de error: credenciales invalidas
  it("setea un mensaje de error legible cuando el login falla", async () => {
    loginMock.mockRejectedValueOnce(new Error("network down"));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.submitCredentials({ email: "ana@rufo.com", password: "wrong" });
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe("network down");
    expect(setSessionMock).not.toHaveBeenCalled();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
