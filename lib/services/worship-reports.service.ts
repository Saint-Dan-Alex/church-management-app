import { api } from '@/lib/utils/api';
import type { Statistics } from '@/lib/types/api';

export interface WorshipReport {
  id: string;
  date: string;
  salle: 'Jardin' | 'Ainés' | 'Juniors' | 'Cadets' | 'Adolescents';
  orateurs: string[];
  predicateur: string;
  moniteurs: string[];
  effectif_freres: number;
  effectif_soeurs: number;
  effectif_total?: number;
  offrandes: string;
  nombre_nouveaux_venus: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export const worshipReportsService = {
  async getAll(params?: { salle?: string }): Promise<WorshipReport[]> {
    const query = params?.salle ? `?salle=${params.salle}` : '';
    return api.get<WorshipReport[]>(`/worship-reports${query}`);
  },

  async getById(id: string): Promise<WorshipReport> {
    return api.get<WorshipReport>(`/worship-reports/${id}`);
  },

  async create(data: Partial<WorshipReport>): Promise<WorshipReport> {
    return api.post<WorshipReport>('/worship-reports', data);
  },

  async update(id: string, data: Partial<WorshipReport>): Promise<WorshipReport> {
    return api.put<WorshipReport>(`/worship-reports/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/worship-reports/${id}`);
  },

  async getGlobalStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/worship-reports-global-statistics');
  },
};
