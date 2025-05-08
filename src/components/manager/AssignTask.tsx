// src/components/manager/AssignTask.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

interface AssignTaskProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskAssigned?: () => void;
}

interface Worker {
  id: number;
  username: string;
}

interface Item {
  id: number;
  length: number;
  width: number;
  height: number;
  orientation: string;
  remarks: string;
}

const AssignTask: React.FC<AssignTaskProps> = ({ 
  isOpen, 
  onClose,
  onTaskAssigned
}) => {
  const [formData, setFormData] = useState({
    worker_id: '',
    item_ids: [] as number[],
    container_length: '',
    container_width: '',
    container_height: ''
  });
  
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Fetch workers and available items will be implemented later
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API integration will be implemented later
    onClose();
    if (onTaskAssigned) onTaskAssigned();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Task"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields will be implemented later */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Assign Task
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AssignTask;