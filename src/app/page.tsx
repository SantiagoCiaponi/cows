"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/shared/session";

export default function Root() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useSession();

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(isAuthenticated ? "/home" : "/login");
  }, [hasHydrated, isAuthenticated, router]);

  return null;
}
