import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type FormMode = 'login' | 'register';

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<FormMode>('login');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'manager' | 'worker'>('worker');
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple navigation based on role selection, without actual auth
    if (role === 'manager') {
      navigate('/dashboard/manager');
    } else {
      navigate('/dashboard/worker');
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? 'Login to Your Account' : 'Create a New Account'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Username
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Role
            </label>
            <div className="flex space-x-16">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="manager"
                  checked={role === 'manager'}
                  onChange={() => setRole('manager')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Manager</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="worker"
                  checked={role === 'worker'}
                  onChange={() => setRole('worker')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Worker</span>
              </label>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {mode === 'login' ? 'Sign In' : 'Register'}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
            >
              {mode === 'login'
                ? 'Need an account? Register'
                : 'Already have an account? Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;