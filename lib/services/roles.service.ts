import { api } from '@/lib/utils/api';

export interface ApiRole {
  id: number;
  name: string;
  guard_name: string;
}

export const rolesService = {
  async getAll(): Promise<ApiRole[]> {
    return api.get<ApiRole[]>('/roles');
  },
};
