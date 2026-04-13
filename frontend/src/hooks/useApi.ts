import axios, { type AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react"

interface useApiResponse<T = unknown> {
    statusCode: number;
    data: T | null;
    message: string;
    success: boolean;
    errors?: unknown[];
}

interface useApiOptions {
    headers?: Record<string, string>;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    skip?: boolean;
} 

interface useApiState<T> {
    data: T | null,
    loading: boolean,
    error: string | null
}

export const useApi = <T>(
    url: string,
    options: useApiOptions
):useApiState<T> => {
    const [data, setData] = useState<T | null >(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {headers={}, method='GET', body, skip=false} = options;

    const cancelTokenSource = axios.CancelToken.source();

    useEffect(() => {

        if (skip) return;

        (async() => {

            setLoading(true);
            setError(null);
            setData(null);

            try {
                const config: AxiosRequestConfig = { 
                url,
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                cancelToken: cancelTokenSource.token
            }

            if (body && method !== 'GET') {
                config.data = body;
            }

            const response = await axios(config) 
            
            const result: useApiResponse<T> = await response.data;

            if (result && result.success) {
                setData(result.data);
            } else if (result && !result.success) {
                setError(result.message || 'Request failed');
            }

            setLoading(false);

          } catch (error: unknown) {
                setLoading(false);

                if (error && typeof error === 'object' && 'response' in error) {
                    const axiosError = error as { response?: { data: useApiResponse<T> } };
                    if (axiosError.response?.data) {
                        setError(axiosError.response.data.message || 'An error occurred');
                    } else {
                        setError('An error occurred');
                    }
                } else if (error && typeof error === 'object' && 'message' in error) {
                    setError((error as { message: string }).message || 'An error occurred');
                } else {
                    setError('An error occurred');
                }
            }


        })()
        
        return () => {
            cancelTokenSource.cancel(
                "Request Cancelled due to component unmount or dependency change"
            )
        }

    }, [url, method, skip, JSON.stringify(headers), JSON.stringify(body)]) // eslint-disable-line react-hooks/exhaustive-deps

    return { data, loading, error };

}