import { api } from '@/lib/utils/api';
import type { Activity, Statistics } from '@/lib/types/api';

export const activitiesService = {
  /**
   * Récupérer toutes les activités
   */
  async getAll(params?: { type?: string; statut?: string }): Promise<Activity[]> {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.statut) queryParams.append('statut', params.statut);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Activity[]>(`/activities${query}`);
  },

  /**
   * Récupérer une activité par ID
   */
  async getById(id: string): Promise<Activity> {
    return api.get<Activity>(`/activities/${id}`);
  },

  /**
   * Créer une nouvelle activité
   */
  async create(data: Partial<Activity>): Promise<Activity> {
    return api.post<Activity>('/activities', data);
  },

  /**
   * Mettre à jour une activité
   */
  async update(id: string, data: Partial<Activity>): Promise<Activity> {
    return api.put<Activity>(`/activities/${id}`, data);
  },

  /**
   * Supprimer une activité
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/activities/${id}`);
  },

  /**
   * Récupérer les statistiques d'une activité
   */
  async getStatistics(id: string): Promise<Statistics> {
    return api.get<Statistics>(`/activities/${id}/statistics`);
  },
};
