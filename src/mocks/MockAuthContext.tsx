// MockAuthContext.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { UserRole } from '../types/auth'; // 确保路径正确

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (username: string, password: string, role: 'manager' | 'worker') => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// 创建模拟的 AuthContext
const MockAuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟提供者组件
export const MockAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 模拟登录函数
  const login = async (username: string, password: string, selectedRole: 'manager' | 'worker') => {
    setIsLoading(true);
    setError(null);
    
    // 模拟 API 调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 模拟登录验证逻辑
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
    
    // 模拟登录失败
    setError('Invalid username or password');
    setIsLoading(false);
  };

  // 模拟注销函数
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

// 使用模拟 AuthContext 的自定义 hook
export const useMockAuthContext = () => {
  const context = useContext(MockAuthContext);
  if (context === undefined) {
    throw new Error('useMockAuthContext must be used within a MockAuthProvider');
  }
  return context;
};