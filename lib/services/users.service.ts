import { api } from '@/lib/utils/api';
import type { User } from '@/lib/types/api';

export const usersService = {
  /**
   * Récupérer tous les utilisateurs
   */
  async getAll(): Promise<User[]> {
    return api.get<User[]>('/users');
  },

  /**
   * Récupérer un utilisateur par ID
   */
  async getById(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },

  /**
   * Créer un nouvel utilisateur
   */
  async create(data: Partial<User>): Promise<User> {
    return api.post<User>('/users', data);
  },

  /**
   * Mettre à jour un utilisateur
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    return api.put<User>(`/users/${id}`, data);
  },

  /**
   * Supprimer un utilisateur
   */
  async delete(id: string): Promise<void> {
    return api.delete(`/users/${id}`);
  },
};
