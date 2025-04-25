// src/components/manager/EditItem.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

interface EditItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onItemUpdated: () => void;
}

const EditItem: React.FC<EditItemProps> = ({ 
  isOpen, 
  onClose, 
  itemId, 
  onItemUpdated 
}) => {
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    orientation: '',
    remarks: ''
  });

  useEffect(() => {
    if (isOpen && itemId) {
      // Fetch item data will be implemented later
      // This is just a placeholder
      setFormData({
        length: '',
        width: '',
        height: '',
        orientation: '',
        remarks: ''
      });
    }
  }, [isOpen, itemId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API integration will be implemented later
    onClose();
    onItemUpdated();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Item #${itemId}`}
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
            Update Item
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditItem;