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

export interface GlobalStats {
  totalEffectif: number;
  totalFreres: number;
  totalSoeurs: number;
  totalNouveauxVenus: number;
  moyenneEffectif: number;
  moyenneFreres: number;
  moyenneSoeurs: number;
  moyenneNouveauxVenus: number;
  offrandes: string[];
  totalOffrandes: string;
  rapportsParSalle: Record<string, number>;
  totalCultes: number;
  // Room-specific properties (optional, only for room statistics)
  salle?: string;
  nombreCultes?: number;
  meilleurePresence?: {
    date: string;
    effectif: number;
  } | null;
  moinsPresence?: {
    date: string;
    effectif: number;
  } | null;
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

  async getGlobalStatistics(params?: { date_debut?: string; date_fin?: string }): Promise<GlobalStats> {
    const queryParams = new URLSearchParams();
    if (params?.date_debut) queryParams.append('date_debut', params.date_debut);
    if (params?.date_fin) queryParams.append('date_fin', params.date_fin);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<GlobalStats>(`/worship-reports-global-statistics${query}`);
  },

  async getRoomStatistics(params: { salle: string; date_debut?: string; date_fin?: string }): Promise<GlobalStats> {
    const queryParams = new URLSearchParams();
    queryParams.append('salle', params.salle);
    if (params?.date_debut) queryParams.append('date_debut', params.date_debut);
    if (params?.date_fin) queryParams.append('date_fin', params.date_fin);

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return api.get<GlobalStats>(`/worship-reports-room-statistics${query}`);
  },
};
