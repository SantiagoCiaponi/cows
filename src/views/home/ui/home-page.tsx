"use client"

// views/home/ui/home-page.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import appConfig from "@/config/theme.config";
import { useSession } from "@/shared/session";
import { useCurrentUser } from "@/entities/user";
import { AppHeader } from "@/widgets/app-header";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { DashboardHero } from "./dashboard-hero";
import { QuickActions } from "./quick-actions";
import { UpcomingModules } from "./upcoming-modules";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buen dia";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

function getFormattedDate() {
  const formatted = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useSession();
  const { user, isLoading } = useCurrentUser();
  const { farmsCount, herdsCount, cowsCount, isLoading: isLoadingStats } = useDashboardStats();

  // sin sesion valida no hay nada que mostrar aca; se corta el flujo en vez de renderizar en falso
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || isLoading || !user) {
    return <div className="flex flex-1 items-center justify-center text-sm text-rufo-text-muted">Cargando...</div>;
  }

  const modules = [...appConfig.modules].sort((a, b) => a.order - b.order);
  const activeModule = modules.find((module) => module.enabled) ?? modules[0];
  const upcomingModules = modules.filter((module) => module.id !== activeModule.id);

  return (
    <div className="flex flex-1 flex-col">
      <AppHeader user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <p className="text-sm text-rufo-text-muted">{getFormattedDate()}</p>
        <h1 className="mt-1 text-2xl font-bold text-rufo-text sm:text-3xl">
          {getGreeting()}, {user.firstName}
        </h1>
        <p className="mt-1 text-sm text-rufo-text-muted">Elegi por donde seguir con el campo hoy.</p>

        <div className="mt-6">
          <DashboardHero
            module={activeModule}
            isLoadingStats={isLoadingStats}
            stats={[
              { value: farmsCount, label: "campos" },
              { value: herdsCount, label: "rodeos" },
              { value: cowsCount, label: "animales" },
            ]}
          />
        </div>

        <div className="mt-10">
          <QuickActions />
        </div>

        <div className="mt-10">
          <UpcomingModules modules={upcomingModules} />
        </div>
      </main>
    </div>
  );
}
