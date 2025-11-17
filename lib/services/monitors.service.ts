import { api } from '@/lib/utils/api';
import type { Monitor as ApiMonitor, PaginatedResponse, Statistics } from '@/lib/types/api';

// Helper pour convertir les dates en format accepté par Laravel (YYYY-MM-DD)
function toApiDate(value?: string | Date | null): string | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export const monitorsService = {
  /**
   * Récupérer tous les moniteurs
   */
  async getAll(params?: { per_page?: number; page?: number }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    // Laravel renvoie directement les données avec les métadonnées de pagination
    return await api.get(`/monitors${query}`);
  },

  /**
   * Récupérer un moniteur par ID
   */
  async getById(id: string): Promise<ApiMonitor> {
    return api.get<ApiMonitor>(`/monitors/${id}`);
  },

  /**
   * Créer un nouveau moniteur
   */
  async create(data: any): Promise<ApiMonitor> {
    const payload: any = {
      nom: data.nom,
      post_nom: data.postNom,
      prenom: data.prenom,
      date_naissance: toApiDate(data.dateNaissance),
      email: data.email,
      telephone: data.telephone,
      adresse: data.adresse,
      photo: data.photo ?? null,
      date_conversion: toApiDate(data.dateConversion),
      date_bapteme: toApiDate(data.dateBapteme),
      baptise_saint_esprit: Boolean(data.baptiseSaintEsprit),
      etat_civil: data.etatCivil,
      date_adhesion: toApiDate(data.dateAdhesion),
      salle_actuelle_id: data.salleActuelleId ?? null,
      salle_actuelle_nom: data.salleActuelleNom ?? null,
      role_actuel: data.roleActuel ?? null,
      date_affectation_actuelle: toApiDate(data.dateAffectationActuelle),
    };

    return api.post<ApiMonitor>('/monitors', payload);
  },

  /**
   * Mettre à jour un moniteur
   */
  async update(id: string, data: any): Promise<ApiMonitor> {
    const payload: any = {
      ...(data.nom !== undefined && { nom: data.nom }),
      ...(data.postNom !== undefined && { post_nom: data.postNom }),
      ...(data.prenom !== undefined && { prenom: data.prenom }),
      ...(data.dateNaissance !== undefined && { date_naissance: toApiDate(data.dateNaissance) }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.telephone !== undefined && { telephone: data.telephone }),
      ...(data.adresse !== undefined && { adresse: data.adresse }),
      ...(data.photo !== undefined && { photo: data.photo }),
      ...(data.dateConversion !== undefined && { date_conversion: toApiDate(data.dateConversion) }),
      ...(data.dateBapteme !== undefined && { date_bapteme: toApiDate(data.dateBapteme) }),
      ...(data.baptiseSaintEsprit !== undefined && { baptise_saint_esprit: Boolean(data.baptiseSaintEsprit) }),
      ...(data.etatCivil !== undefined && { etat_civil: data.etatCivil }),
      ...(data.dateAdhesion !== undefined && { date_adhesion: toApiDate(data.dateAdhesion) }),
      ...(data.salleActuelleId !== undefined && { salle_actuelle_id: data.salleActuelleId }),
      ...(data.salleActuelleNom !== undefined && { salle_actuelle_nom: data.salleActuelleNom }),
      ...(data.roleActuel !== undefined && { role_actuel: data.roleActuel }),
      ...(data.dateAffectationActuelle !== undefined && { date_affectation_actuelle: toApiDate(data.dateAffectationActuelle) }),
    };

    return api.put<ApiMonitor>(`/monitors/${id}`, payload);
  },

  /**
   * Supprimer un moniteur
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/monitors/${id}`);
  },

  /**
   * Récupérer les statistiques des moniteurs
   */
  async getStatistics(): Promise<Statistics> {
    return api.get<Statistics>('/monitors-statistics');
  },
};
