import React, { useEffect } from 'react';
import Modal from '../common/Modal';
import { FaSync, FaSpinner } from 'react-icons/fa';
import { Task } from '../../types';

interface TaskHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  loading?: boolean;
  onRefresh?: () => void;
}

const TaskHistory: React.FC<TaskHistoryProps> = ({ 
  isOpen, 
  onClose, 
  tasks,
  loading = false,
  onRefresh 
}) => {
  useEffect(() => {
    if (isOpen && tasks.length === 0 && !loading && onRefresh) {
      // Only refresh if modal is open, no tasks are loaded, and not currently loading
      onRefresh();
    }
  }, [isOpen]); // Remove onRefresh from dependency array to prevent infinite loop

  const formatTaskName = (taskName: string): string => {
    // Remove "Task-" prefix if it exists
    return taskName.replace(/^Task-/, '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  // Sort tasks by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const handleRefresh = () => {
    if (!loading && onRefresh) {
      onRefresh();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task History"
    >
      <div className="min-h-[400px]">
        {/* Summary and Refresh Button Row */}
        <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {/* Summary Stats */}
          {!loading ? (
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-lg font-bold text-blue-600">
                  {sortedTasks.length}
                </p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-600">
                  {sortedTasks.filter(t => t.status === 'completed').length}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-yellow-600">
                  {sortedTasks.filter(t => t.status === 'in_progress').length}
                </p>
                <p className="text-xs text-gray-500">In Progress</p>
              </div>
            </div>
          ) : (
            <div></div> // Empty div to maintain layout when loading
          )}

          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50 bg-white rounded-md border border-gray-300 hover:bg-blue-50 transition-colors"
            >
              {loading ? (
                <FaSpinner className="animate-spin mr-1" />
              ) : (
                <FaSync className="mr-1" />
              )}
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              <p className="text-gray-500">Loading Task History...</p>
            </div>
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
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
              <tbody className="bg-white">
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg mb-2">No tasks have been assigned yet</p>
                      <p className="text-sm text-gray-400">
                        Create your first task by selecting items and clicking "Assign Task"
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Name
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
                {sortedTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatTaskName(task.task_name)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.worker}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.workload} items
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
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