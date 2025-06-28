import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (username: string, password: string, role: 'manager' | 'worker') => void;
  isLoading: boolean;
  error: string | null;
  onClearError?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  isLoading, 
  error,
  onClearError 
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'manager' | 'worker'>('worker');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear errors when input changes
  useEffect(() => {
    if (validationError) {
      setValidationError(null);
    }
    if (error && onClearError) {
      onClearError();
    }
  }, [username, password, role]);

  const validateForm = (): boolean => {
    if (username.length < 5 || username.length > 20) {
      setValidationError('Username must be 5-20 characters');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationError('Username can only contain alphanumeric and underscores.');
      return false;
    }

    if (password.trim() === '') {
      setValidationError('Please enter the password');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setValidationError(null);
    if (onClearError) {
      onClearError();
    }
    
    // Validate form
    if (validateForm()) {
      onSubmit(username, password, role);
    }
  };

  // Determine which error to display (validation error takes priority over API error)
  const displayError = validationError || error;

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {displayError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{displayError}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Role selection - matching RegisterForm */}
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
      
      {/* Username field - matching RegisterForm layout */}
      <div className="flex justify-around gap-4 items-center">
        <label htmlFor="username" className="block font-medium text-gray-700">
          Username
        </label>
        <div className="mt-1 flex-1">
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            data-form-type="other"
          />
        </div>
      </div>

      {/* Password field - matching RegisterForm layout with show/hide functionality */}
      <div className="flex justify-around gap-4 items-center">
        <label htmlFor="password" className="block font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 flex-1 relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            data-form-type="other" // remove browser password detection
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <div>
        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
          variant="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;