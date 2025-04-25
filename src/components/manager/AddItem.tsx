// src/components/manager/AddItem.tsx
import React, { useState } from 'react';
import Modal from '../common/Modal';

interface AddItemProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: () => void;
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, onClose, onItemAdded }) => {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    orientation: '',
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API integration will be implemented later
    onClose();
    onItemAdded();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Item"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields will be implemented later */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddItem;