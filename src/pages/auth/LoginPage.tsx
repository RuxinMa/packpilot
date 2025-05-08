import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string, role: 'manager' | 'worker') => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual login logic with API
      console.log('Login attempt:', { username, password, role });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect based on role would happen here
      // For now just log success
      console.log('Login successful');
      
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
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