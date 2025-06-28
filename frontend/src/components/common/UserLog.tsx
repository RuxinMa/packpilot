import React, { useState } from 'react';
import LogoutConfirmModal from './LogoutModal';
import Button from './Button';

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
      <div className="mt-auto border-t border-gray-200 p-5 pt-5">
        <div className="flex items-center gap-3 mb-4">
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
              <div className="font-medium text-xl text-gray-900" title={username}>
                {username}
              </div>
            )}
          </div>
        </div>
        <div className='mx-7'>
          <Button
            variant="secondary"
            size="md"
            fullWidth={true}
            onClick={handleLogoutClick}
            disabled={loading}
            isLoading={loading}
            className="h-10"
          >
            Log out
          </Button>
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