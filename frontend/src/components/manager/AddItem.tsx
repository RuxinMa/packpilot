import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ItemConfirmation from './ItemConfirmation';
import Button from '../common/Button';
import { ItemInput } from '../../types';

interface AddItemProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (newItemData: ItemInput) => void; // Use ItemInput type
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, onClose, onItemAdded }) => {
  // Form state
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

  // State for showing confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  // State for loading
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        length: '',
        width: '',
        height: '',
        is_fragile: '',
        orientation: '',
        remarks: ''
      });
    }
  }, [isOpen]);

  // Orientation options (changed from direction)
  const orientationOptions = [
    { value: 'face_up', label: 'Face up' },
    { value: 'face_down', label: 'Face down' },
    { value: 'side_a', label: 'Side A' },
    { value: 'side_b', label: 'Side B' }
  ];

  // Fragile options
  const fragileOptions = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' }
  ];

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear validation error when field is changed
    if (name in formErrors) {
      setFormErrors({
        ...formErrors,
        [name]: false
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {
      length: !formData.length,
      width: !formData.width,
      height: !formData.height,
      is_fragile: !formData.is_fragile
    };

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  // Handle modal close and reset form
  const handleModalClose = () => {
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
    setShowConfirmation(false);
    onClose();
  };

  // Check if form is valid for enabling/disabling continue button
  const isFormValid = () => {
    return !!formData.length && !!formData.width && !!formData.height && !!formData.is_fragile;
  };

  // Save the item to the database and pass data to parent
  const saveItem = async () => {
    setIsSubmitting(true);
    try {
      // Create the new item data matching ItemInput interface
      const newItemData: ItemInput = {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        is_fragile: formData.is_fragile === 'yes',
        orientation: formData.orientation || '', // Default to empty string if not selected
        remarks: formData.remarks
      };
      
      // Pass the new item data to the parent component
      onItemAdded(newItemData);
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle confirmation actions
  const handleConfirmAndClose = async () => {
    await saveItem();
    handleModalClose();
  };

  const handleConfirmAndAddNext = async () => {
    await saveItem();
    setShowConfirmation(false);
    
    // Reset form but keep the modal open
    setFormData({
      length: '',
      width: '',
      height: '',
      is_fragile: '',
      orientation: '',
      remarks: ''
    });
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
  };

  // Get orientation label from value
  const getOrientationLabel = (value: string) => {
    const option = orientationOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirmation}
        onClose={handleModalClose}
        title="Add Item"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Note about auto ID generation */}
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="text-sm text-blue-700">
              An ID will be automatically assigned to this item upon creation.
            </p>
          </div>
          
          {/* Dimensions - all in one row */}
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
                min="0"
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.length ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.length && (
                <p className="mt-1 text-sm text-red-500">Length is required</p>
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
                min="0"
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.width ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.width && (
                <p className="mt-1 text-sm text-red-500">Width is required</p>
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
                min="0"
                step="0.1"
                className={`mt-1 block w-full px-3 py-2 border ${formErrors.height ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              {formErrors.height && (
                <p className="mt-1 text-sm text-red-500">Height is required</p>
              )}
            </div>
          </div>
          
          {/* Fragile - required field */}
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
          
          {/* Orientation - now optional */}
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
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.remarks.length}/200 characters maximum
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