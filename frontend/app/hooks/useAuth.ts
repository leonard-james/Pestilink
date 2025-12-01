import { useCallback, useEffect, useState } from 'react';
import { api } from '@/app/services/api';

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.login({ email, password });
        
        setToken(response.token);
        setUser(response.user);
        
        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authUser', JSON.stringify(response.user));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string, passwordConfirmation: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.register({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });

        setToken(response.token);
        setUser(response.user);

        // Store in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authUser', JSON.stringify(response.user));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (token) {
        await api.logout(token);
      }

      setUser(null);
      setToken(null);

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logout failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
};
