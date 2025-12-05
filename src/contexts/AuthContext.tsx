// ============================================================================
// ENUX - Authentication Context
// ============================================================================

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { useCurrentUser, useLogin, useLogout, useRegister } from '@/hooks/queries';
import { getToken, clearTokens } from '@/services';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';

// ----------------------------------------------------------------------------
// Context Types
// ----------------------------------------------------------------------------

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// ----------------------------------------------------------------------------
// Context
// ----------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ----------------------------------------------------------------------------
// Provider
// ----------------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [error, setError] = useState<string | null>(null);

  // Query hooks
  const { data: user, isLoading: isLoadingUser, refetch } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  // Check for existing token on mount
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      refetch().finally(() => setIsInitialized(true));
    } else {
      setIsInitialized(true);
    }
  }, [refetch]);

  // Login handler
  const login = useCallback(async (credentials: LoginCredentials) => {
    setError(null);
    try {
      await loginMutation.mutateAsync(credentials);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, [loginMutation]);

  // Register handler
  const register = useCallback(async (credentials: RegisterCredentials) => {
    setError(null);
    try {
      await registerMutation.mutateAsync(credentials);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    }
  }, [registerMutation]);

  // Logout handler
  const logout = useCallback(async () => {
    setError(null);
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      // Even if API fails, we still want to clear local state
      clearTokens();
    }
  }, [logoutMutation]);

  // Clear error handler
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Compute loading state
  const isLoading = !isInitialized || isLoadingUser || loginMutation.isPending || registerMutation.isPending;

  // Context value
  const value: AuthContextValue = {
    user: user ?? null,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ----------------------------------------------------------------------------
// Hook
// ----------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ----------------------------------------------------------------------------
// Export
// ----------------------------------------------------------------------------

export { AuthContext };
