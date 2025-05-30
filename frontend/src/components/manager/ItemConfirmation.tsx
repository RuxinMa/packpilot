import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FaArrowLeft } from "react-icons/fa";

// Local interface definition (no need for shared types file)
interface ItemPreviewData {
  name: string;
  length: number;
  width: number;
  height: number;
  is_fragile: boolean;
  orientation: string;
  remarks: string;
}

interface ItemConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirmAndClose: () => void;
  onConfirmAndAddNext: () => void;
  item: ItemPreviewData; // Use shared type
  isSubmitting?: boolean;
  isEdit?: boolean; 
}

const ItemConfirmation: React.FC<ItemConfirmationProps> = ({
  isOpen,
  onClose,
  onBack,
  onConfirmAndClose,
  onConfirmAndAddNext,
  item,
  isSubmitting = false,
  isEdit = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Item Confirmation"
      customHeader={
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 text-blue-600 hover:text-blue-800 disabled:opacity-50"
            disabled={isSubmitting}
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900">Item Confirmation</h3>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Confirmation Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs text-green-700">
            Please review the item details below.<br />
            Once confirmed, the item will be added to your inventory.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          {/* Item Details */}
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Item Name:</h4>
              <p className="text-base font-medium text-blue-600">{item.name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Item ID:</h4>
              <p className="text-base font-medium text-gray-700">
                {isEdit ? "Existing ID maintained" : "Auto-assigned on save"}
              </p>
            </div>
            
            {/* Dimensions and Fragile in one row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Dimensions (L×W×H):</h4>
                <p className="text-base font-medium">
                  {item.length.toFixed(1)} × {item.width.toFixed(1)} × {item.height.toFixed(1)} cm
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Is Fragile:</h4>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.is_fragile 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {item.is_fragile ? '⚠️ Yes' : '✅ No'}
                  </span>
                </div>
              </div>
            </div>

            {item.orientation && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Orientation:</h4>
                <p className="text-base">{item.orientation}</p>
              </div>
            )}
            {item.remarks && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Remarks:</h4>
                <p className="text-base">{item.remarks}</p>
              </div>
            )}

          </div>
        </div>

        {/* Action buttons */}
        <div className={`flex pt-4 border-t ${isEdit ? 'justify-end' : 'justify-between'}`}>
          {isEdit ? (
            // Edit mode: Only show confirm button, right-aligned
            <Button 
              onClick={onConfirmAndClose}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              variant="primary"
            >
              Confirm Changes
            </Button>
          ) : (
            // Add mode: Show both buttons with space between
            <>
              <Button 
                onClick={onConfirmAndClose}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                variant="secondary"
                className="bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300"
              >
                Confirm and Close
              </Button>
              <Button 
                onClick={onConfirmAndAddNext}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                variant="primary"
              >
                Confirm and Add Next
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ItemConfirmation;