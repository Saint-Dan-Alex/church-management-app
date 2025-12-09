/**
 * Client HTTP pour l'API Laravel
 * Base URL: http://127.0.0.1:8000/api/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(
      `API Error: ${response.status} ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Si la réponse est vide (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const api = {
  /**
   * GET request
   */
  async get<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });
    return handleResponse<T>(response);
  },

  /**
   * POST request
   */
  async post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    const isFormData = data instanceof FormData;
    const headers: any = {
      'Accept': 'application/json',
      ...options?.headers,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: headers,
      credentials: 'include',
      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options,
    });
    return handleResponse<T>(response);
  },

  /**
   * PUT request
   */
  async put<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  /**
   * PATCH request
   */
  async patch<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  /**
   * DELETE request
   */
  async delete<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      credentials: 'include',
      ...options,
    });
    return handleResponse<T>(response);
  },
};

// Export default pour compatibilité
export default api;
