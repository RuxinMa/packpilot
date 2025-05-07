import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'manager' | 'worker'>('manager');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log('Registration attempt:', { username, password, confirmPassword, role });

      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟请求

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
          <form onSubmit={handleRegister} className="space-y-4">
            {step === 1 && (
              <>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-4 w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded"
                >
                  Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="text" // 👈 不用 password 类型，明文
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />

                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  required
                />

                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'manager' | 'worker')}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="manager">Manager</option>
                  <option value="worker">Worker</option>
                </select>

                <button
                  type="submit"
                  className="mt-4 w-full bg-green-600 text-white hover:bg-green-700 py-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </button>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              </>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
