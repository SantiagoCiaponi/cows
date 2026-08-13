// features/auth/api/login.ts
import { httpClient } from "@/shared/api";
import type { LoginRequest, AuthResponse } from "../model/types";

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await httpClient.post<AuthResponse>("/api/auth/login", data);
  return response.data;
}
