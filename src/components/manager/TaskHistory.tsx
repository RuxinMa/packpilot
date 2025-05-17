import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { mockTaskHistory } from '../../mocks/ManagerDashboard';

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
      // Simulating API call with mock data
      setTimeout(() => {
        setIsLoading(false);
        // Sorting by task name in descending order
        const sortedTasks = [...mockTaskHistory].sort((a, b) => 
          b.task_name.localeCompare(a.task_name)
        );
        setTasks(sortedTasks);
      }, 500);
    }
  }, [isOpen]);

  const formatTaskName = (taskName: string): string => {
    return taskName.replace(/^Task-/, '');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task History"
    >
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading Task History...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No tasks have been assigned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Worker
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workload
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr key={index}>
                    <td className="px-3 py-4 whitespace-nowrap text-xs font-medium text-gray-500">
                      {formatTaskName(task.task_name)}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.worker}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.workload} items
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskHistory;