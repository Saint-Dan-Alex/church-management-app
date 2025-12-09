import { api } from '@/lib/utils/api';
import type { Blog } from '@/lib/types/api';

export const blogsService = {
  async getAll(params?: { status?: string }): Promise<any> {
    const query = params?.status ? `?status=${params.status}` : '';
    return api.get(`/blogs${query}`);
  },

  async getPublished(): Promise<Blog[]> {
    return api.get<Blog[]>('/blogs-published');
  },

  async getById(id: string): Promise<Blog> {
    return api.get<Blog>(`/blogs/${id}`);
  },

  async create(data: Partial<Blog>): Promise<Blog> {
    return api.post<Blog>('/blogs', data);
  },

  async update(id: string, data: Partial<Blog>): Promise<Blog> {
    return api.put<Blog>(`/blogs/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return api.delete(`/blogs/${id}`);
  },

  async getCategories(): Promise<import('@/lib/types/api').BlogCategory[]> {
    return api.get<import('@/lib/types/api').BlogCategory[]>('/blog-categories');
  },

  async uploadImage(formData: FormData): Promise<{ url: string; path: string }> {
    return api.post('/upload', formData);
  },
};
