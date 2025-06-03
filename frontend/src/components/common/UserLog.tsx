import React, { useState } from 'react';
import LogoutConfirmModal from './LogoutModal';

interface UserLogProps {
  username: string;
  loading?: boolean;
  onLogout: () => void;
}

const UserLog: React.FC<UserLogProps> = ({ 
  username, 
  loading = false, 
  onLogout 
}) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState<boolean>(false);
  
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };
  
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };
  
  return (
    <>
      <div className="mt-auto border-t border-gray-200 p-5 pt-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            ) : (
              <span className="text-gray-600 font-medium text-sm">
                {username.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            {loading ? (
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-20"></div>
              </div>
            ) : (
              <div className="font-medium text-2xl text-gray-900" title={username}>
                {username}
              </div>
            )}
          </div>
        </div>
        <div className='mx-7'>
          <button 
            onClick={handleLogoutClick}
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Log out'}
          </button>
        </div>
      </div>
      
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default UserLog;