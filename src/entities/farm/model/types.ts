// entities/farm/model/types.ts

export interface Farm {
  id: number;
  name: string;
  description: string | null;
  areaHectares: number | null;
  renspaCode: string | null;
  countryId: number | null;
  provinceId: number | null;
  cityId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FarmRequest {
  name: string;
  description?: string;
  areaHectares?: number;
  renspaCode?: string;
  countryId?: number;
  provinceId?: number;
  cityId?: number;
}
