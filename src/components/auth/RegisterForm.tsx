import React, { useState } from 'react';
import Button from '../common/Button';

interface RegisterFormProps {
  onSubmit: (
    username: string,
    password: string,
    role: 'manager' | 'worker'
  ) => void;
  isLoading: boolean;
  error: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading, error }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'manager' | 'worker'>('worker');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(username, password, role);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="mt-2 flex space-x-4 justify-around">
        <div className="flex items-center">
          <input
            id="worker"
            name="role"
            type="radio"
            checked={role === 'worker'}
            onChange={() => setRole('worker')}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor="worker" className="ml-2 block text-lg text-gray-700">
            Worker
          </label>
        </div>
        <div className="flex items-center">
          <input
            id="manager"
            name="role"
            type="radio"
            checked={role === 'manager'}
            onChange={() => setRole('manager')}
            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
          />
          <label htmlFor="manager" className="ml-2 block text-lg text-gray-700">
            Manager
          </label>
        </div>
      </div>

      <div className="flex justify-around gap-4 items-center">
        <label htmlFor="username" className="block font-medium text-gray-700">
          Username
        </label>
        <div className="mt-1 flex-1">
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-around gap-4 items-center">
        <label htmlFor="password" className="block font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 flex-1">
          <input
            id="password"
            name="password"
            type="text"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
          variant="primary"
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;

