// src/services/taskService.ts
import { Task, TaskInput, TaskHistoryItem, TaskApiPayload } from '../types';
import { mockTasks, mockTaskHistory } from '../mocks/dataManager';
import { authService } from './authService';

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

// 添加API配置
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// 获取认证token的辅助函数
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

  // 辅助方法：根据尺寸查找或创建容器
  private static async findOrCreateContainer(containerDimensions: { length: number; width: number; height: number }): Promise<number> {
    try {
      // 首先获取所有容器
      const response = await fetch(`${API_BASE_URL}/api/manager/get_containers`, {
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        const containers = data.containers || [];

        // 查找匹配尺寸的容器
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

      // 如果没找到匹配的容器，创建新的
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

      if (createResponse.ok) {
        const createData = await createResponse.json();
        console.log('Created new container:', createData.container.container_id);
        return createData.container.container_id;
      } else {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create container');
      }
    } catch (error) {
      console.error('Error finding/creating container:', error);
      throw error;
    }
  }

  // 修改assignTask方法，正确调用后端API
  static async assignTask(taskData: TaskInput): Promise<{ success: boolean; task: Task; message?: string }> {
    try {
      console.log('Assigning task:', taskData);

      // 首先找到或创建容器
      const containerId = await this.findOrCreateContainer(taskData.container);

      // 然后创建任务，包含物品分配
      const response = await fetch(`${API_BASE_URL}/api/manager/assign_task`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          task_name: taskData.task_name,
          container_id: containerId,
          assigned_to: taskData.worker,  // 关联到worker
          item_ids: taskData.item_ids,   // 分配物品
          // deadline: 可以添加deadline支持
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Task assigned successfully:', result);

        // 获取item信息用于前端显示
        const storedItems = localStorage.getItem('warehouse_items');
        const allItems = storedItems ? JSON.parse(storedItems) : [];
        const taskItems = allItems.filter((item: any) => taskData.item_ids.includes(item.id));

        // 构造前端需要的Task对象格式
        const newTask: Task = {
          id: result.task_id,
          task_name: taskData.task_name,
          manager: authService.getUsername() || 'manager1',
          worker: taskData.worker,
          workload: taskData.item_ids.length,
          status: 'in_progress',
          items: taskItems,
          container: {
            length: taskData.container.length,
            width: taskData.container.width,
            height: taskData.container.height
          },
          created_at: new Date()
        };

        // 同时保存到localStorage作为缓存
        const storedTasks = localStorage.getItem('warehouse_tasks');
        const tasks = storedTasks ? JSON.parse(storedTasks) : [];
        const updatedTasks = [...tasks, newTask];
        localStorage.setItem('warehouse_tasks', JSON.stringify(updatedTasks));

        return { 
          success: true, 
          task: newTask, 
          message: `Task assigned to ${taskData.worker} with ${result.items_assigned} items` 
        };
      } else {
        const errorData = await response.json();
        console.error('Error assigning task:', errorData);
        return { 
          success: false, 
          message: errorData.message || 'Failed to assign task' 
        };
      }
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

  // 移除原来的模拟syncToBackend方法
  private static async syncToBackend(operation: 'CREATE' | 'UPDATE' | 'DELETE', task: Task): Promise<void> {
    // 现在在assignTask中直接调用真实API，不需要额外同步
    console.log(`Task ${operation} operation handled in assignTask method`);
  }
}