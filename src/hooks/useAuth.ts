import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { LoginResponse, UserRole } from '../types/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = () => {
      console.warn('Navigation attempted outside router context');
    };
  }

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      
      if (authenticated) {
        setRole(authService.getRole());
        setUsername(authService.getUsername());
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string, role: 'Manager' | 'Worker') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(username, password, role);
      
      if (response.status === 'success') {
        setIsAuthenticated(true);
        setRole(authService.getRole());
        setUsername(username);
        
        // If the API returns a redirect URL, navigate to that URL
        if (response.redirect_url) {
          navigate(response.redirect_url);
        }
        
        return response;
      } else {
        setError(response.message);
        return response;
      }
    } catch (err) {
      setError('error during login');
      return {
        status: 'error',
        message: 'error during login',
        token: null,
        role: null,
        redirect_url: null
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setRole(null);
    setUsername(null);
    navigate('/login');
  };

  return {
    isAuthenticated,
    role,
    username,
    isLoading,
    error,
    login,
    logout
  };
};

export default useAuth;