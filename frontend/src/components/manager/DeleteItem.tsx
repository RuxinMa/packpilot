import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useItems } from '../../services/itemService';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface DeleteItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onItemDeleted: () => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ isOpen, onClose, itemId, onItemDeleted }) => {
  const { deleteItem, items } = useItems();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get the item details
  const item = itemId ? items.find(item => item.id === itemId) : null;
  
  // Handle delete action
  const handleDelete = async () => {
    if (!itemId) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteItem(itemId);
      if (success) {
        onItemDeleted();
        onClose();
      } else {
        console.error(`Failed to delete item with ID: ${itemId}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Item"
    >
      <div className="space-y-6">
        <div className="bg-red-50 p-4 rounded-md flex-col items-center justify-center">
            <div className='flex items-center justify-center gap-4'>
              <FaExclamationTriangle className="text-red-500" />
              <h3 className="text-xl font-medium text-red-800">Confirm Deletion</h3>
            </div>
            <p className="mt-2 text-sm text-red-700 text-center">
              Are you sure you want to delete this item? <br />
              This action cannot be undone.
            </p>
        </div>
        
        {item && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Item Details:</h4>
            <div className="space-y-2">
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-24">ID:</span>
                <span className="text-sm">{item.id}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-24">Size:</span>
                <span className="text-sm">{`${item.length} × ${item.width} × ${item.height} cm`}</span>
              </div>
              <div className="flex">
                <span className="text-sm font-medium text-gray-500 w-24">Direction:</span>
                <span className="text-sm">{item.direction}</span>
              </div>
              {item.notes && (
                <div className="flex">
                  <span className="text-sm font-medium text-gray-500 w-24">Notes:</span>
                  <span className="text-sm">{item.notes}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-end pt-4 border-t">
          <button 
            type="button" 
            onClick={handleDelete}
            disabled={isDeleting}
            className={`px-6 py-2 text-white rounded-md flex items-center ${isDeleting ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isDeleting && <FaSpinner className="animate-spin mr-2" />}
            Delete Item
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteItem;