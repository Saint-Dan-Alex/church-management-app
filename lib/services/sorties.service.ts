import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface SortieCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Sortie {
  id: string;
  libelle: string;
  description?: string | null;
  sortie_category_id?: string | null;
  category?: SortieCategory | null;
  categorie?: string; // Legacy/input
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
  async getAll(params?: { categorie?: string }): Promise<any> {
    const query = params?.categorie ? `?categorie=${params.categorie}` : '';
    return api.get<any>(`/sorties${query}`);
  },

  async getCategories(): Promise<SortieCategory[]> {
    return api.get<SortieCategory[]>('/sortie-categories');
  },

  async getById(id: string): Promise<Sortie> {
    return api.get<Sortie>(`/sorties/${id}`);
  },

  async create(data: Partial<Sortie> & { categorie?: string }): Promise<Sortie> {
    return api.post<Sortie>('/sorties', data);
  },

  async update(id: string, data: Partial<Sortie> & { categorie?: string }): Promise<Sortie> {
    return api.put<Sortie>(`/sorties/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/sorties/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/sorties-statistics');
  },
};
