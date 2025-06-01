import { useState, useEffect, useCallback } from 'react';
import { LoginResponse } from '../types/auth';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state
  const initializeAuth = useCallback(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
  }, []);

  // Login function
  const login = async (username: string, password: string, role: string): Promise<LoginResponse> => {
    setIsLoading(true);
    
    try {
      const response = await authService.login(username, password, role);
      
      if (response.status === 'success' && response.token) {
        setIsAuthenticated(true);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        message: 'Login failed',
        token: null,
        role: null,
        redirect_url: null
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
  }, []);

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return {
    isLoading,
    isAuthenticated,
    login,
    logout,
    // Helper methods for convenience
    getRole: authService.getRole,
    getUsername: authService.getUsername,
    getToken: authService.getToken
  };
};