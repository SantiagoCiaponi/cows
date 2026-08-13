// entities/cow/api/cows.ts
import { httpClient } from "@/shared/api";
import type { Cow, CowRequest } from "../model/types";

export async function fetchCowsByFarm(farmId: number): Promise<Cow[]> {
  const response = await httpClient.get<Cow[]>(`/api/farms/${farmId}/cows`);
  return response.data;
}

export async function createCow(farmId: number, data: CowRequest): Promise<Cow> {
  const response = await httpClient.post<Cow>(`/api/farms/${farmId}/cows`, data);
  return response.data;
}

export async function deactivateCow(id: number): Promise<void> {
  await httpClient.delete(`/api/cows/${id}`);
}
