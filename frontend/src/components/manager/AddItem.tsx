import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ItemConfirmation from './ItemConfirmation';
import Button from '../common/Button';
import { ItemInput, Item } from '../../types';

interface AddItemProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded: (newItemData: ItemInput & { name: string }) => void; // Include name in the data passed to parent
  items: Item[]; // 
}

const AddItem: React.FC<AddItemProps> = ({ isOpen, onClose, onItemAdded, items }) => {
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
  const [generatedName, setGeneratedName] = useState(''); // Frontend generates the name
  
  useEffect(() => {
    if (isOpen && !showConfirmation) {
      resetForm();
    }
  }, [isOpen]);

  // Generate item name when modal opens
  useEffect(() => {
    console.log('AddItem useEffect triggered:', { 
      isOpen, 
      itemsLength: items.length, 
      items: items.map(item => ({ id: item.id, name: item.name }))
    });
    
    if (isOpen) {
      let nextNumber = 1;
      
      if (items.length > 0) {
        const maxId = Math.max(...items.map(item => item.id));
        nextNumber = maxId + 1;
        console.log('Max ID found:', maxId);
      }
      
      let paddedCount: string;
      if (nextNumber < 1000) {
        paddedCount = nextNumber.toString().padStart(3, '0');
      } else {
        paddedCount = nextNumber.toString();
      }
      const newName = `ITEM-${paddedCount}`;
      console.log('Generated name based on max ID:', newName);
      setGeneratedName(newName);
    }
  }, [isOpen, items]);

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
    setGeneratedName('');
    onClose();
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
  };

  // Item operations - Pass name along with other data to parent
  const saveItem = async () => {
    setIsSubmitting(true);
    try {
      const newItemData: ItemInput & { name: string } = {
        name: generatedName, // Frontend generated name
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        is_fragile: formData.is_fragile === 'yes',
        orientation: formData.orientation || '',
        remarks: formData.remarks || ''
      };
      
      // Parent component handles the API call and will receive backend-generated ID
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
            <p className="text-[14px] text-blue-700">
              An ID will be automatically assigned to this item upon creation.
              </p>
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
          name: generatedName, // Frontend generated name
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          height: parseFloat(formData.height) || 0,
          is_fragile: formData.is_fragile === 'yes',
          orientation: formData.orientation ? getOrientationLabel(formData.orientation) : '',
          remarks: formData.remarks
        }}
        isSubmitting={isSubmitting}
        isEdit={false}
      />
    </>
  );
};

export default AddItem;