import { Task, TaskInput, TaskHistoryItem } from '../types';
import { authService } from './authService';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function to get auth token
const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Task API Service class
export class TaskApiService {
  // Get all tasks
  static async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manager/get_tasks`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tasks from API:', data);

      // Convert API response to frontend Task format
      const tasks: Task[] = (data.tasks || []).map((apiTask: any) => ({
        id: apiTask.task_id || apiTask.id,
        task_name: apiTask.task_name,
        manager: apiTask.manager || apiTask.created_by,
        worker: apiTask.assigned_to || apiTask.worker,
        workload: apiTask.item_count || apiTask.workload || 0,
        status: this.mapApiStatusToTaskStatus(apiTask.status),
        items: apiTask.items || [],
        container: apiTask.container || { length: 0, width: 0, height: 0 },
        created_at: apiTask.created_at ? new Date(apiTask.created_at) : new Date(),
        completed_at: apiTask.completed_at ? new Date(apiTask.completed_at) : undefined
      }));

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw new Error('Failed to fetch tasks from server');
    }
  }

  // Get tasks by manager ID
  static async getTasksByManager(managerId: string): Promise<Task[]> {
    try {
      // Get all tasks and filter by current manager
      const allTasks = await this.getTasks();
      const currentUsername = authService.getUsername();
      
      // Filter tasks by current logged-in user
      const managerTasks = allTasks.filter(task => 
        task.manager === currentUsername || 
        task.manager === managerId
      );
      
      console.log(`Found ${managerTasks.length} tasks for manager: ${managerId}`);
      return managerTasks;
    } catch (error) {
      console.error('Failed to fetch tasks for manager:', error);
      throw error;
    }
  }

  // Assign task
  static async assignTask(taskData: TaskInput): Promise<{ success: boolean; task?: Task; message?: string }> {
    try {
      console.log('Assigning task:', taskData);

      // First, find or create container
      const containerId = await this.findOrCreateContainer(taskData.container);

      // Create task and assign items
      const response = await fetch(`${API_BASE_URL}/api/manager/assign_task`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          task_name: taskData.task_name,
          container_id: containerId,
          assigned_to: taskData.worker,
          item_ids: taskData.item_ids,
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign task');
      }

      const result = await response.json();
      console.log('Task assigned successfully:', result);

      // Construct frontend Task object
      const newTask: Task = {
        id: result.task_id,
        task_name: taskData.task_name,
        manager: authService.getUsername() || 'manager',
        worker: taskData.worker,
        workload: taskData.item_ids.length,
        status: 'in_progress',
        items: [], // Get details from API if needed
        container: taskData.container,
        created_at: new Date()
      };

      return { 
        success: true, 
        task: newTask, 
        message: result.message || `Task assigned to ${taskData.worker}` 
      };
    } catch (error) {
      console.error('Error in assignTask:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Network error: Unable to assign task' 
      };
    }
  }

  // Update task status
  static async updateTaskStatus(taskId: number, status: Task['status']): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manager/update_task_status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          task_id: taskId,
          status: this.mapTaskStatusToApiStatus(status)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task status');
      }

      const result = await response.json();
      return { 
        success: true, 
        message: result.message || `Task status updated to ${status}` 
      };
    } catch (error) {
      console.error('Error updating task status:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to update task status' 
      };
    }
  }

  // Delete task
  static async deleteTask(taskId: number): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/manager/delete_task`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          task_id: taskId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task');
      }

      const result = await response.json();
      return { 
        success: true, 
        message: result.message || 'Task deleted successfully' 
      };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to delete task' 
      };
    }
  }

  // Get task history
  static async getTaskHistory(): Promise<TaskHistoryItem[]> {
    try {
      const tasks = await this.getTasks();
      return tasks.map(task => ({
        task_name: task.task_name,
        worker: task.worker,
        workload: task.workload,
        status: task.status
      }));
    } catch (error) {
      console.error('Error getting task history:', error);
      return [];
    }
  }

  // Get tasks by worker
  static async getTasksByWorker(worker: string): Promise<Task[]> {
    try {
      const tasks = await this.getTasks();
      return tasks.filter(task => task.worker === worker);
    } catch (error) {
      console.error('Error getting tasks by worker:', error);
      return [];
    }
  }

  // Get tasks by status
  static async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    try {
      const tasks = await this.getTasks();
      return tasks.filter(task => task.status === status);
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      return [];
    }
  }

  // Get task statistics
  static async getTaskStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  }> {
    try {
      const tasks = await this.getTasks();
      const total = tasks.length;
      const completed = tasks.filter(task => task.status === 'completed').length;
      const inProgress = tasks.filter(task => task.status === 'in_progress').length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
      
      return {
        total,
        completed,
        inProgress,
        completionRate
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        completionRate: 0
      };
    }
  }

  // Helper method: find or create container
  private static async findOrCreateContainer(containerDimensions: { length: number; width: number; height: number }): Promise<number> {
    try {
      // Get all containers
      const response = await fetch(`${API_BASE_URL}/api/manager/get_containers`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        const containers = data.containers || [];

        // Find container with matching dimensions
        const matchingContainer = containers.find((container: any) => 
          Math.abs(container.width - containerDimensions.width) < 0.01 &&
          Math.abs(container.height - containerDimensions.height) < 0.01 &&
          Math.abs(container.depth - containerDimensions.length) < 0.01
        );

        if (matchingContainer) {
          console.log('Found matching container:', matchingContainer.container_id);
          return matchingContainer.container_id;
        }
      }

      // If no matching container found, create a new one
      const createResponse = await fetch(`${API_BASE_URL}/api/manager/add_container`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          width: containerDimensions.width,
          height: containerDimensions.height,
          depth: containerDimensions.length,
          label: `Container ${containerDimensions.width}x${containerDimensions.height}x${containerDimensions.length}`
        })
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create container');
      }

      const createData = await createResponse.json();
      console.log('Created new container:', createData.container.container_id);
      return createData.container.container_id;
    } catch (error) {
      console.error('Error finding/creating container:', error);
      throw error;
    }
  }

  // Status mapping: API status -> frontend status
  private static mapApiStatusToTaskStatus(apiStatus: string): Task['status'] {
    switch (apiStatus?.toLowerCase()) {
      case 'completed':
      case 'finished':
      case 'done':
        return 'completed';
      case 'in_progress':
      case 'in-progress':
      case 'active':
      case 'working':
        return 'in_progress';
      default:
        return 'in_progress';
    }
  }

  // Status mapping: frontend status -> API status
  private static mapTaskStatusToApiStatus(taskStatus: Task['status']): string {
    switch (taskStatus) {
      case 'completed':
        return 'completed';
      case 'in_progress':
        return 'in_progress';
      default:
        return 'in_progress';
    }
  }
}