import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, LoginResponse } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string, role: 'manager' | 'worker') => Promise<LoginResponse>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider using authService (unified storage approach)
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use authService's storage approach to check login status
  useEffect(() => {
    const initializeAuth = () => {
      const isAuth = authService.isAuthenticated();
      const storedRole = authService.getRole();
      const storedUsername = authService.getUsername();
      
      console.log('Initializing auth state:', { isAuth, storedRole, storedUsername });
      
      if (isAuth && storedRole && storedUsername) {
        setIsAuthenticated(true);
        setRole(storedRole);
        setUsername(storedUsername);
      } else {
        // If auth info is incomplete, clear all state
        authService.logout();
        setIsAuthenticated(false);
        setRole(null);
        setUsername(null);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string, selectedRole: 'manager' | 'worker'): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    
    console.log('Starting login process:', { username, role: selectedRole });
    
    try {
      // Use authService for login
      const response = await authService.login(username, password, selectedRole);
      
      console.log('Login API response:', response);
      
      if (response.status === 'success' && response.token && response.role) {
        // Login successful, update Context state
        setIsAuthenticated(true);
        setRole(response.role);
        setUsername(username);
        setError(null);
        
        console.log('Login successful, state updated');
      } else {
        // Login failed, update error state
        setError(response.message);
        setIsAuthenticated(false);
        setRole(null);
        setUsername(null);
        
        console.log('Login failed:', response.message);
      }
      
      return response;
      
    } catch (error) {
      console.error('Error during login process:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unable to connect to server. Please check your internet connection.';
      const errorResponse: LoginResponse = {
        status: 'error',
        message: errorMessage,
        token: null,
        role: null,
        redirect_url: null
      };
      
      setError(errorMessage);
      setIsAuthenticated(false);
      setRole(null);
      setUsername(null);
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('User logging out');
    
    // Use authService to clear auth info
    authService.logout();
    
    // Update Context state
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
    setError(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      role, 
      username,
      login, 
      logout,
      isLoading,
      error,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;