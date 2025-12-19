import { api } from '../utils/api'

export interface Activity {
  id: string
  title: string
  description: string
  date: string
  end_date?: string
  time: string
  duration: string
  location: string
  category: string
  type: string
  price?: number
  currency?: string
  participants: number | any[]
  maxParticipants: number
  status: string
  organizer: string
  updated_at?: string
  audience?: "public" | "moniteurs"
}

export interface CreateActivityData {
  title: string
  description: string
  date: string
  end_date?: string
  time: string
  duration: string
  location: string
  category: string
  type: string
  maxParticipants: number
  status: string
  organizer: string
  price?: number
  currency?: string
  audience?: "public" | "moniteurs"
}

export const activitiesService = {
  async getAll(params?: {
    type?: string
    statut?: string
    date_debut?: string
    date_fin?: string
    per_page?: number
  }) {
    let url = '/activities'
    if (params) {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
      const queryString = queryParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }
    return await api.get(url)
  },

  async getById(id: string) {
    return await api.get(`/activities/${id}`)
  },

  async create(data: CreateActivityData) {
    return await api.post('/activities', data)
  },

  async update(id: string, data: Partial<CreateActivityData>) {
    return await api.put(`/activities/${id}`, data)
  },

  async delete(id: string) {
    return await api.delete(`/activities/${id}`)
  },

  async getStatistics(id: string) {
    return await api.get(`/activities/${id}/statistics`)
  },

  async getCategories() {
    return await api.get('/activities/categories/list')
  },

  async getParticipants(id: string) {
    const activity = await this.getById(id) as Activity
    return activity.participants || []
  },

  async addParticipant(id: string, data: any) {
    return await api.post(`/activities/${id}/participants`, data)
  },

  async updateParticipant(activityId: string, participantId: string, data: any) {
    return await api.put(`/activities/${activityId}/participants/${participantId}`, data)
  },

  async addPayment(data: any) {
    return await api.post('/payments', data)
  },

  async addExpense(data: any) {
    return await api.post('/expenses', data)
  },
}
