import { cookies } from "next/headers"

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

async function getAuthHeader() {
    const cookieStore = await cookies()
    const token = cookieStore.get("api-token")?.value
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
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

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const apiServer = {
    async get<T>(path: string, options?: RequestInit): Promise<T> {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
                ...options?.headers,
            },
            ...options,
        });
        return handleResponse<T>(response);
    },

    async post<T>(path: string, data?: any, options?: RequestInit): Promise<T> {
        const headers = await getAuthHeader();
        const response = await fetch(`${API_BASE_URL}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...headers,
                ...options?.headers,
            },
            body: data ? JSON.stringify(data) : undefined,
            ...options,
        });
        return handleResponse<T>(response);
    }
};
