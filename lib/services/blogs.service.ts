import { api } from '@/lib/utils/api';
import type { Blog } from '@/lib/types/api';

export const blogsService = {
  async getAll(params?: { status?: string }): Promise<Blog[]> {
    const query = params?.status ? `?status=${params.status}` : '';
    return api.get<Blog[]>(`/blogs${query}`);
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
};
