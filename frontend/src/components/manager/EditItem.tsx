import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import ItemConfirmation from './ItemConfirmation';
import { useItemContext } from '../../contexts/ItemContext';
import { Item } from '../../types';

interface EditItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onItemUpdated: () => void;
}

const EditItem: React.FC<EditItemProps> = ({ isOpen, onClose, itemId, onItemUpdated }) => {
  const { items, updateItem } = useItemContext();

  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    is_fragile: '',
    orientation: '',
    remarks: ''
  });

  const [formErrors, setFormErrors] = useState({
    length: false,
    width: false,
    height: false,
    is_fragile: false
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);

  // Load item data when modal opens or itemId changes
  useEffect(() => {
    if (isOpen && itemId) {
      const item = items.find((i: Item) => i.id === itemId);
      if (item) {
        setCurrentItem(item);
        setFormData({
          length: item.length.toString(),
          width: item.width.toString(),
          height: item.height.toString(),
          is_fragile: item.is_fragile ? 'yes' : 'no',
          orientation: item.orientation || '',
          remarks: item.remarks || ''
        });
        // Clear any previous errors and reset confirmation state
        setFormErrors({
          length: false,
          width: false,
          height: false,
          is_fragile: false
        });
        setShowConfirmation(false);
      }
    }
  }, [isOpen, itemId, items]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when field is changed
    if (name in formErrors) {
      setFormErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };

  // Validate form
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

  const handleConfirmAndSave = async () => {
    if (!itemId) return;
    
    setIsSubmitting(true);
    try {
      const result = await updateItem(itemId, {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        is_fragile: formData.is_fragile === 'yes',
        orientation: formData.orientation,
        remarks: formData.remarks
      });

      if (result.success) {
        console.log('Item updated successfully:', result.message);
        onItemUpdated();
        // Reset showConfirmation before closing
        setShowConfirmation(false);
        onClose();
      } else {
        console.error('Failed to update item:', result.message);
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrientationLabel = (value: string) => {
    const option = orientationOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
  };

  const handleModalClose = () => {
    setShowConfirmation(false);
    setFormErrors({
      length: false,
      width: false,
      height: false,
      is_fragile: false
    });
    onClose();
  };

  // Check if form is valid
  const isFormValid = () => {
    return !!formData.length && 
           !!formData.width && 
           !!formData.height && 
           !!formData.is_fragile &&
           parseFloat(formData.length) > 0 &&
           parseFloat(formData.width) > 0 &&
           parseFloat(formData.height) > 0;
  };

  if (!currentItem) {
    return null;
  }

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirmation}
        onClose={handleModalClose}
        title={`Edit Item: ${currentItem.name}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Info Display */}
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <div className="space-y-1">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Editing Item:</span> {currentItem.name}
              </p>
              <p className="text-xs text-blue-600">
                ID: {currentItem.id} | Created: {currentItem.created_at.toLocaleDateString()}
              </p>
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

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="submit"
              variant={isFormValid() && !isSubmitting ? "primary" : "secondary"}
              disabled={!isFormValid() || isSubmitting}
              className="px-4 py-2"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Only render ItemConfirmation if currentItem exists and showConfirmation is true */}
      {currentItem && (
        <ItemConfirmation
          isOpen={isOpen && showConfirmation}
          onClose={handleModalClose}
          onBack={handleBackToEdit}
          onConfirmAndClose={handleConfirmAndSave}
          onConfirmAndAddNext={() => {}} // Not used in edit mode
          item={{
            name: currentItem.name,
            length: parseFloat(formData.length) || 0,
            width: parseFloat(formData.width) || 0,
            height: parseFloat(formData.height) || 0,
            is_fragile: formData.is_fragile === 'yes',
            orientation: formData.orientation ? getOrientationLabel(formData.orientation) : '',
            remarks: formData.remarks
          }}
          isSubmitting={isSubmitting}
          isEdit={true}
        />
      )}
    </>
  );
};

export default EditItem;