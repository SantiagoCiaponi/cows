// entities/user/api/current-user.ts
import { httpClient } from "@/shared/api";
import type { User } from "../model/types";

export async function fetchCurrentUser(): Promise<User> {
  const response = await httpClient.get<User>("/api/auth/me");
  return response.data;
}
