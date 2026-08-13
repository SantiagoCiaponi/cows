"use client"

// features/auth/hooks/use-login.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseApiError } from "@/shared/api";
import { getSessionStore } from "@/shared/session";
import { login } from "../api/login";
import type { LoginRequest } from "../model/types";

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitCredentials(data: LoginRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await login(data);
      getSessionStore.getState().setSession({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      router.push("/home");
    } catch (err) {
      const parsed = parseApiError(err);
      setError(parsed.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, submitCredentials };
}
