import { useState, useEffect } from 'react';
import { Task, TaskInput } from '../types';
import { mockTasks } from '../mocks/dataManager';

// Mock API service for tasks
const taskService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    if (storedTasks) {
      return JSON.parse(storedTasks).map((task: any) => ({
        ...task,
        created_at: new Date(task.created_at),
        completed_at: task.completed_at ? new Date(task.completed_at) : undefined
      }));
    }
    
    localStorage.setItem('warehouse_tasks', JSON.stringify(mockTasks));
    return mockTasks;
  },

  // Assign new task
  assignTask: async (taskData: TaskInput): Promise<{ success: boolean; task: Task; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    
    // Get current manager from auth context (you might need to pass this as parameter)
    const currentManager = 'manager1'; // This should come from auth context
    
    // For mock purposes, create items array from item_ids
    // In real implementation, you would fetch actual items from the API
    const storedItems = localStorage.getItem('warehouse_items');
    const allItems = storedItems ? JSON.parse(storedItems) : [];
    const taskItems = allItems.filter((item: any) => taskData.item_ids.includes(item.id));
    
    const newTask: Task = {
      id: Math.max(...tasks.map((task: Task) => task.id), 0) + 1,
      task_name: taskData.task_name,
      manager: currentManager,
      worker: taskData.worker,
      workload: taskData.item_ids.length,
      status: 'in_progress',
      items: taskItems,
      created_at: new Date()
    };
    
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('warehouse_tasks', JSON.stringify(updatedTasks));
    
    return { success: true, task: newTask, message: 'Task assigned successfully' };
  },

  // Update task status
  updateTaskStatus: async (taskId: number, status: Task['status']): Promise<{ success: boolean; message?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : mockTasks;
    
    const taskIndex = tasks.findIndex((task: Task) => task.id === taskId);
    if (taskIndex === -1) {
      return { success: false, message: 'Task not found' };
    }
    
    tasks[taskIndex].status = status;
    if (status === 'completed') {
      tasks[taskIndex].completed_at = new Date();
    }
    
    localStorage.setItem('warehouse_tasks', JSON.stringify(tasks));
    
    return { success: true, message: 'Task status updated successfully' };
  }
};

// Hook return interface
interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  assignTask: (taskData: TaskInput) => Promise<{ success: boolean; message?: string }>;
  updateTaskStatus: (taskId: number, status: Task['status']) => Promise<{ success: boolean; message?: string }>;
  refreshTasks: () => Promise<void>;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load tasks on component mount
  const refreshTasks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const tasksData = await taskService.getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Assign new task
  const assignTask = async (taskData: TaskInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskService.assignTask(taskData);
      if (response.success) {
        setTasks(prevTasks => [...prevTasks, response.task]);
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to assign task');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to assign task';
      setError(errorMessage);
      console.error('Error assigning task:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: number, status: Task['status']) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await taskService.updateTaskStatus(taskId, status);
      if (response.success) {
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status, 
                  completed_at: status === 'completed' ? new Date() : task.completed_at 
                } 
              : task
          )
        );
        return { success: true, message: response.message };
      } else {
        setError(response.message || 'Failed to update task status');
        return { success: false, message: response.message };
      }
    } catch (err) {
      const errorMessage = 'Failed to update task status';
      setError(errorMessage);
      console.error('Error updating task status:', err);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    assignTask,
    updateTaskStatus,
    refreshTasks
  };
};