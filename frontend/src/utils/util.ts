
import axios from 'axios'

interface ApiResponse<T> {
    isSuccess: boolean;
    error: {
        code: string;
        message: string;
    }
    data: T;
}
export interface TodoItem {
    _id: string;
    name: string;
}
export interface FetchResult<T> {
    success: boolean;
    data: T;
    error?: string;
}

export const fetchData = async<T = unknown>({
    url, 
    method = 'GET', 
    data, 
    ...config
}: {
    url: string, 
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    data?: Record<string, unknown>;
}): Promise<FetchResult<T | null>> => {
    try {
        const response = await axios({
            url, 
            method,
            data,
            ...config
        });

        const result: ApiResponse<T> = response.data;

        if (result.isSuccess) {
            return {
                success: true,
                data: result.data
            };
        }


        return {
            success: false,
            data: null,
            error: result.error.message
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return {
                success: false,
                data: null,
                error: error.response?.data?.message || error.message || 'Request Failed!'
            }
        }

        return {
            success: false,
            data: null,
            error: 'An unexpected error occurred'
        }
    }
}