import { api } from '@/lib/utils/api';

export interface Teaching {
  id: string;
  date_seance: string;
  theme: string;
  sous_theme?: string | null;
  sujet: string;
  textes_bibliques: string;
  but_pedagogique: string;
  verset_retenir: string;
  materiel_didactique?: string | null;
  sujet_revision?: string | null;
  sensibilisation?: string | null;
  questions_reponses?: string | null;
  question_decouverte?: string | null;
  reponse_decouverte?: string | null;
  type_contenu: 'points_developper' | 'developpement';
  conclusion?: string | null;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export const teachingsService = {
  async getAll(): Promise<Teaching[]> {
    return api.get<Teaching[]>('/teachings');
  },

  async getById(id: string): Promise<Teaching> {
    return api.get<Teaching>(`/teachings/${id}`);
  },

  async create(data: Partial<Teaching>): Promise<Teaching> {
    return api.post<Teaching>('/teachings', data);
  },

  async update(id: string, data: Partial<Teaching>): Promise<Teaching> {
    return api.put<Teaching>(`/teachings/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/teachings/${id}`);
  },
};
