import { LoginResponse, UserRole } from '../types/auth';

const API_URL = 'http://localhost:8000';

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
        throw new Error(`HTTP error! status: ${response.status}`);
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
        message: 'Network error, please check your connection',
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