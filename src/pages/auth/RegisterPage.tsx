import React, { useState } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (
    username: string, 
    password: string, 
    confirmPassword: string, 
    role: 'manager' | 'worker'
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement actual registration logic with API
      console.log('Registration attempt:', { username, password, confirmPassword, role });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to login would happen here
      console.log('Registration successful');
      
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center space-y-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mb-10 text-center text-4xl font-extrabold text-gray-900">Warehouse System</h1>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          Create A New Account
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm 
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error}
          />
          
          {/* Todo: implement redirect to log in page */}
          
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;