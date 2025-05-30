// src/components/manager/EditItem.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import ItemConfirmation from './ItemConfirmation';
import { useItems } from '../../services/itemService';

interface EditItemProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: number | null;
  onItemUpdated: () => void;
}

const EditItem: React.FC<EditItemProps> = ({ isOpen, onClose, itemId, onItemUpdated }) => {
  const { items, updateItem } = useItems();

  const [formData, setFormData] = useState({
    length: '',
    width: '',
    height: '',
    is_fragile: '',
    orientation: '',
    remarks: ''
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && itemId) {
      const item = items.find(i => i.id === itemId);
      if (item) {
        setFormData({
          length: item.length.toString(),
          width: item.width.toString(),
          height: item.height.toString(),
          is_fragile: item.is_fragile ? 'yes' : 'no',
          orientation: item.orientation || '',
          remarks: item.remarks || ''
        });
      }
    }
  }, [isOpen, itemId, items]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmAndSave = async () => {
    if (!itemId) return;
    setIsSubmitting(true);
    try {
      await updateItem(itemId, {
        length: parseFloat(formData.length),
        width: parseFloat(formData.width),
        height: parseFloat(formData.height),
        is_fragile: formData.is_fragile === 'yes',
        orientation: formData.orientation,
        remarks: formData.remarks
      });
      onItemUpdated();
      onClose();
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOrientationLabel = (value: string) => {
    const options = {
      face_up: 'Face up',
      face_down: 'Face down',
      side_a: 'Side A',
      side_b: 'Side B'
    };
    return options[value as keyof typeof options] || value;
  };

  const handleBackToEdit = () => {
    setShowConfirmation(false);
  };

  const handleModalClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !showConfirmation}
        onClose={handleModalClose}
        title={`Edit Item #${itemId}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700">Length (cm)</label>
              <input
                type="number"
                name="length"
                value={formData.length}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width (cm)</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label htmlFor="is_fragile" className="block text-sm font-medium text-gray-700">Is Fragile</label>
            <select
              name="is_fragile"
              value={formData.is_fragile}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select fragile status</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="orientation" className="block text-sm font-medium text-gray-700">Orientation</label>
            <select
              name="orientation"
              value={formData.orientation}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select orientation</option>
              <option value="face_up">Face up</option>
              <option value="face_down">Face down</option>
              <option value="side_a">Side A</option>
              <option value="side_b">Side B</option>
            </select>
          </div>

          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save the change
            </button>
          </div>
        </form>
      </Modal>

      <ItemConfirmation
        isOpen={isOpen && showConfirmation}
        onClose={handleModalClose}
        onBack={handleBackToEdit}
        onConfirmAndClose={handleConfirmAndSave}
        onConfirmAndAddNext={() => {}}
        item={{
          length: parseFloat(formData.length) || 0,
          width: parseFloat(formData.width) || 0,
          height: parseFloat(formData.height) || 0,
          is_fragile: formData.is_fragile === 'yes',
          orientation: getOrientationLabel(formData.orientation),
          remarks: formData.remarks
        }}
        isSubmitting={isSubmitting}
        isEdit={true}
      />
    </>
  );
};

export default EditItem;

