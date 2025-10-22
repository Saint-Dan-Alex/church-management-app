import { api } from '@/lib/utils/api';
import type { Salle } from '@/lib/types/api';

export const sallesService = {
  /**
   * Récupérer toutes les salles
   */
  async getAll(): Promise<Salle[]> {
    return api.get<Salle[]>('/salles');
  },

  /**
   * Récupérer une salle par ID
   */
  async getById(id: string): Promise<Salle> {
    return api.get<Salle>(`/salles/${id}`);
  },

  /**
   * Créer une nouvelle salle
   */
  async create(data: Partial<Salle>): Promise<Salle> {
    return api.post<Salle>('/salles', data);
  },

  /**
   * Mettre à jour une salle
   */
  async update(id: string, data: Partial<Salle>): Promise<Salle> {
    return api.put<Salle>(`/salles/${id}`, data);
  },

  /**
   * Supprimer une salle
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/salles/${id}`);
  },
};
