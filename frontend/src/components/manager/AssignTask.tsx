import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { FaInfoCircle, FaSpinner } from 'react-icons/fa';

interface AssignTaskProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: number[];
  onClearSelection: () => void;
  onTaskAssigned?: () => void;
}

// Mock data
// if real application only has fixed workers, we can import constant data here
const mockWorkers = [
  { id: 1, username: 'worker1' },
  { id: 2, username: 'worker2' },
  { id: 3, username: 'worker3' },
  { id: 4, username: 'worker4' },
  { id: 5, username: 'worker5' }
];

const AssignTask: React.FC<AssignTaskProps> = ({ 
  isOpen, 
  onClose,
  selectedItems,
  onClearSelection,
  onTaskAssigned
}) => {
  const [formData, setFormData] = useState({
    worker_id: '',
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
        worker_id: '',
        container_length: '120',
        container_width: '80',
        container_height: '60'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulated API call delay
    setTimeout(() => {
      console.log('Assigning task with data:', {
        ...formData,
        task_name: taskName,
        item_ids: selectedItems,
        timestamp: new Date().toISOString()
      });
      
      // Reset status after completing the operation
      setIsSubmitting(false);
      
      // Clear selected items
      onClearSelection();
      
      // Close the modal box
      onClose();
      
      if (onTaskAssigned) onTaskAssigned();
    }, 800);
  };

  // Check if the form is valid
  const isFormValid = 
    formData.worker_id !== '' && 
    formData.container_length !== '' && 
    formData.container_width !== '' && 
    formData.container_height !== '';

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
            name="worker_id"
            value={formData.worker_id}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select a worker</option>
            {mockWorkers.map((worker) => (
              <option key={worker.id} value={worker.id}>
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
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">{selectedItems.length}</span> items selected for this task
              </p>
              <p className="mt-1 text-xs text-blue-600">
                The assigned items will be removed from the inventory after the task is created.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="submit" 
            className={`px-4 py-2 bg-blue-600 text-white rounded-md ${
              isFormValid && !isSubmitting 
                ? 'hover:bg-blue-700' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            disabled={!isFormValid || isSubmitting}
          >
             {isSubmitting ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Assigning...
              </span>
            ) : (
              'Assign Task'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTask;