import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ItemConfirmation from './ItemConfirmation';
import Button from '../common/Button';
import { ItemInput } from '../../types';

interface AddItemProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (newItemData: ItemInput) => void;
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, onClose, onItemAdded }) => {
  // Form state (pure UI state)
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    is_fragile: '',
    orientation: '', 
    remarks: ''      
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    length: false,
    width: false,
    height: false,
    is_fragile: false
  });

  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewName, setPreviewName] = useState('');
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
      // Generate adaptive preview name
      const count = parseInt(localStorage.getItem('item_counter') || '0') + 1;
      let paddedCount: string;
      if (count < 1000) {
        paddedCount = count.toString().padStart(3, '0');
      } else {
        paddedCount = count.toString();
      }
      setPreviewName(`ITEM-${paddedCount}`);
    }
  }, [isOpen]);

  // Form configuration
  const orientationOptions = [
    { value: 'face_up', label: 'Face up' },
    { value: 'face_down', label: 'Face down' },
    { value: 'side_a', label: 'Side A' },
    { value: 'side_b', label: 'Side B' }
  ];

  const fragileOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  // UI Helper functions
  const resetForm = () => {
    setFormData({
      length: '',
      width: '',
      height: '',
      is_fragile: '',
      orientation: '',
      remarks: ''
    });
    setFormErrors({
      length: false,
      width: false,
      height: false,
      is_fragile: false
    });
  };

  const isFormValid = () => {
    return !!formData.length && 
           !!formData.width && 
           !!formData.height && 
           !!formData.is_fragile &&
           parseFloat(formData.length) > 0 &&
           parseFloat(formData.width) > 0 &&
           parseFloat(formData.height) > 0;
  };

  const getOrientationLabel = (value: string) => {
    const option = orientationOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  // Form event handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear validation error when field is changed
    if (name in formErrors) {
      setFormErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const validateForm = () => {
    const errors = {
      length: !formData.length || parseFloat(formData.length) <= 0,
      width: !formData.width || parseFloat(formData.width) <= 0,
      height: !formData.height || parseFloat(formData.height) <= 0,
      is_fragile: !formData.is_fragile
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  // Modal event handlers
  const handleModalClose = () => {
    resetForm();
    setShowConfirmation(false);
    setPreviewName('');
    onClose();
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
  };

  // Item operations (delegate to parent)
  const saveItem = async () => {
    setIsSubmitting(true);
    try {
      const newItemData: ItemInput = {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        is_fragile: formData.is_fragile === 'yes',
        orientation: formData.orientation || '',
        remarks: formData.remarks || ''
      };
      
      await onItemAdded(newItemData);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAndClose = async () => {
    await saveItem();
    handleModalClose();
  };

  const handleConfirmAndAddNext = async () => {
    await saveItem();
    setShowConfirmation(false);
    resetForm();
    // Generate next adaptive preview name
    const count = parseInt(localStorage.getItem('item_counter') || '0') + 1;
    let paddedCount: string;
    if (count < 1000) {
      paddedCount = count.toString().padStart(3, '0');
    } else {
      paddedCount = count.toString();
    }
    setPreviewName(`ITEM-${paddedCount}`);
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirmation}
        onClose={handleModalClose}
        title="Add Item"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Auto-generated preview */}
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <div className="space-y-2">
              <p className="text-sm text-blue-700 font-medium">Auto-generated Item Details:</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  {/* Name: Sequential identifier */}
                  <span className="text-blue-600 font-medium">Name: </span>
                  <span className="text-blue-700">{previewName}</span>
                </div>
                <div>
                  {/* ID: Unique 8-digit database key */}
                  <span className="text-blue-600 font-medium">ID: </span>
                  <span className="text-blue-700">Generated on save</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Dimensions */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">
                Length* (cm)
              </label>
              <input
                type="number"
                id="length"
                name="length"
                value={formData.length}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.length ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.length && (
                <p className="mt-1 text-sm text-red-500">
                  {!formData.length ? 'Length is required' : 'Length must be greater than 0'}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700">
                Width* (cm)
              </label>
              <input
                type="number"
                id="width"
                name="width"
                value={formData.width}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.width ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.width && (
                <p className="mt-1 text-sm text-red-500">
                  {!formData.width ? 'Width is required' : 'Width must be greater than 0'}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                Height* (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.height ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.height && (
                <p className="mt-1 text-sm text-red-500">
                  {!formData.height ? 'Height is required' : 'Height must be greater than 0'}
                </p>
              )}
            </div>
          </div>
          
          {/* Fragile */}
          <div>
            <label htmlFor="is_fragile" className="block text-sm font-medium text-gray-700">
              Is Fragile*
            </label>
            <select
              id="is_fragile"
              name="is_fragile"
              value={formData.is_fragile}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${formErrors.is_fragile ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select fragile status</option>
              {fragileOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.is_fragile && (
              <p className="mt-1 text-sm text-red-500">Fragile status is required</p>
            )}
          </div>
          
          {/* Orientation */}
          <div>
            <label htmlFor="orientation" className="block text-sm font-medium text-gray-700">
              Orientation (Optional)
            </label>
            <select
              id="orientation"
              name="orientation"
              value={formData.orientation}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select orientation</option>
              {orientationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Remarks */}
          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              maxLength={200}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add any additional notes about this item..."
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.remarks.length}/200 characters
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button 
              type="submit" 
              variant={isFormValid() && !isSubmitting ? "primary" : "secondary"}
              disabled={!isFormValid() || isSubmitting}
              className="px-4 py-2"
            >
              Continue
            </Button>
          </div>
        </form>
      </Modal>
      
      {/* Item Confirmation Modal */}
      <ItemConfirmation
        isOpen={isOpen && showConfirmation}
        onClose={handleModalClose}
        onBack={handleBackToEdit}
        onConfirmAndClose={handleConfirmAndClose}
        onConfirmAndAddNext={handleConfirmAndAddNext}
        item={{
          name: previewName,
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          height: parseFloat(formData.height) || 0,
          is_fragile: formData.is_fragile === 'yes',
          orientation: formData.orientation ? getOrientationLabel(formData.orientation) : '',
          remarks: formData.remarks
        }}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AddItem;