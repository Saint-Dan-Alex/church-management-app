import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface Payment {
  id: string;
  activity_nom: string;
  participant_id: string;
  participant_nom: string;
  participant_prenom: string;
  participant_nom_complet: string;
  montant: number;
  devise: 'CDF' | 'USD';
  date_paiement?: string | null;
  date_echeance: string;
  numero_paiement: string;
  statut: 'en_attente' | 'paye' | 'en_retard' | 'annule';
  mode_paiement?: string | null;
  reference?: string | null;
  remarque?: string | null;
  created_at: string;
  updated_at: string;
}

export const paymentsService = {
  async getAll(params?: { statut?: string; participant_id?: string }): Promise<Payment[]> {
    const queryParams = new URLSearchParams();
    if (params?.statut) queryParams.append('statut', params.statut);
    if (params?.participant_id) queryParams.append('participant_id', params.participant_id);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<Payment[]>(`/payments${query}`);
  },

  async getById(id: string): Promise<Payment> {
    return api.get<Payment>(`/payments/${id}`);
  },

  async create(data: Partial<Payment>): Promise<Payment> {
    return api.post<Payment>('/payments', data);
  },

  async update(id: string, data: Partial<Payment>): Promise<Payment> {
    return api.put<Payment>(`/payments/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/payments/${id}`);
  },

  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/payments-statistics');
  },
};
