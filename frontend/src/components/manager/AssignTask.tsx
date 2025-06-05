import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { FaInfoCircle } from 'react-icons/fa';
import { Item } from '../../types';
import { MOCK_WORKERS } from '../../mocks/dataManager';

interface AssignTaskProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: number[];
  onClearSelection: () => void;
  onTaskAssigned: (taskData: {
    task_name: string;
    worker: string;
    container: {
      length: number;
      width: number;
      height: number;
    };
  }) => void;
  items: Item[]; // Add items prop to show selected items info
}

const AssignTask: React.FC<AssignTaskProps> = ({ 
  isOpen, 
  onClose,
  selectedItems,
  onClearSelection,
  onTaskAssigned,
  // items
}) => {
  const [formData, setFormData] = useState({
    worker: '',
    container_length: '',
    container_width: '',
    container_height: ''
  });
  
  const [taskName, setTaskName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Generate task names based on date and time
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
      const timeStr = `${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
      setTaskName(`Task-${dateStr}-${timeStr}`);
      
      // Pre-set container size
      setFormData({
        worker: '',
        container_length: '800',
        container_width: '800',
        container_height: '800'
      });
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the parent's onTaskAssigned with properly formatted data
      await onTaskAssigned({
        task_name: taskName,
        worker: formData.worker,
        container: {
          length: parseFloat(formData.container_length),
          width: parseFloat(formData.container_width),
          height: parseFloat(formData.container_height)
        }
      });
      
      // Clear selected items
      onClearSelection();
      
      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if the form is valid
  const isFormValid = 
    formData.worker !== '' && 
    formData.container_length !== '' && 
    formData.container_width !== '' && 
    formData.container_height !== '';

  // Get selected items details
  // const selectedItemsDetails = items.filter(item => selectedItems.includes(item.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Task"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">Task Name</label>
          <input
            type="text"
            value={taskName}
            disabled
            className="bg-gray-100 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Automatically generated</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Choose a Worker <span className="text-red-500">*</span>
          </label>
          <select
            name="worker"
            value={formData.worker}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a worker</option>
            {MOCK_WORKERS.map((worker) => (
              <option key={worker.id} value={worker.username}>
                {worker.username}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-2">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Container Size <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Length (cm)</label>
              <input
                type="number"
                name="container_length"
                value={formData.container_length}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Width (cm)</label>
              <input
                type="number"
                name="container_width"
                value={formData.container_width}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Height (cm)</label>
              <input
                type="number"
                name="container_height"
                value={formData.container_height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                min="1"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mx-4">
              <p className="text-base text-blue-700">
                <span className="font-medium">{selectedItems.length}</span> items selected for this task
              </p>
              <p className="mt-2 text-sm text-blue-600">
                The assigned items will be removed from the inventory after the task is created.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button 
            type="submit" 
            variant="primary"
            disabled={!isFormValid || isSubmitting}
            isLoading={isSubmitting}
            className="px-4 py-2"
          >
            Assign Task
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTask;