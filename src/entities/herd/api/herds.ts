// entities/herd/api/herds.ts
import { httpClient } from "@/shared/api";
import type { Herd, HerdRequest } from "../model/types";

export async function fetchHerdsByFarm(farmId: number): Promise<Herd[]> {
  const response = await httpClient.get<Herd[]>(`/api/farms/${farmId}/herds`);
  return response.data;
}

export async function createHerd(farmId: number, data: HerdRequest): Promise<Herd> {
  const response = await httpClient.post<Herd>(`/api/farms/${farmId}/herds`, data);
  return response.data;
}

export async function updateHerd(id: number, data: HerdRequest): Promise<Herd> {
  const response = await httpClient.patch<Herd>(`/api/herds/${id}`, data);
  return response.data;
}

export async function deactivateHerd(id: number): Promise<void> {
  await httpClient.delete(`/api/herds/${id}`);
}
