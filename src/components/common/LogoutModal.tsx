import React from 'react';
import Modal from './Modal';

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
      {/* Todo: implement the logic of logout comfirm  */}
      <div>
        
      </div>


    </Modal>

  )
}

export default LogoutConfirmModal;