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
      console.log('Submitting login form:', { username, role });
      onSubmit(username, password, role);
    }
  };

  // Determine which error to display (validation error takes priority over API error)
  const displayError = validationError || error;

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      {displayError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {displayError}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Role selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select your role
        </label>
        <div className="flex space-x-6 justify-center">
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
      </div>
      
      {/* Username field */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter your username"
        />
      </div>

      {/* Password field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
            placeholder="Enter your password"
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

      {/* Debug info (should be removed in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <strong>Debug Info:</strong> {username} / {role} / Loading: {isLoading.toString()}
        </div>
      )}
    </form>
  );
};

export default LoginForm;