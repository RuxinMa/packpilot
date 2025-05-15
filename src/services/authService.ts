import { ApiResponse, LoginResponse, UserRole } from '../types/auth';

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
      
      const data = await response.json();
      
      // Successfully logged in
      if (data.status === 'success' && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', username);
      }
      
      return data as LoginResponse;
    } catch (error) {
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
  
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  getToken() {
    return localStorage.getItem('token');
  },
  
  getRole() {
    return localStorage.getItem('role') as UserRole | null;
  },
  
  getUsername() {
    return localStorage.getItem('username');
  },
  
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default authService;