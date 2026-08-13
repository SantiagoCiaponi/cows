// entities/farm/api/farms.ts
import { httpClient } from "@/shared/api";
import type { Farm, FarmRequest } from "../model/types";

export async function fetchFarms(): Promise<Farm[]> {
  const response = await httpClient.get<Farm[]>("/api/farms");
  return response.data;
}

export async function createFarm(data: FarmRequest): Promise<Farm> {
  const response = await httpClient.post<Farm>("/api/farms", data);
  return response.data;
}

export async function updateFarm(id: number, data: FarmRequest): Promise<Farm> {
  const response = await httpClient.patch<Farm>(`/api/farms/${id}`, data);
  return response.data;
}

export async function deactivateFarm(id: number): Promise<void> {
  await httpClient.delete(`/api/farms/${id}`);
}
