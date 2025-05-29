import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FaArrowLeft } from "react-icons/fa";

interface ItemData {
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
  item: ItemData;
  isSubmitting?: boolean;
}

const ItemConfirmation: React.FC<ItemConfirmationProps> = ({
  isOpen,
  onClose,
  onBack,
  onConfirmAndClose,
  onConfirmAndAddNext,
  item,
  isSubmitting = false
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
            className="mr-4 text-blue-600 hover:text-blue-800"
            disabled={isSubmitting}
          >
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900">Item Confirmation</h3>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-6">
          {/* Item Details */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Item ID:</h4>
              <p className="text-base font-medium">Will be automatically assigned</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Size cm³:</h4>
              <p className="text-base font-medium">
                {item.length.toFixed(1)} × {item.width.toFixed(1)} × {item.height.toFixed(1)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Is Fragile:</h4>
              <p className={`text-base font-medium ${item.is_fragile ? 'text-red-600' : 'text-green-600'}`}>
                {item.is_fragile ? 'Yes' : 'No'}
              </p>
            </div>
            
            {item.orientation && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">Orientation:</h4>
                <p className="text-base font-medium">{item.orientation}</p>
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
        <div className="flex justify-between pt-4 border-t">
          <Button 
            onClick={onConfirmAndClose}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="secondary"
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white disabled:bg-orange-300"
          >
            Confirm and Close
          </Button>
          <Button 
            onClick={onConfirmAndAddNext}
            disabled={isSubmitting}
            isLoading={isSubmitting}
            variant="primary"
            className="px-4 py-2"
          >
            Confirm and Add Next
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ItemConfirmation;