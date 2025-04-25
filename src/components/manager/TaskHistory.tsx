// src/components/manager/TaskHistory.tsx
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

interface Task {
  task_name: string;
  worker: string;
  workload: number;
  status: 'Completed' | 'Assigned';
}

interface TaskHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // API call to fetch task history will be implemented later
      // For now, just simulate loading state
      setTimeout(() => {
        setIsLoading(false);
        setTasks([]);
      }, 500);
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task History"
    >
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading task history...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No tasks have been assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table content will be implemented later */}
            </table>
          </div>
        )}
      </div>
      <div className="flex justify-end pt-4 border-t mt-4">
        <button 
          onClick={onClose}
          className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default TaskHistory;