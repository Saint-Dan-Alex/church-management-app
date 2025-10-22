import { api } from '@/lib/utils/api';

export interface Photo {
  id: string;
  titre: string;
  description?: string | null;
  url: string;
  album: string;
  date_prise?: string | null;
  created_at: string;
  updated_at: string;
}

export const photosService = {
  async getAll(params?: { album?: string }): Promise<Photo[]> {
    const query = params?.album ? `?album=${params.album}` : '';
    return api.get<Photo[]>(`/photos${query}`);
  },

  async getAlbums(): Promise<string[]> {
    return api.get<string[]>('/photos-albums');
  },

  async getById(id: string): Promise<Photo> {
    return api.get<Photo>(`/photos/${id}`);
  },

  async create(data: Partial<Photo>): Promise<Photo> {
    return api.post<Photo>('/photos', data);
  },

  async update(id: string, data: Partial<Photo>): Promise<Photo> {
    return api.put<Photo>(`/photos/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/photos/${id}`);
  },
};
