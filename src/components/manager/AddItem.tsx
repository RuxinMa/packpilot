import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ItemConfirmation from './ItemConfirmation';
import { useItems } from '../../services/itemService';

interface AddItemProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (newItemData: any) => void; // MODIFIED: Now accepts item data
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, onClose, onItemAdded }) => {
  // Get add item function from service
  const { addItem } = useItems();
  
  // Form state
  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    direction: '',
    note: ''
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({
    length: false,
    width: false,
    height: false,
    direction: false
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
        direction: '',
        note: ''
      });
    }
  }, [isOpen]);

  // Direction options
  const directionOptions = [
    { value: 'face_up', label: 'Face up' },
    { value: 'face_down', label: 'Face down' },
    { value: 'side_a', label: 'Side A' },
    { value: 'side_b', label: 'Side B' }
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
      direction: !formData.direction
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
      direction: '',
      note: ''
    });
    setFormErrors({
      length: false,
      width: false,
      height: false,
      direction: false
    });
    setShowConfirmation(false);
    onClose();
  };

  // Check if form is valid for enabling/disabling continue button
  const isFormValid = () => {
    return !!formData.length && !!formData.width && !!formData.height && !!formData.direction;
  };

  // MODIFIED: Save the item to the database and pass data to parent
  const saveItem = async () => {
    setIsSubmitting(true);
    try {
      // Create the new item data
      const newItemData = {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        direction: getDirectionLabel(formData.direction),
        notes: formData.note
      };
      
      // In a real app, you would call the API here
      // await addItem(newItemData);
      
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
      direction: '',
      note: ''
    });
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
  };

  // Get direction label from value
  const getDirectionLabel = (value: string) => {
    const option = directionOptions.find(opt => opt.value === value);
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
          
          {/* Dimensions */}
          <div className="grid grid-cols-2 gap-4">
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
          
          {/* Direction */}
          <div>
            <label htmlFor="direction" className="block text-sm font-medium text-gray-700">
              Direction*
            </label>
            <select
              id="direction"
              name="direction"
              value={formData.direction}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${formErrors.direction ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="">Select direction</option>
              {directionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formErrors.direction && (
              <p className="mt-1 text-sm text-red-500">Direction is required</p>
            )}
          </div>
          
          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              maxLength={200}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.note.length}/200 characters maximum
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button 
              type="submit" 
              disabled={!isFormValid() || isSubmitting}
              className={`px-4 py-2 ${isFormValid() && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} rounded-md`}
            >
              Continue
            </button>
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
          direction: getDirectionLabel(formData.direction),
          note: formData.note
        }}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default AddItem;