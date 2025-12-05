/**
 * Service API pour les notifications
 */

import { api } from '../utils/api'

export interface Notification {
    id: string
    user_id: string
    type: 'info' | 'success' | 'warning' | 'error' | 'payment' | 'presence' | 'activity' | 'general'
    title: string
    message: string
    data?: any
    action_url?: string
    read_at?: string | null
    created_at: string
    updated_at: string
}

export interface PaginatedNotifications {
    current_page: number
    data: Notification[]
    total: number
    per_page: number
    last_page: number
}

export const notificationsService = {
    /**
     * Récupérer toutes les notifications
     */
    async getAll(params?: { unread_only?: boolean; per_page?: number }): Promise<PaginatedNotifications> {
        const queryParams = new URLSearchParams()
        if (params?.unread_only) queryParams.append('unread_only', 'true')
        if (params?.per_page) queryParams.append('per_page', params.per_page.toString())

        const query = queryParams.toString()
        return api.get<PaginatedNotifications>(`/notifications${query ? `?${query}` : ''}`)
    },

    /**
     * Récupérer le nombre de notifications non lues
     */
    async getUnreadCount(): Promise<{ count: number }> {
        return api.get<{ count: number }>('/notifications/unread-count')
    },

    /**
     * Marquer une notification comme lue
     */
    async markAsRead(id: string): Promise<{ message: string; data: Notification }> {
        return api.post<{ message: string; data: Notification }>(`/notifications/${id}/mark-read`)
    },

    /**
     * Marquer toutes les notifications comme lues
     */
    async markAllAsRead(): Promise<{ message: string; count: number }> {
        return api.post<{ message: string; count: number }>('/notifications/mark-all-read')
    },

    /**
     * Supprimer une notification
     */
    async delete(id: string): Promise<{ message: string }> {
        return api.delete<{ message: string }>(`/notifications/${id}`)
    },

    /**
     * Supprimer toutes les notifications lues
     */
    async deleteAllRead(): Promise<{ message: string; count: number }> {
        return api.delete<{ message: string; count: number }>('/notifications/delete-all-read')
    },

    /**
     * Créer une nouvelle notification (pour tests)
     */
    async create(data: Partial<Notification>): Promise<{ message: string; data: Notification }> {
        return api.post<{ message: string; data: Notification }>('/notifications', data)
    },
}
