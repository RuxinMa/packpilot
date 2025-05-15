import React from 'react';
import Modal from './Modal';
import Button from './Button'; 

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
    >
      <div className="flex flex-col items-center space-y-4 px-4 py-4">
        <p className="text-gray-700 text-xl text-center mb-4">
          Are you sure you want to log out?
        </p>


        <div className="flex justify-center space-x-16">
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="primary">
            Log Out
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutConfirmModal;
