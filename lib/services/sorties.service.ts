import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface Sortie {
  id: string;
  libelle: string;
  description?: string | null;
  categorie: 'salaires' | 'fournitures' | 'equipements' | 'loyer' | 'electricite' | 'eau' | 'internet' | 'transport' | 'reparations' | 'dons' | 'autre';
  montant: number;
  devise: 'CDF' | 'USD';
  date_sortie: string;
  beneficiaire?: string | null;
  reference?: string | null;
  remarque?: string | null;
  enregistre_par: string;
  enregistre_par_nom: string;
  created_at: string;
  updated_at: string;
}

export const sortiesService = {
  async getAll(params?: { categorie?: string }): Promise<Sortie[]> {
    const query = params?.categorie ? `?categorie=${params.categorie}` : '';
    return api.get<Sortie[]>(`/sorties${query}`);
  },

  async getById(id: string): Promise<Sortie> {
    return api.get<Sortie>(`/sorties/${id}`);
  },

  async create(data: Partial<Sortie>): Promise<Sortie> {
    return api.post<Sortie>('/sorties', data);
  },

  async update(id: string, data: Partial<Sortie>): Promise<Sortie> {
    return api.put<Sortie>(`/sorties/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/sorties/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/sorties-statistics');
  },
};
