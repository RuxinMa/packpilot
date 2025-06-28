import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useItemContext } from '../../contexts/ItemContext';

interface DeleteItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onItemDeleted: () => void;
}

const DeleteItem: React.FC<DeleteItemProps> = ({ 
  isOpen, 
  onClose, 
  itemId, 
  onItemDeleted 
}) => {
  const { items, deleteItem } = useItemContext();
  const [isDeleting, setIsDeleting] = useState(false);

  // Find the item to delete
  const itemToDelete = itemId ? items.find(item => item.id === itemId) : null;

  const handleDelete = async () => {
    if (!itemId) return;

    setIsDeleting(true);
    try {
      const result = await deleteItem(itemId);
      if (result.success) {
        console.log('Item deleted successfully:', result.message);
        onItemDeleted(); // Notify parent component
        onClose();
      } else {
        console.error('Failed to delete item:', result.message);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting) {
      onClose();
    }
  };

  if (!itemToDelete) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Delete Item"
    >
      <div className="space-y-6">
        {/* Warning */}
        <div className="bg-red-50 p-4 rounded-md">
            <h3 className="text-base font-medium text-red-700">
              Are you sure you want to delete this item? 
            </h3>
            <p className="mt-2 text-xs text-red-700">
              This action cannot be undone.
            </p>
        </div>

        {/* Item Details */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Item to be deleted:</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-medium">{itemToDelete.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium font-mono text-blue-600">{itemToDelete.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-medium">
                {itemToDelete.length} × {itemToDelete.width} × {itemToDelete.height} cm
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fragile:</span>
              <span className={`font-medium ${itemToDelete.is_fragile ? 'text-red-600' : 'text-green-600'}`}>
                {itemToDelete.is_fragile ? 'Yes' : 'No'}
              </span>
            </div>
            {itemToDelete.orientation && (
              <div className="flex justify-between">
                <span className="text-gray-600">Orientation:</span>
                <span className="font-medium">{itemToDelete.orientation}</span>
              </div>
            )}
            {itemToDelete.remarks && (
              <div className="flex justify-between">
                <span className="text-gray-600">Remarks:</span>
                <span className="font-medium">{itemToDelete.remarks}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            onClick={handleCancel}
            variant="secondary"
            disabled={isDeleting}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="primary"
            disabled={isDeleting}
            isLoading={isDeleting}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white disabled:bg-red-300"
          >
            Delete Item
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteItem;