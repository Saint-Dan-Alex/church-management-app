import { api } from '@/lib/utils/api';
import { Teaching } from '@/types/teaching';

export const teachingsService = {
  async getAll(): Promise<Teaching[]> {
    const response = await api.get<any>('/teachings');
    // Gérer la pagination Laravel (si response.data existe et est un tableau)
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    // Si c'est déjà un tableau
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  },

  async getById(id: string): Promise<Teaching> {
    return api.get<Teaching>(`/teachings/${id}`);
  },

  async create(data: Partial<Teaching>): Promise<Teaching> {
    return api.post<Teaching>('/teachings', data);
  },

  async update(id: string, data: Partial<Teaching>): Promise<Teaching> {
    return api.put<Teaching>(`/teachings/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/teachings/${id}`);
  },
};
