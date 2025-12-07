import { api } from '@/lib/utils/api';

export interface Commission {
    id: string;
    nom: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export const commissionsService = {
    /**
     * Récupérer toutes les commissions
     */
    async getAll(): Promise<Commission[]> {
        return api.get<Commission[]>('/commissions');
    },

    /**
     * Créer une nouvelle commission
     */
    async create(data: { nom: string; description?: string }): Promise<Commission> {
        return api.post<Commission>('/commissions', data);
    },
};
