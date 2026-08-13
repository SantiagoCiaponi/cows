// entities/cow/model/types.ts

export type CowSex = "M" | "F";

export interface Cow {
  id: number;
  farmId: number;
  herdId: number;
  visualTag: string | null;
  rfidTag: string | null;
  renspaOrigin: string | null;
  category: string;
  sex: CowSex;
  breed: string | null;
  coatColor: string | null;
  birthDate: string | null;
  photoUrl: string | null;
  motherId: number | null;
  fatherId: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CowRequest {
  herdId: number;
  visualTag?: string;
  rfidTag?: string;
  renspaOrigin?: string;
  category: string;
  sex: CowSex;
  breed?: string;
  coatColor?: string;
  birthDate?: string;
  photoUrl?: string;
  motherId?: number;
  fatherId?: number;
}

// categorias tipicas de hacienda bovina en Argentina
export const COW_CATEGORIES = ["Vaca", "Vaquillona", "Novillo", "Toro", "Ternero", "Ternera"] as const;
