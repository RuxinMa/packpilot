import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuthContext } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { 
    login, 
    isLoading, 
    error, 
    isAuthenticated, 
    role, 
    clearError 
  } = useAuthContext();
  const navigate = useNavigate();
    
  // If user already logged in, redirect to certain page
  useEffect(() => {
    if (isAuthenticated && role) {
      console.log('User already authenticated, redirecting to dashboard:', role);
      navigate(`/dashboard/${role.toLowerCase()}`);
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (username: string, password: string, selectedRole: 'manager' | 'worker') => {
    console.log('LoginPage handling login for:', { username, selectedRole });
    
    try {
      const response = await login(username, password, selectedRole);
      
      if (response.status === 'success' && response.role) {
        console.log('Login successful, will redirect via useEffect');
        // Redirect will be handled by useEffect above
      } else {
        console.log('Login failed:', response.message);
        // Error will be displayed automatically through LoginForm
      }
    } catch (error) {
      console.error('Login error in LoginPage:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center space-y-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mb-10 text-center text-4xl font-extrabold text-gray-900">Warehouse System</h1>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Welcome Back!
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
          />

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
          
        </div>
      </div>

      {/* Development debug info - only visible in development mode */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-semibold mb-1">Debug Info:</div>
          <div>Auth: {isAuthenticated.toString()}</div>
          <div>Role: {role || 'None'}</div>
          <div>Loading: {isLoading.toString()}</div>
          <div>Error: {error ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;