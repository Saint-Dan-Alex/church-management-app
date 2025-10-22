import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface Expense {
  id: string;
  activity_id: string;
  activity_nom: string;
  categorie: 'transport' | 'repas' | 'materiel' | 'location' | 'decoration' | 'sonorisation' | 'honoraires' | 'cadeaux' | 'autre';
  description: string;
  montant: number;
  devise: 'CDF' | 'USD';
  date: string;
  beneficiaire?: string | null;
  reference_facture?: string | null;
  remarque?: string | null;
  ajoute_par: string;
  ajoute_par_nom: string;
  created_at: string;
  updated_at: string;
}

export const expensesService = {
  async getAll(params?: { categorie?: string; activity_id?: string }): Promise<Expense[]> {
    const queryParams = new URLSearchParams();
    if (params?.categorie) queryParams.append('categorie', params.categorie);
    if (params?.activity_id) queryParams.append('activity_id', params.activity_id);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Expense[]>(`/expenses${query}`);
  },

  async getById(id: string): Promise<Expense> {
    return api.get<Expense>(`/expenses/${id}`);
  },

  async create(data: Partial<Expense>): Promise<Expense> {
    return api.post<Expense>('/expenses', data);
  },

  async update(id: string, data: Partial<Expense>): Promise<Expense> {
    return api.put<Expense>(`/expenses/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/expenses/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/expenses-statistics');
  },
};
