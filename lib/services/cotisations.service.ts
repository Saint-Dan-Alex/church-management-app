import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface Cotisation {
  id: string;
  membre_nom: string;
  type_cotisation: 'mensuelle' | 'annuelle' | 'speciale' | 'autre';
  montant: number;
  devise: 'CDF' | 'USD';
  date_cotisation: string;
  mois: string;
  annee: string;
  enregistre_par: string;
  enregistre_par_nom: string;
  remarque?: string | null;
  created_at: string;
  updated_at: string;
}

export const cotisationsService = {
  async getAll(params?: { type_cotisation?: string; annee?: string }): Promise<Cotisation[]> {
    const queryParams = new URLSearchParams();
    if (params?.type_cotisation) queryParams.append('type_cotisation', params.type_cotisation);
    if (params?.annee) queryParams.append('annee', params.annee);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Cotisation[]>(`/cotisations${query}`);
  },

  async getById(id: string): Promise<Cotisation> {
    return api.get<Cotisation>(`/cotisations/${id}`);
  },

  async create(data: Partial<Cotisation>): Promise<Cotisation> {
    return api.post<Cotisation>('/cotisations', data);
  },

  async update(id: string, data: Partial<Cotisation>): Promise<Cotisation> {
    return api.put<Cotisation>(`/cotisations/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/cotisations/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/cotisations-statistics');
  },
};
