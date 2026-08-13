"use client"

// entities/user/hooks/use-current-user.ts
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/shared/session";
import { fetchCurrentUser } from "../api/current-user";

export function useCurrentUser() {
  const { isAuthenticated } = useSession();

  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: fetchCurrentUser,
    enabled: isAuthenticated,
  });

  return { user: query.data, isLoading: query.isLoading, error: query.error };
}
