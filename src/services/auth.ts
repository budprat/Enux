// ============================================================================
// ENUX - Authentication Service
// ============================================================================

import { apiClient, setToken, setRefreshToken, clearTokens } from './api';
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  ApiResponse,
} from '@/types';

// ----------------------------------------------------------------------------
// Auth Service
// ----------------------------------------------------------------------------

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials,
      { skipAuth: true }
    );

    // Store tokens
    setToken(response.data.token);
    setRefreshToken(response.data.refreshToken);

    return response.data;
  },

  /**
   * Register a new user
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      credentials,
      { skipAuth: true }
    );

    // Store tokens
    setToken(response.data.token);
    setRefreshToken(response.data.refreshToken);

    return response.data;
  },

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  /**
   * Refresh the access token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh',
      { refreshToken },
      { skipAuth: true }
    );

    // Update tokens
    setToken(response.data.token);
    setRefreshToken(response.data.refreshToken);

    return response.data;
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset/request', { email }, { skipAuth: true });
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', { token, newPassword }, { skipAuth: true });
  },

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', { currentPassword, newPassword });
  },

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { token }, { skipAuth: true });
  },

  /**
   * Resend verification email
   */
  async resendVerificationEmail(): Promise<void> {
    await apiClient.post('/auth/resend-verification');
  },
};
