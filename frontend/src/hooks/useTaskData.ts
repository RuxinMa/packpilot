import { useState, useEffect } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

// Add API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000';

interface AIBox {
  item_id: number;
  width: number;
  height: number;
  depth: number;
  is_fragile: boolean;
  x: number;
  y: number;
  z: number;
  placement_order: number;
}

interface AIOutput {
  cost: number;
  results: AIBox[];
  status: string;
  task_info?: {
    task_id: number;
    task_name: string;
    container: {
      container_id: number;
      width: number;
      height: number;
      depth: number;
      label?: string;
    };
  };
}

interface Task {
  task_id: number;
  task_name: string;
  status: string;
  workload: number;
}

export const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [aiOutput, setAiOutput] = useState<AIOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthContext();

  // Get the task list for the worker
  const fetchTasks = async () => {
    const token = authService.getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching worker tasks...');
      const response = await fetch(`${API_BASE_URL}/api/worker/my_tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Fetch tasks response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Tasks data:', data);
        // Only show tasks that are not completed
        const incompleteTasks = (data.tasks || []).filter((task: Task) => task.status !== 'Completed');
        setTasks(incompleteTasks);
        // Automatically select the first task, but do not fetch layout
        if (incompleteTasks.length > 0) {
          setSelectedTaskId(incompleteTasks[0].task_id);
        } else {
          setSelectedTaskId(null);
        }
      } else {
        const errorData = await response.json();
        console.error('Error fetching tasks:', errorData);
        setError(`Failed to fetch tasks: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Network error fetching tasks:', err);
      setError('Network error: Unable to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  // Manually fetch task optimization layout
  const fetchTaskLayout = async (taskId: number) => {
    const token = authService.getToken();
    setLoading(true);
    setError(null);
    try {
      console.log(`Fetching layout for task ${taskId}...`);
      // First try to fetch existing layout
      let response = await fetch(`${API_BASE_URL}/api/ai/get_task_layout/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // If no layout exists, perform optimization
      if (!response.ok) {
        console.log('No existing layout, optimizing...');
        response = await fetch(`${API_BASE_URL}/api/ai/optimize_task/${taskId}?save=true`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }

      if (response.ok) {
        const data = await response.json();
        console.log('AI output data:', data);
        setAiOutput(data);
      } else {
        const errorData = await response.json();
        console.error('Error fetching layout:', errorData);
        setError('Failed to get task layout');
      }
    } catch (err) {
      console.error('Network error fetching layout:', err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Add a new effect to listen to selectedTaskId changes
  useEffect(() => {
    // When the selected task changes, clear previous aiOutput
    if (selectedTaskId !== null) {
      setAiOutput(null);
      // Do not automatically fetch layout here, wait for user to click "Start Task"
    }
  }, [selectedTaskId]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  // Complete task
  const completeTask = async (taskId: number) => {
    const token = authService.getToken();
    if (!token) {
      throw new Error('No authentication token');
    }

    console.log('completeTask called with taskId:', taskId);
    console.log('API_BASE_URL:', API_BASE_URL);

    setLoading(true);
    setError(null);
    try {
      console.log(`Completing task ${taskId}...`);
      const url = `${API_BASE_URL}/api/worker/complete_task/${taskId}`;
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Task completed successfully:', data);
        
        // After successfully completing the task, remove it from the list
        removeCompletedTask(taskId);
        
        return { success: true, message: data.message };
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}` };
        }
        console.error('Error completing task:', errorData);
        
        // Check if it's the "Task is already completed" error
        if (errorData.message === 'Task is already completed') {
          console.log('Task already completed, removing from list...');
          removeCompletedTask(taskId);
          return { success: true, message: 'Task was already completed' };
        }
        
        setError(`Failed to complete task: ${errorData.message || 'Unknown error'}`);
        return { success: false, message: errorData.message || 'Failed to complete task' };
      }
    } catch (err) {
      console.error('Network error completing task:', err);
      const errorMessage = 'Network error: Unable to complete task';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Remove completed task from the task list
  const removeCompletedTask = (taskId: number) => {
    console.log(`Removing completed task ${taskId} from list...`);
    
    // First get current task list
    const currentTasks = tasks.filter(task => task.task_id !== taskId);
    console.log('Filtered tasks:', currentTasks);
    
    // Update task list
    setTasks(currentTasks);
    
    // If the removed task is the currently selected one, reselect
    if (selectedTaskId === taskId) {
      if (currentTasks.length > 0) {
        console.log('Selecting next task:', currentTasks[0].task_id);
        setSelectedTaskId(currentTasks[0].task_id);
      } else {
        console.log('No remaining tasks');
        setSelectedTaskId(null);
        setAiOutput(null);
      }
    }
  };

  return {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    aiOutput,
    loading,
    error,
    fetchTaskLayout,
    completeTask,
    removeCompletedTask,
    refetch: () => selectedTaskId && fetchTaskLayout(selectedTaskId),
  };
};