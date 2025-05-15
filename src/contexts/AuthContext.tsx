// import { LoginResponse, UserRole } from '../types/auth';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, LoginResponse } from '../types/auth'; 

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole | null;
  username: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string, role: 'manager' | 'worker') => Promise<LoginResponse>;
  logout: () => void;
}

const MOCK_USERS = [
  { username: 'manager1', password: 'password', role: 'Manager' as UserRole },
  { username: 'worker1', password: 'password', role: 'Worker' as UserRole }
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const auth = useAuth();
  
//   return (
//     <AuthContext.Provider value={auth}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// Mock Testing
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 从本地存储中检查已有的登录状态
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      try {
        const { isAuthenticated, role } = JSON.parse(storedAuth);
        setIsAuthenticated(isAuthenticated);
        setRole(role as UserRole); // 使用类型断言确保与 UserRole 类型兼容
      } catch (err) {
        // 如果解析错误，清除无效的存储
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // 模拟登录流程
  const login = async (username: string, password: string, selectedRole: 'manager' | 'worker') => {
    setIsLoading(true);
    setError(null);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 将 selectedRole 首字母大写，转换为 UserRole 类型
    const roleFormatted = selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1) as UserRole;
    
    // 本地验证逻辑 - 模拟后端验证
    const matchedUser = MOCK_USERS.find(user => 
      user.username === username && user.password === password
    );
    
    if (matchedUser) {
      // 检查选择的角色是否匹配用户角色
      if (matchedUser.role !== roleFormatted) {
        setError(`Invalid role selected. You are a ${matchedUser.role}.`);
        setIsLoading(false);
        return;
      }
      
      // 模拟登录成功
      setIsAuthenticated(true);
      setRole(matchedUser.role);
      
      // 存储到本地存储
      localStorage.setItem('auth', JSON.stringify({
        isAuthenticated: true,
        role: matchedUser.role
      }));
      
      setIsLoading(false);
      
      // 模拟一个符合 LoginResponse 类型的响应
      const response: LoginResponse = {
        status: 'success',
        message: 'Login successful',
        token: 'mock-jwt-token',
        role: matchedUser.role,
        redirect_url: `/dashboard/${matchedUser.role.toLowerCase()}`
      };
      
      console.log('Login response:', response);
    } else {
      // 模拟登录失败
      setError('Invalid username or password');
      setIsLoading(false);
      
      // 模拟一个失败的 LoginResponse
      const response: LoginResponse = {
        status: 'error',
        message: 'Invalid credentials',
        token: null,
        role: null,
        redirect_url: null
      };
      
      console.log('Login failed:', response);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      role, 
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