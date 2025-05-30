import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, LoginResponse } from '../types/auth';
import { MOCK_USERS } from '../mocks/dataManager';

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string, role: 'manager' | 'worker') => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Auth Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check existing login status from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { isAuthenticated, role, username } = JSON.parse(storedAuth);
        setIsAuthenticated(isAuthenticated);
        setRole(role as UserRole);
        setUsername(username);
      } catch (err) {
        // Clear invalid storage if parsing fails
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // Mock login process
  const login = async (username: string, password: string, selectedRole: 'manager' | 'worker'): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Convert selectedRole to UserRole format
    const roleFormatted = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) as UserRole;
    
    // Local validation logic - simulate backend validation using centralized mock data
    const matchedUser = MOCK_USERS.find(user => 
      user.username === username && user.password === password
    );
    
    if (matchedUser) {
      // Check if selected role matches user role
      if (matchedUser.role !== roleFormatted) {
        const errorMsg = `Invalid role selected. You are a ${matchedUser.role}.`;
        setError(errorMsg);
        setIsLoading(false);
        return {
          status: 'error',
          message: errorMsg,
          token: null,
          role: null,
          redirect_url: null
        };
      }
      
      // Simulate successful login
      setIsAuthenticated(true);
      setRole(matchedUser.role);
      setUsername(matchedUser.username);
      
      // Store to localStorage
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        role: matchedUser.role,
        username: matchedUser.username
      }));
      
      setIsLoading(false);
      
      // Return successful LoginResponse
      const response: LoginResponse = {
        status: 'success',
        message: 'Login successful',
        token: 'mock-jwt-token',
        role: matchedUser.role,
        redirect_url: `/dashboard/${matchedUser.role.toLowerCase()}`
      };
      
      console.log('Login successful:', response);
      return response;
    } else {
      // Simulate login failure
      const errorMsg = 'Invalid username or password';
      setError(errorMsg);
      setIsLoading(false);
      
      // Return failed LoginResponse
      const response: LoginResponse = {
        status: 'error',
        message: errorMsg,
        token: null,
        role: null,
        redirect_url: null
      };
      
      console.log('Login failed:', response);
      return response;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
    localStorage.removeItem('auth');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      role, 
      username,
      login, 
      logout,
      isLoading,
      error
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