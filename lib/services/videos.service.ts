import { api } from '@/lib/utils/api';
import type { Video } from '@/lib/types/api';

export const videosService = {
  async getAll(params?: { categorie?: string }): Promise<Video[]> {
    const query = params?.categorie ? `?categorie=${params.categorie}` : '';
    return api.get<Video[]>(`/videos${query}`);
  },

  async getFeatured(): Promise<Video[]> {
    return api.get<Video[]>('/videos-featured');
  },

  async getById(id: string): Promise<Video> {
    return api.get<Video>(`/videos/${id}`);
  },

  async create(data: Partial<Video>): Promise<Video> {
    return api.post<Video>('/videos', data);
  },

  async update(id: string, data: Partial<Video>): Promise<Video> {
    return api.put<Video>(`/videos/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/videos/${id}`);
  },
};
