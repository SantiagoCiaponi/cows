"use client"

// features/auth/hooks/use-register.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseApiError } from "@/shared/api";
import { getSessionStore } from "@/shared/session";
import { register } from "../api/register";
import type { RegisterRequest } from "../model/types";

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitRegistration(data: RegisterRequest) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await register(data);
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

  return { isLoading, error, submitRegistration };
}
