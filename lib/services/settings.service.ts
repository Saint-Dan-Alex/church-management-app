import { api } from "@/lib/utils/api"

export interface Setting {
    id?: number
    key: string
    value: string | null
    group?: string
    type?: string // 'text', 'image', 'color', 'boolean', 'json'
    description?: string
    is_public?: boolean
}

export const settingsService = {
    /**
     * Récupérer tous les paramètres (admin)
     */
    async getAll(params?: { group?: string }): Promise<Setting[]> {
        try {
            // Build query string
            let query = ''
            if (params?.group) {
                query = `?group=${params.group}`
            }
            return await api.get(`/settings${query}`)
        } catch (error) {
            console.error("Error fetching settings:", error)
            return []
        }
    },

    /**
     * Récupérer les paramètres publics (pour l'initialisation de l'app)
     */
    async getPublicSettings(): Promise<Record<string, any>> {
        try {
            return await api.get('/public-settings')
        } catch (error) {
            console.error("Error fetching public settings:", error)
            return {}
        }
    },

    /**
     * Mettre à jour des paramètres
     */
    async updateSettings(settings: { key: string; value: any }[]): Promise<any> {
        return await api.post('/settings/update', { settings })
    },

    /**
     * Upload un fichier pour un paramètre (logo, etc)
     */
    async uploadFile(key: string, file: File, group: string = 'general'): Promise<{ url: string }> {
        const formData = new FormData()
        formData.append('key', key)
        formData.append('file', file)
        formData.append('group', group)

        // Note: api.post gère généralement le JSON, il faut peut-être forcer le content-type ou utiliser une méthode dédiée pour le FormData si l'intercepteur le gère mal. 
        // Assumons que notre client API gère FormData ou utilisons fetch direct si besoin.
        // Pour l'instant, essayons via api.post, souvent les libs axios détectent FormData.
        return await api.post('/settings/upload', formData)
    }
}
