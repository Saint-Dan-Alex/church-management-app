import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface Presence {
  id: string;
  activity_id: string;
  activity_nom: string;
  moniteur_id: string;
  moniteur_nom: string;
  moniteur_prenom: string;
  moniteur_nom_complet: string;
  date_presence: string;
  heure_arrivee: string;
  heure_depart?: string | null;
  statut: 'present' | 'absent' | 'retard' | 'excuse';
  mode_enregistrement: 'qr_code' | 'manuel' | 'auto';
  remarque?: string | null;
  created_at: string;
  updated_at: string;
}

export const presencesService = {
  async getAll(params?: { activity_id?: string; moniteur_id?: string; statut?: string }): Promise<Presence[]> {
    const queryParams = new URLSearchParams();
    if (params?.activity_id) queryParams.append('activity_id', params.activity_id);
    if (params?.moniteur_id) queryParams.append('moniteur_id', params.moniteur_id);
    if (params?.statut) queryParams.append('statut', params.statut);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Presence[]>(`/presences${query}`);
  },

  async getById(id: string): Promise<Presence> {
    return api.get<Presence>(`/presences/${id}`);
  },

  async create(data: Partial<Presence>): Promise<Presence> {
    return api.post<Presence>('/presences', data);
  },

  async update(id: string, data: Partial<Presence>): Promise<Presence> {
    return api.put<Presence>(`/presences/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/presences/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/presences-statistics');
  },
};
