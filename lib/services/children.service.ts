import { api } from '@/lib/utils/api';
import type { Child, Statistics } from '@/lib/types/api';

export const childrenService = {
  /**
   * Récupérer tous les enfants
   */
  async getAll(params?: { per_page?: number; page?: number; salle?: string }): Promise<Child[]> {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.salle) queryParams.append('salle', params.salle);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Child[]>(`/children${query}`);
  },

  /**
   * Récupérer un enfant par ID
   */
  async getById(id: string): Promise<Child> {
    return api.get<Child>(`/children/${id}`);
  },

  /**
   * Créer un nouvel enfant
   */
  async create(data: Partial<Child>): Promise<Child> {
    return api.post<Child>('/children', data);
  },

  /**
   * Mettre à jour un enfant
   */
  async update(id: string, data: Partial<Child>): Promise<Child> {
    return api.put<Child>(`/children/${id}`, data);
  },

  /**
   * Supprimer un enfant
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/children/${id}`);
  },

  /**
   * Récupérer les statistiques des enfants
   */
  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/children-statistics');
  },
};
