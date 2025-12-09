import { api } from '@/lib/utils/api';
import type { Video, VideoCategory } from '@/lib/types/api';

export const videosService = {
  async getAll(params?: { category?: string }): Promise<any> {
    const query = params?.category ? `?category=${params.category}` : '';
    return api.get(`/videos${query}`);
  },

  async getCategories(): Promise<VideoCategory[]> {
    return api.get<VideoCategory[]>('/video-categories');
  },

  async getFeatured(): Promise<any> {
    return api.get('/videos-featured');
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
