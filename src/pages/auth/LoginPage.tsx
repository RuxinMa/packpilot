import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuthContext } from '../../contexts/AuthContext';
// import { useMockAuthContext } from '../../mocks/MockAuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoading, error, isAuthenticated, role } = useAuthContext();
  const navigate = useNavigate();
    
  // if user already logged, redireact to certain page
  useEffect(() => {
    if (isAuthenticated && role) {
      navigate(`/dashboard/${role.toLowerCase()}`);
    }
  }, [isAuthenticated, role, navigate]);

  const handleLogin = async (username: string, password: string, role: 'manager' | 'worker') => {
    await login(username, password, role)
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
          />

          <div className="mt-6 text-center text-sm text-gray-600">
            Don’t have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default LoginPage