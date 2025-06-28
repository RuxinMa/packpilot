import { LoginResponse, UserRole } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const authService = { 
  async login(username: string, password: string, role: string): Promise<LoginResponse> {
    try {
      const apiRole = role.charAt(0).toUpperCase() + role.slice(1);
      
      const response = await fetch(`${API_URL}/api/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          role: apiRole,
        }),
      });
      
      if (!response.ok) {
        // Handle different HTTP status codes with specific messages
        if (response.status === 401) {
          return {
            status: 'error',
            message: 'Invalid username or password',
            token: null,
            role: null,
            redirect_url: null
          };
        } else if (response.status === 403) {
          return {
            status: 'error',
            message: 'Access denied. Please check your role.',
            token: null,
            role: null,
            redirect_url: null
          };
        } else if (response.status >= 500) {
          return {
            status: 'error',
            message: 'Server error. Please try again later.',
            token: null,
            role: null,
            redirect_url: null
          };
        } else {
          return {
            status: 'error',
            message: 'Login failed. Please check your credentials.',
            token: null,
            role: null,
            redirect_url: null
          };
        }
      }
      
      const data: LoginResponse = await response.json();
      
      // Successfully logged in
      if (data.status === 'success' && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || '');
        localStorage.setItem('username', username);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        status: 'error',
        message: 'Unable to connect to server. Please check your internet connection.',
        token: null,
        role: null,
        redirect_url: null
      };
    }
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
  
  getToken(): string | null {
    return localStorage.getItem('token');
  },
  
  getRole(): UserRole | null {
    return localStorage.getItem('role') as UserRole | null;
  },
  
  getUsername(): string | null {
    return localStorage.getItem('username');
  },
  
  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default authService;