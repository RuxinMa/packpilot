import React, { useState } from 'react';
import LogoutConfirmModal from './LogoutModal';

interface UserLogProps {
  userType: string;
  onLogout: () => void;
}

const UserLog: React.FC<UserLogProps> = ({ userType, onLogout }) => {
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
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-gray-300"></div>
          <div>
            <div className="font-medium text-xl">{userType}</div>
          </div>
        </div>
        <div className='mx-7'>
          <button 
            onClick={handleLogoutClick}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Log out
          </button>
        </div>
      </div>
      
      {/* Todo: Logout confirmation modal */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export default UserLog;