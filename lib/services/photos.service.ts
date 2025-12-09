import { api } from '@/lib/utils/api';

export interface PhotoAlbum {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface Photo {
  id: string;
  titre: string;
  description?: string | null;
  url: string;
  photo_album_id?: string | null;
  album?: PhotoAlbum | null;
  date?: string | null;
  auteur?: string | null;
  created_at: string;
  updated_at: string;
}

export const photosService = {
  async getAll(params?: { album?: string }): Promise<any> {
    const query = params?.album ? `?album=${params.album}` : '';
    return api.get<any>(`/photos${query}`);
  },

  async getAlbums(): Promise<PhotoAlbum[]> {
    return api.get<PhotoAlbum[]>('/photo-albums');
  },

  async getById(id: string): Promise<Photo> {
    return api.get<Photo>(`/photos/${id}`);
  },

  async create(data: Partial<Photo> & { album?: string }): Promise<Photo> {
    return api.post<Photo>('/photos', data);
  },

  async update(id: string, data: Partial<Photo> & { album?: string }): Promise<Photo> {
    return api.put<Photo>(`/photos/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/photos/${id}`);
  },
};
