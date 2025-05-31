// src/services/taskService.ts
import { Task, TaskInput, TaskHistoryItem, TaskApiPayload } from '../types';
import { mockTasks, mockTaskHistory } from '../mocks/dataManager';

// Utility functions for Task ID generation
export const generateTaskId = (): number => {
  // Generate unique task ID - 8 digits (similar to item ID strategy)
  const timestamp = Date.now();
  const lastSixDigits = timestamp % 1000000; // Get last 6 digits
  const randomSuffix = Math.floor(Math.random() * 100); // Add 2 random digits
  return lastSixDigits * 100 + randomSuffix;
};

// Data transformation utilities
export const taskToApiPayload = (task: Task): TaskApiPayload => ({
  task_id: task.id,
  task_name: task.task_name,
  manager: task.manager,
  worker: task.worker,
  workload: task.workload,
  status: task.status,
  item_ids: task.items.map(item => item.id),
  container: task.container || { length: 0, width: 0, height: 0 },
  created_at: task.created_at.toISOString(),
  completed_at: task.completed_at?.toISOString()
});

// Task API Service class
export class TaskApiService {
  // Get all tasks
  static async getTasks(): Promise<Task[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    if (storedTasks) {
      const tasks = JSON.parse(storedTasks);
      // Ensure data consistency and convert dates
      return tasks.map((task: any) => ({
        ...task,
        id: task.id || generateTaskId(), // Ensure ID exists
        created_at: task.created_at ? new Date(task.created_at) : new Date(),
        completed_at: task.completed_at ? new Date(task.completed_at) : undefined,
        container: task.container || { length: 120, width: 80, height: 60 }
      }));
    }
    
    // Initialize with mock data from dataManager and ensure unique IDs
    const tasksWithUniqueIds = mockTasks.map(task => ({
      ...task,
      id: task.id || generateTaskId(), // Use existing ID or generate new unique one
      created_at: task.created_at || new Date(),
      completed_at: task.completed_at || undefined,
      container: task.container || { length: 120, width: 80, height: 60 }
    }));
    
    localStorage.setItem('warehouse_tasks', JSON.stringify(tasksWithUniqueIds));
    return tasksWithUniqueIds;
  }

  // Get tasks by manager ID (for TaskHistory)
  static async getTasksByManager(managerId: string): Promise<Task[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      // Simulate API call to get manager-specific tasks
      console.log(`GET /api/managers/${managerId}/tasks`);
      // Real API call: await fetch(`/api/managers/${managerId}/tasks`)
      
      const allTasks = await this.getTasks();
      // Filter tasks by manager
      const managerTasks = allTasks.filter(task => task.manager === managerId);
      
      console.log(`Found ${managerTasks.length} tasks for manager: ${managerId}`);
      return managerTasks;
    } catch (error) {
      console.error('Failed to fetch tasks for manager:', error);
      // Fallback to all tasks if API fails
      return await this.getTasks();
    }
  }

  // Assign new task with unique ID
  static async assignTask(taskData: TaskInput): Promise<{ success: boolean; task: Task; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    
    // Generate unique task ID
    const newTaskId = generateTaskId();
    
    // Get current manager (placeholder - should come from auth context)
    const currentManager = 'manager1';
    
    // Get items for this task from localStorage
    const storedItems = localStorage.getItem('warehouse_items');
    const allItems = storedItems ? JSON.parse(storedItems) : [];
    const taskItems = allItems.filter((item: any) => taskData.item_ids.includes(item.id));
    
    const newTask: Task = {
      id: newTaskId, // Unique 8-digit ID for database
      task_name: taskData.task_name,
      manager: currentManager,
      worker: taskData.worker,
      workload: taskData.item_ids.length,
      status: 'in_progress',
      items: taskItems, // Full Item objects
      container: taskData.container,
      created_at: new Date()
    };
    
    const updatedTasks = [...tasks, newTask];
    localStorage.setItem('warehouse_tasks', JSON.stringify(updatedTasks));
    
    // Sync to backend
    try {
      await this.syncToBackend('CREATE', newTask);
      console.log(`Task ${taskData.task_name} (ID: ${newTaskId}) synced to backend`);
    } catch (error) {
      console.warn('Failed to sync task to backend:', error);
      // Continue with local operation even if backend sync fails
    }
    
    return { 
      success: true, 
      task: newTask, 
      message: `Task ${taskData.task_name} assigned successfully` 
    };
  }

  // Update task status
  static async updateTaskStatus(taskId: number, status: Task['status']): Promise<{ success: boolean; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    
    const taskIndex = tasks.findIndex((task: Task) => task.id === taskId);
    if (taskIndex === -1) {
      return { success: false, message: 'Task not found' };
    }
    
    const originalTask = tasks[taskIndex];
    const updatedTask = {
      ...originalTask,
      status,
      completed_at: status === 'completed' ? new Date() : originalTask.completed_at
    };
    
    tasks[taskIndex] = updatedTask;
    localStorage.setItem('warehouse_tasks', JSON.stringify(tasks));
    
    // Sync to backend
    try {
      await this.syncToBackend('UPDATE', updatedTask);
      console.log(`Task status updated for ID: ${taskId} to ${status}`);
    } catch (error) {
      console.warn('Failed to sync task status to backend:', error);
    }
    
    return { success: true, message: `Task status updated to ${status}` };
  }

  // Delete task
  static async deleteTask(taskId: number): Promise<{ success: boolean; message?: string }> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const storedTasks = localStorage.getItem('warehouse_tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];
    
    const taskToDelete = tasks.find((task: Task) => task.id === taskId);
    if (!taskToDelete) {
      return { success: false, message: 'Task not found' };
    }
    
    const filteredTasks = tasks.filter((task: Task) => task.id !== taskId);
    localStorage.setItem('warehouse_tasks', JSON.stringify(filteredTasks));
    
    // Sync to backend
    try {
      await this.syncToBackend('DELETE', taskToDelete);
      console.log(`Task deleted: ${taskToDelete.task_name} (ID: ${taskId})`);
    } catch (error) {
      console.warn('Failed to sync task deletion to backend:', error);
    }
    
    return { success: true, message: `Task ${taskToDelete.task_name} deleted successfully` };
  }

  // Get task history (simplified format for display)
  static async getTaskHistory(): Promise<TaskHistoryItem[]> {
    // First try to get from actual tasks
    try {
      const tasks = await this.getTasks();
      if (tasks.length > 0) {
        return tasks.map(task => ({
          task_name: task.task_name,
          worker: task.worker,
          workload: task.workload,
          status: task.status
        }));
      }
    } catch (error) {
      console.warn('Failed to get tasks for history, using mock data');
    }
    
    // Fallback to mock data if no tasks exist
    return mockTaskHistory;
  }

  // Batch operations for multiple tasks
  static async batchUpdateTaskStatus(taskIds: number[], status: Task['status']): Promise<{ success: boolean; message?: string }> {
    const results = await Promise.allSettled(
      taskIds.map(id => this.updateTaskStatus(id, status))
    );
    
    const failedUpdates = results.filter(result => 
      result.status === 'rejected' || 
      (result.status === 'fulfilled' && !result.value.success)
    );
    
    if (failedUpdates.length > 0) {
      return { 
        success: false, 
        message: `Failed to update ${failedUpdates.length} out of ${taskIds.length} tasks` 
      };
    }
    
    return { 
      success: true, 
      message: `Successfully updated ${taskIds.length} tasks to ${status}` 
    };
  }

  // Get tasks by worker
  static async getTasksByWorker(worker: string): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.worker === worker);
  }

  // Get tasks by status
  static async getTasksByStatus(status: Task['status']): Promise<Task[]> {
    const tasks = await this.getTasks();
    return tasks.filter(task => task.status === status);
  }

  // Get task statistics
  static async getTaskStats(): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
  }> {
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
  }

  // Sync operations to backend (simulate API calls)
  private static async syncToBackend(operation: 'CREATE' | 'UPDATE' | 'DELETE', task: Task): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const apiPayload = taskToApiPayload(task);
    
    // Simulate different API endpoints
    switch (operation) {
      case 'CREATE':
        console.log('POST /api/tasks', {
          ...apiPayload,
          // Log the task creation details
          items_count: task.items.length,
          container_volume: task.container ? 
            (task.container.length * task.container.width * task.container.height) : 0
        });
        // Real API call: await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(apiPayload) })
        break;
      case 'UPDATE':
        console.log(`PUT /api/tasks/${task.id}`, {
          task_id: task.id,
          status: task.status,
          completed_at: task.completed_at?.toISOString()
        });
        // Real API call: await fetch(`/api/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify(apiPayload) })
        break;
      case 'DELETE':
        console.log(`DELETE /api/tasks/${task.id}`, {
          task_id: task.id,
          task_name: task.task_name
        });
        // Real API call: await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' })
        break;
    }
    
    // Simulate random API failures (5% chance)
    if (Math.random() < 0.05) {
      throw new Error(`Backend sync failed for ${operation} operation`);
    }
  }
}