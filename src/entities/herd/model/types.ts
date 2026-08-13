// entities/herd/model/types.ts

export interface Herd {
  id: number;
  farmId: number;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HerdRequest {
  name: string;
  description?: string;
}
