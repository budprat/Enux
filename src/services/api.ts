// ============================================================================
// ENUX - Base API Client
// ============================================================================

import type { ApiError, ApiResponse, PaginatedResponse } from '@/types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10);

// Token storage keys
const TOKEN_KEY = 'enux_token';
const REFRESH_TOKEN_KEY = 'enux_refresh_token';

// ----------------------------------------------------------------------------
// Token Management
// ----------------------------------------------------------------------------

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

export const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ----------------------------------------------------------------------------
// API Error Class
// ----------------------------------------------------------------------------

export class ApiClientError extends Error {
  public status: number;
  public code: string;
  public details?: Record<string, string[]>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiClientError';
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

// ----------------------------------------------------------------------------
// Request Helpers
// ----------------------------------------------------------------------------

interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

const createAbortController = (timeout: number): { controller: AbortController; timeoutId: NodeJS.Timeout } => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  return { controller, timeoutId };
};

const buildHeaders = (options?: RequestOptions): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (!options?.skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    let errorData: ApiError;

    try {
      errorData = await response.json();
    } catch {
      errorData = {
        message: response.statusText || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        status: response.status,
      };
    }

    throw new ApiClientError(errorData);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text);
};

// ----------------------------------------------------------------------------
// Base API Client
// ----------------------------------------------------------------------------

export const apiClient = {
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { controller, timeoutId } = createAbortController(options?.timeout || API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: buildHeaders(options),
        signal: controller.signal,
        ...options,
      });

      return handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { controller, timeoutId } = createAbortController(options?.timeout || API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      });

      return handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { controller, timeoutId } = createAbortController(options?.timeout || API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: buildHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      });

      return handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    const { controller, timeoutId } = createAbortController(options?.timeout || API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers: buildHeaders(options),
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
        ...options,
      });

      return handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { controller, timeoutId } = createAbortController(options?.timeout || API_TIMEOUT);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: buildHeaders(options),
        signal: controller.signal,
        ...options,
      });

      return handleResponse<T>(response);
    } finally {
      clearTimeout(timeoutId);
    }
  },
};

// ----------------------------------------------------------------------------
// Query String Builder
// ----------------------------------------------------------------------------

export const buildQueryString = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

// ----------------------------------------------------------------------------
// Export Types
// ----------------------------------------------------------------------------

export type { ApiError, ApiResponse, PaginatedResponse };
