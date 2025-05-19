import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import Button from '../../components/common/Button';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (
    username: string,
    password: string,
    role: 'manager' | 'worker'
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Register attempt:', { username, password, role });
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Register successful');
      setIsRegistered(true);
    } catch (err) {
      setError('Failed to create account');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center space-y-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mb-10 text-center text-4xl font-extrabold text-gray-900">
          Warehouse System
        </h1>
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {isRegistered ? 'Welcome to PackPilot!' : 'Join PackPilot'}
        </h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isRegistered ? (
            <div className="space-y-6 text-center">
              <p className="text-lg text-green-700 font-semibold">Registration successful!</p>
              <Button variant="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          ) : (
            <>
              <RegisterForm
                onSubmit={handleRegister}
                isLoading={isLoading}
                error={error}
              />
              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

