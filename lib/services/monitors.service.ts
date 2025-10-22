import { api } from '@/lib/utils/api';
import type { Monitor, PaginatedResponse, Statistics } from '@/lib/types/api';

export const monitorsService = {
  /**
   * Récupérer tous les moniteurs
   */
  async getAll(params?: { per_page?: number; page?: number }): Promise<Monitor[]> {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Monitor[]>(`/monitors${query}`);
  },

  /**
   * Récupérer un moniteur par ID
   */
  async getById(id: string): Promise<Monitor> {
    return api.get<Monitor>(`/monitors/${id}`);
  },

  /**
   * Créer un nouveau moniteur
   */
  async create(data: Partial<Monitor>): Promise<Monitor> {
    return api.post<Monitor>('/monitors', data);
  },

  /**
   * Mettre à jour un moniteur
   */
  async update(id: string, data: Partial<Monitor>): Promise<Monitor> {
    return api.put<Monitor>(`/monitors/${id}`, data);
  },

  /**
   * Supprimer un moniteur
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/monitors/${id}`);
  },

  /**
   * Récupérer les statistiques des moniteurs
   */
  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/monitors-statistics');
  },
};
