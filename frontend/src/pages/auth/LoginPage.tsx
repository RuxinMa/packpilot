import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useAuthContext } from '../../contexts/AuthContext';
import { FaUserShield, FaInfoCircle } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const { 
    login, 
    isLoading, 
    error, 
    isAuthenticated, 
    role, 
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
    <div className="min-h-screen flex flex-col justify-center space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg"> 
        <div className="text-center">
          <div className="mb-6">
            <FaUserShield className="mx-auto h-14 w-14 text-blue-600 drop-shadow-sm" />
          </div>
          <h1 className="mb-4 text-center text-2xl sm:text-4xl font-extrabold text-gray-900 whitespace-nowrap">
            PackPilot Warehouse System
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
            Welcome Back!
          </h2>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-2xl border border-gray-100 sm:rounded-xl sm:px-10 relative">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-b-full"></div>
          
          {/* Form Content */}
          <div className="mt-2">
            <LoginForm 
              onSubmit={handleLogin}
              isLoading={isLoading}
              error={error}
            />

            {/* Account Access Information */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 shadow-sm">
                <div className="flex items-start">
                  <FaInfoCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1 text-[10px] sm:text-sm"
                    >
                      Need Account Access?
                    </p>
                    <p className="text-blue-700 leading-relaxed text-[8px] sm:text-xs"
                    >
                      Please contact your system administrator or warehouse manager to obtain login credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-xs text-gray-400">
          © 2025 PackPilot. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;