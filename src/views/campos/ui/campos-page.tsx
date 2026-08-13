"use client"

// views/campos/ui/campos-page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/shared/session";
import { useCurrentUser } from "@/entities/user";
import { AppHeader } from "@/widgets/app-header";
import { CamposExplorer } from "./campos-explorer";

export function CamposPage() {
  const router = useRouter();
  const { isAuthenticated, hasHydrated } = useSession();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated || !isAuthenticated || isLoading || !user) {
    return <div className="flex flex-1 items-center justify-center text-sm text-rufo-text-muted">Cargando...</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-6 sm:py-10">
        <CamposExplorer />
      </main>
    </div>
  );
}
