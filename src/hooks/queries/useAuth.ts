// ============================================================================
// ENUX - Auth Query Hooks
// ============================================================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, getToken, clearTokens } from '@/services';
import type { LoginCredentials, RegisterCredentials } from '@/types';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// ----------------------------------------------------------------------------
// Query Hooks
// ----------------------------------------------------------------------------

/**
 * Get current authenticated user
 */
export function useCurrentUser() {
  const token = getToken();

  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => authService.getCurrentUser(),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // User data is considered fresh for 5 minutes
    retry: false, // Don't retry on 401 errors
  });
}

/**
 * Check if user is authenticated
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, isError } = useCurrentUser();
  return {
    isAuthenticated: !!user && !isError,
    isLoading,
    user,
  };
}

// ----------------------------------------------------------------------------
// Mutation Hooks
// ----------------------------------------------------------------------------

/**
 * Login mutation
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
}

/**
 * Register mutation
 */
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authService.register(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
}

/**
 * Logout mutation
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data on logout
      queryClient.clear();
    },
    onError: () => {
      // Even if logout API fails, clear local data
      clearTokens();
      queryClient.clear();
    },
  });
}

/**
 * Request password reset
 */
export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
}

/**
 * Reset password
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
  });
}

/**
 * Change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authService.changePassword(currentPassword, newPassword),
  });
}

/**
 * Verify email
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}

/**
 * Resend verification email
 */
export function useResendVerificationEmail() {
  return useMutation({
    mutationFn: () => authService.resendVerificationEmail(),
  });
}

/**
 * Refresh token
 */
export function useRefreshToken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authService.refreshToken(refreshToken),
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
    },
  });
}
