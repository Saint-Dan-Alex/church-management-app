import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface CotisationType {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Cotisation {
  id: string;
  membre_nom: string;
  cotisation_type_id?: string | null;
  type?: CotisationType | null;
  type_cotisation?: string; // Legacy/input
  montant: number;
  devise: 'CDF' | 'USD';
  date_cotisation: string;
  mois?: string | null;
  annee?: string | null;
  mode_paiement: string;
  numero_recu?: string | null;
  remarque?: string | null;
  enregistre_par: string;
  enregistre_par_nom: string;
  created_at: string;
  updated_at: string;
}

export const cotisationsService = {
  async getAll(params?: Record<string, any>): Promise<any> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });
    }

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<any>(`/cotisations${query}`);
  },

  async getTypes(): Promise<CotisationType[]> {
    return api.get<CotisationType[]>('/cotisation-types');
  },

  async getById(id: string): Promise<Cotisation> {
    return api.get<Cotisation>(`/cotisations/${id}`);
  },

  async create(data: Partial<Cotisation> & { type_cotisation?: string }): Promise<Cotisation> {
    return api.post<Cotisation>('/cotisations', data);
  },

  async update(id: string, data: Partial<Cotisation> & { type_cotisation?: string }): Promise<Cotisation> {
    return api.put<Cotisation>(`/cotisations/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/cotisations/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/cotisations-statistics');
  },
};
