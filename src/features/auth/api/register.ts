// features/auth/api/register.ts
import { httpClient } from "@/shared/api";
import type { RegisterRequest, AuthResponse } from "../model/types";

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/api/auth/register", data);
  return response.data;
}
