// MockAuthContext.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { UserRole } from '../types/auth'; 

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (username: string, password: string, role: 'manager' | 'worker') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create a mock AuthContext
const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock provider component
export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulated login function
  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulated login verification logic
    if (username === 'test_worker' && password === 'password') {
      setIsAuthenticated(true);
      setRole('Worker');
      setIsLoading(false);
      return;
    } 
    else if (username === 'test_manager' && password === 'password') {
      setIsAuthenticated(true);
      setRole('Manager');
      setIsLoading(false);
      return;
    }
    
    // Simulated login failure
    setError('Invalid username or password');
    setIsLoading(false);
  };

  // Simulated logout function
  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <MockAuthContext.Provider value={{ 
      isAuthenticated, 
      role, 
      login, 
      logout,
      isLoading,
      error
    }}>
      {children}
    </MockAuthContext.Provider>
  );
};

// Custom hook to use mock AuthContext
export const useMockAuthContext = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuthContext must be used within a MockAuthProvider');
  }
  return context;
};