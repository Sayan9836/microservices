import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

interface ApiResponse<T> {
    success: boolean;
    error?: {
        code: string;
        message: string;
    }
    message?: string;
    data: T;
}

export interface Category {
    id: string;
    name: string;
}

export interface TodoItem {
    id: string;
    name: string;
    completed: boolean;
    categoryId?: string | null;
    category?: Category | null;
}

export interface FetchResult<T> {
    success: boolean;
    data: T;
    error?: string;
}

export const fetchData = async <T = unknown>({
    url,
    method = 'GET',
    data,
    ...config
}: {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: Record<string, unknown>;
} & AxiosRequestConfig): Promise<FetchResult<T | null>> => {
    try {
        const response = await api({
            url,
            method,
            data,
            ...config
        });

        // The backend might return ApiResponse<T> or just T
        const result = response.data;

        // If the backend uses the success wrapper
        if (result && typeof result === 'object' && 'success' in result) {
            if (result.success) {
                return {
                    success: true,
                    data: result.data
                };
            }
            return {
                success: false,
                data: null,
                error: result.message || result.error?.message || 'Request failed'
            }
        }

        // If the backend returns raw data directly (standard axios behavior)
        return {
            success: true,
            data: result
        };

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const serverError = error.response?.data;
            return {
                success: false,
                data: null,
                error: serverError?.message || serverError?.error?.message || error.message || 'Request Failed!'
            }
        }

        return {
            success: false,
            data: null,
            error: 'An unexpected error occurred'
        }
    }
}