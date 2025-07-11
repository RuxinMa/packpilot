// src/contexts/TaskContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskInput, TaskHistoryItem } from '../types';
import { TaskApiService } from '../services/taskService';
import { authService } from '../services/authService';

// Context state interface
interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

// Context actions
type TaskAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: { id: number; data: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: number };

// Context methods interface
interface TaskContextType extends TaskState {
  // Data operations
  refreshTasks: () => Promise<void>;
  refreshTasksByManager: (managerId: string) => Promise<void>;
  assignTask: (taskData: TaskInput) => Promise<{ success: boolean; message?: string; task?: Task }>;
  updateTaskStatus: (taskId: number, status: Task['status']) => Promise<{ success: boolean; message?: string }>;
  deleteTask: (taskId: number) => Promise<{ success: boolean; message?: string }>;
  getTaskHistory: () => Promise<TaskHistoryItem[]>;
  
  // Utility functions
  getTaskById: (taskId: number) => Task | undefined;
  getTasksByWorker: (worker: string) => Task[];
  getTasksByStatus: (status: Task['status']) => Task[];
  getCurrentManagerId: () => string;
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

// Reducer function
const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? { ...task, ...action.payload.data } : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    
    default:
      return state;
  }
};

// Create context
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Context provider component
interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Refresh all tasks
  const refreshTasks = async () => {
    // Check authentication status before making API calls
    if (!authService.isAuthenticated()) {
      console.log('TaskContext: Not authenticated, skipping refresh');
      return;
    }

    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const tasks = await TaskApiService.getTasks();
      dispatch({ type: 'SET_TASKS', payload: tasks });
      console.log(`Loaded ${tasks.length} tasks from API`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load tasks';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading tasks:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Refresh tasks by manager
  const refreshTasksByManager = async (managerId: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const tasks = await TaskApiService.getTasksByManager(managerId);
      dispatch({ type: 'SET_TASKS', payload: tasks });
      console.log(`Loaded ${tasks.length} tasks for manager: ${managerId}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load manager tasks';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error loading manager tasks:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Assign task
  const assignTask = async (taskData: TaskInput) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await TaskApiService.assignTask(taskData);
      if (response.success && response.task) {
        dispatch({ type: 'ADD_TASK', payload: response.task });
        return { success: true, message: response.message, task: response.task };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to assign task' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign task';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error assigning task:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId: number, status: Task['status']) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await TaskApiService.updateTaskStatus(taskId, status);
      if (response.success) {
        dispatch({ 
          type: 'UPDATE_TASK', 
          payload: { 
            id: taskId, 
            data: { 
              status, 
              completed_at: status === 'completed' ? new Date() : undefined 
            } 
          } 
        });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to update task status' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error updating task status:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Delete task
  const deleteTask = async (taskId: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    try {
      const response = await TaskApiService.deleteTask(taskId);
      if (response.success) {
        dispatch({ type: 'DELETE_TASK', payload: taskId });
        return { success: true, message: response.message };
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.message || 'Failed to delete task' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Error deleting task:', error);
      return { success: false, message: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Get task history
  const getTaskHistory = async (): Promise<TaskHistoryItem[]> => {
    try {
      return await TaskApiService.getTaskHistory();
    } catch (error) {
      console.error('Error getting task history:', error);
      return [];
    }
  };

  // Utility: get task by ID
  const getTaskById = (taskId: number): Task | undefined => {
    return state.tasks.find(task => task.id === taskId);
  };

  // Utility: get tasks by worker
  const getTasksByWorker = (worker: string): Task[] => {
    return state.tasks.filter(task => task.worker === worker);
  };

  // Utility: get tasks by status
  const getTasksByStatus = (status: Task['status']): Task[] => {
    return state.tasks.filter(task => task.status === status);
  };

  // Get current manager ID
  const getCurrentManagerId = (): string => {
    // Get current username from auth service
    const currentUser = authService.getUsername();
    console.log('Current manager ID:', currentUser);
    return currentUser || 'manager1'; // Use 'manager1' as fallback
  };

  // Automatically load tasks on component mount - wait for authentication
  useEffect(() => {
    const loadInitialTasks = () => {
      // Check authentication status
      if (!authService.isAuthenticated()) {
        console.log('TaskContext: Not authenticated, skipping initial load');
        return;
      }
      
      console.log('TaskContext: Loading initial tasks...');
      refreshTasks();
    };

    // Check immediately
    loadInitialTasks();
    
    // Listen for storage changes to detect auth state changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log('TaskContext: Auth token changed, reloading tasks');
        loadInitialTasks();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: TaskContextType = {
    ...state,
    refreshTasks,
    refreshTasksByManager,
    assignTask,
    updateTaskStatus,
    deleteTask,
    getTaskHistory,
    getTaskById,
    getTasksByWorker,
    getTasksByStatus,
    getCurrentManagerId,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook to use the context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};