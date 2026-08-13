"use client"

// features/auth/hooks/use-logout.ts
import { useRouter } from "next/navigation";
import { getSessionStore } from "@/shared/session";

export function useLogout() {
  const router = useRouter();

  function logout() {
    getSessionStore.getState().clearSession();
    router.push("/login");
  }

  return { logout };
}
